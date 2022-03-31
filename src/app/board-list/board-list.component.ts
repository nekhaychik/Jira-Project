import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { List } from 'src/app/board-list/models/list';
import { LISTS } from 'src/app/mock-lists';
import { Card } from 'src/app/task-card/models/card';
import { CARDS } from 'src/app/mock-cards';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardListComponent implements OnInit {
  lists: List[] = LISTS;

  cards: Card[] = CARDS;

  constructor() { }

  ngOnInit(): void {
  }

}
