import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {ButtonAppearance, Collection, Icon} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {Subscription} from 'rxjs';
import {CardStore, ListStore} from '../services/types';
import {MatDialog} from '@angular/material/dialog';
import {ListFormUpdateComponent} from '../list-form-update/list-form-update.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

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
  public cards: CardStore[] = [];
  public cards$: Subscription = this.crudService.handleData<CardStore>(Collection.CARDS).subscribe(cards => {
    this.cards = cards as CardStore[];
  });
  public listCards: CardStore[] = [];

  constructor(private crudService: CrudService,
              public dialog: MatDialog) {
    this.crudService.handleData<CardStore>(Collection.CARDS).subscribe(cards => {
      this.cards = cards as CardStore[];
      this.listCards = this.cards.filter(card => card.listID == this.list?.id);
    });
  }

  ngOnInit(): void {
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

  drop(event: CdkDragDrop<CardStore[]>) {
    let isMovingInsideTheSameList = event.previousContainer === event.container;
    if (isMovingInsideTheSameList) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      console.log(event.item.data.listID)
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const data = {
        listID: event.container.id,
      };
      this.crudService.updateObject(Collection.CARDS, event.item.data.id, data);
      event.item.data.listID = event.container.id;
      console.log(event.item.data.id, event.container.id)
    }
  }

}
