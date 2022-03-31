import { Component, OnInit } from '@angular/core';
import { List } from 'src/app/board-list/models/list';
import { LISTS } from 'src/app/mock-lists';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  srcIm: string = 'assets/background.png';
  boardTitle: string = 'Board 1';
  members: string[] = [
    'Irina Nekhaychik',
    'Vlad Yaromchik',
    'Ivan Glaz'
  ];
  lists: List[] = LISTS;
  buttonAdd = 'Add';

  constructor() { }

  ngOnInit(): void {
  }

}
