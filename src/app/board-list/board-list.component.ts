import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {ButtonAppearance, Collection, Icon, Size} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {CardStore, ListStore} from '../services/types';
import {MatDialog} from '@angular/material/dialog';
import {ListFormUpdateComponent} from '../list-form-update/list-form-update.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

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

  constructor(private crudService: CrudService,
              public dialog: MatDialog) {
    this.crudService.handleData<CardStore>(Collection.CARDS).subscribe((cards: CardStore[]) => {
      this.cards = cards as CardStore[];
      this.listCards = this.cards.filter((card: CardStore) => card.listID == this.list?.id).sort(
        this.byField('position')
      );
    });
  }

  ngOnInit(): void {
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
      this.crudService.updateObject(Collection.CARDS, event.item.data.id, {listID: event.container.id,});
      event.previousContainer.data.forEach((card: CardStore, index: number) => {
        this.crudService.updateObject(Collection.CARDS, card.id, {position: index});
      });
    }

    event.container.data.forEach((card: CardStore, index: number) => {
      this.crudService.updateObject(Collection.CARDS, card.id, {position: index});
    });
  }

}
