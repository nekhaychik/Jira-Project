import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {ButtonAppearance, Collection, Icon, Size} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {CardStore, ListStore} from '../services/types';
import {MatDialog} from '@angular/material/dialog';
import {ListFormUpdateComponent} from '../list-form-update/list-form-update.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {AuthService} from '../services/auth/auth.service';
import firebase from 'firebase/compat';
import {Observable} from 'rxjs';

@Component({
  selector: '[app-board-list]',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BoardListComponent implements OnInit {

  @Input() public list: ListStore | null = null;
  public icon: typeof Icon = Icon;
  public buttonAppearance: typeof ButtonAppearance = ButtonAppearance;
  public buttonSize: Size = Size.m;
  public cards: CardStore[] = [];
  public listCards: CardStore[] = [];
  private authUser: firebase.User | null = null;
  public lists: ListStore[] = [];

  private lists$: Observable<ListStore[]> = this.crudService.handleData<ListStore>(Collection.LISTS);

  constructor(private crudService: CrudService,
              public dialog: MatDialog,
              private authService: AuthService) {
    this.crudService.handleData<CardStore>(Collection.CARDS).subscribe((cards: CardStore[]) => {
      this.cards = cards as CardStore[];
      this.listCards = this.cards.filter((card: CardStore) => card.listID == this.list?.id).sort(
        this.byField('position')
      );
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => {
      this.authUser = value;
    });
    this.getLists();
  }

  private getLists(): void {
    this.lists = [];
    this.lists$.subscribe((lists: ListStore[]) => {
        this.lists = lists as ListStore[];
        this.lists = this.lists.filter((list: ListStore) => list.boardID === this.list?.boardID);
      }
    );
  }

  private getListName(id: string): string {
    let listsRet: ListStore[];
    listsRet = this.lists.filter((list: ListStore) => list.id === id);
    if (listsRet[0])
      return listsRet[0].name;
    else
      return 'undefined';
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
    this.crudService.deleteObject(Collection.LISTS, id);
  }

  public editList(id: string, newData: ListStore): void {
    this.crudService.updateObject(Collection.LISTS, id, newData);
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
      );

      let history: string[] = [];
      const listName: string = this.getListName(event.previousContainer.id);
      const newListName: string = this.getListName(event.container.id);
      history.push(this.authUser?.displayName + ' changed status from ' + listName + ' to ' + newListName);

      this.crudService.updateObject(Collection.CARDS, event.item.data.id, {listID: event.container.id, history: [...history, ...event.item.data.history]});
      event.previousContainer.data.forEach((card: CardStore, index: number) => {
        this.crudService.updateObject(Collection.CARDS, card.id, {position: index});
      });
    }

    event.container.data.forEach((card: CardStore, index: number) => {
      this.crudService.updateObject(Collection.CARDS, card.id, {position: index});
    });
  }

}
