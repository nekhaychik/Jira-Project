import { Component, OnInit, Input } from '@angular/core';
import { List } from 'src/app/board-list/models/list';
import { Card } from 'src/app/task-card/models/card';
import { CARDS } from 'src/app/mock-cards';
import { Icon } from '../enums';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent implements OnInit {

  @Input() public list: List | undefined;
  public cards: Card[] = CARDS;
  public icon: typeof Icon = Icon;

  constructor() { }

  ngOnInit(): void {
  }

  public trackByFn (index: number, item: Card): number {
    return index;
  }

}
