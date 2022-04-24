import { Component, OnInit, Input } from '@angular/core';
import { List } from 'src/app/board-list/models/list';
import { Card } from 'src/app/task-card/models/card';
import { CARDS } from 'src/app/mock-cards';
import {ButtonAppearance, Collection, Icon} from '../enums';
import {CrudService} from "../services/crud/crud.service";
import {BoardComponent} from "../board/board.component";
import {Observable} from "rxjs";
import {CardStore, ListStore} from "../services/types";

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent implements OnInit {

  @Input() public list: any;
  // public cards: Card[] = CARDS;
  public icon: typeof Icon = Icon;
  public buttonAppearance: typeof ButtonAppearance = ButtonAppearance;
  public cards: Observable<CardStore[]> = this.crudService.handleData<CardStore>(Collection.CARDS);

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
  }

  public trackByFn (index: number, item: Card): number {
    return index;
  }

  public deleteList(id: string) {
    this.crudService.deleteObject(Collection.LISTS, id);
  }

  public editList(id: string, data: {}) {
    this.crudService.updateObject(Collection.LISTS, id, data);
  }

}
