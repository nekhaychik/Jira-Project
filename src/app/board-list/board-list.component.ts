import {Component, OnInit, Input, ViewEncapsulation, OnDestroy} from '@angular/core';
import {ButtonAppearance, Collection, Icon, Size} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {BoardStore, CardStore, ListStore} from '../services/types';
import {MatDialog} from '@angular/material/dialog';
import {ListFormUpdateComponent} from '../list-form-update/list-form-update.component';
import {CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {AuthService} from '../services/auth/auth.service';
import firebase from 'firebase/compat';
import {Observable, Subscription, switchMap} from 'rxjs';

const SORTING_FIELD: string = 'position';

@Component({
  selector: '[app-board-list]',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BoardListComponent implements OnInit, OnDestroy {

  @Input()
  public list: ListStore | undefined;
  @Input()
  public board: BoardStore | undefined;

  public icon: typeof Icon = Icon;
  public buttonAppearance: typeof ButtonAppearance = ButtonAppearance;
  public buttonSize: Size = Size.m;

  private authUser: firebase.User | null = null;
  private lists: ListStore[] = [];
  public cards: CardStore[] = [];
  public numberOfTasks: number = 0;

  private subscriptionList: Subscription[] = [];
  private lists$: Observable<ListStore[]> = this.crudService.handleData<ListStore>(Collection.LISTS);
  private cards$: Observable<CardStore[]> = this.crudService.handleData<CardStore>(Collection.CARDS);

  constructor(private crudService: CrudService,
              public dialog: MatDialog,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
    console.log(this.list)
    this.getCards();
    this.getAuthUser();
    this.getLists();
  }

  private getCards(): void {
    this.subscriptionList.push(
      this.lists$.pipe(
        switchMap(() => this.cards$),
      ).subscribe((cards: CardStore[]) => {
        this.cards = cards
          .filter((card: CardStore) => card.listID === this.list?.id)
          .sort(this.byField(SORTING_FIELD));
        this.numberOfTasks = this.cards.length;
      })
    );
  }

  private getAuthUser(): void {
    this.subscriptionList.push(
      this.authService.user$.subscribe((value: firebase.User | null) => {
        this.authUser = value;
      })
    );
  }

  private getLists(): void {
    this.lists = [];
    this.subscriptionList.push(
      this.lists$.subscribe((lists: ListStore[]) => {
          this.lists = lists.filter((list: ListStore) => list.boardID === this.list?.boardID);
        }
      )
    );
  }

  private getListName(id: string): string {
    let listsRet: ListStore[];
    listsRet = this.lists.filter((list: ListStore) => list.id === id);
    return listsRet[0].name;
  }

  private byField(field: string): (a: any, b: any) => (1 | -1) {
    return (a: any, b: any) => a[field] > b[field] ? 1 : -1;
  }

  public trackByFn(index: number, item: CardStore): number {
    return index;
  }

  public openUpdateListDialog(id: string, name: string): void {
    this.dialog.open(ListFormUpdateComponent, {data: {id: id, name: name}});
  }

  public deleteList(id: string): void {
    this.subscriptionList.push(
      this.crudService.deleteObject(Collection.LISTS, id).subscribe()
    );
  }

  public editList(id: string, newData: ListStore): void {
    this.subscriptionList.push(
      this.crudService.updateObject(Collection.LISTS, id, newData).subscribe()
    );
  }

  public drop(event: CdkDragDrop<CardStore[]>): void {
    let isMovingInsideTheSameList: boolean = event.previousContainer === event.container;
    if (isMovingInsideTheSameList) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      )
      this.addCardHistory(event.container, event.previousContainer, event.item.data);
      this.updateCardPosition(event.previousContainer);
    }
    this.updateCardPosition(event.container);
  }

  private addCardHistory(container: CdkDropList<CardStore[]>, previousContainer: CdkDropList<CardStore[]>, card: CardStore): void {
    let history: string[] = [];
    const listName: string = this.getListName(previousContainer.id);
    const newListName: string = this.getListName(container.id);
    history.push(this.authUser?.displayName + ' changed status from ' + listName + ' to ' + newListName);

    this.subscriptionList.push(
      this.crudService.updateObject(Collection.CARDS, card.id, {
        listID: container.id,
        history: [...history, ...card.history]
      }).subscribe()
    );
  }

  private updateCardPosition(container: CdkDropList<CardStore[]>) {
    container.data.forEach((card: CardStore, index: number) => {
      this.subscriptionList.push(
        this.crudService.updateObject(Collection.CARDS, card.id, {position: index}).subscribe()
      );
    });
  }

  public ngOnDestroy(): void {
    this.subscriptionList.forEach((s: Subscription) => s.unsubscribe());
  }

}
