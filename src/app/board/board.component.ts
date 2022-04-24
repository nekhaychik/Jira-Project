import { Component, OnInit, Input } from '@angular/core';
import { Board } from './models/board';
import { BOARDS } from '../mock-boards';
import { ButtonAppearance, Icon, Shape, Collection } from '../enums';
import { List } from '../board-list/models/list';
import {CrudService} from "../services/crud/crud.service";
import {Observable} from "rxjs";
import {BoardStore, ListStore, UserStore} from "../services/types";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() public board: any = null;
  public imagePath: string = 'assets/background.png';
  public buttonContentList: string = 'Add List';
  public buttonContentCard: string = 'Add Card';
  public buttonSize: string = 'width: 48px; height: 48px;';
  public buttonAppearance: typeof ButtonAppearance = ButtonAppearance;
  public icon: typeof Icon = Icon;
  public shape: typeof Shape = Shape;

  public lists$: Observable<ListStore[]> = this.crudService.handleData<ListStore>(Collection.LISTS);
  // public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
  }

  public trackByFn (index: number, item: ListStore): number {
    return index;
  }

  public addList() {
    const list = {
      name: 'Test list',
      cardsID: []
    };
    this.crudService.createObject(Collection.LISTS, list).subscribe();
  }

  public addCard() {
    const card = {
      name: 'Test card',
      priority: 'blocked',
      memberID: '3gYhnvX4D5fpTFizLYm1',
      listID: '0PdgRcgVMWNB2Iy2doTv',
      checklist: '5/10'
    };
    this.crudService.createObject(Collection.CARDS, card).subscribe();
  }

  public getLists() {
    this.crudService.getDate(Collection.LISTS).subscribe();
  }

}
