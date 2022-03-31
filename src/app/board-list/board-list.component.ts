import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { List } from 'src/app/board-list/models/list';
import { Card } from 'src/app/task-card/models/card';
import { CARDS } from 'src/app/mock-cards';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent implements OnInit {
  @Input() list: List | undefined;

  cards: Card[] = CARDS;

  constructor() { }

  ngOnInit(): void {
  }

}
