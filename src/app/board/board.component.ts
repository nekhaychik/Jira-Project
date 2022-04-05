import { Component, OnInit } from '@angular/core';
import { Board } from './models/board';
import { BOARDS } from '../mock-boards';
import { Icon, Shape } from '../enums';
import {List} from "../board-list/models/list";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  public board: Board = BOARDS[0];
  public imagePath: string = 'assets/background.png';
  public buttonContent: string = 'Add';
  public buttonSize: string = 'width: 48px; height: 48px;';
  public icon: typeof Icon = Icon;
  public shape: typeof Shape = Shape;

  constructor() { }

  ngOnInit(): void {
  }

  public trackByFn (index: number, item: string | List): number {
    return index;
  }

}
