import { Component, OnInit } from '@angular/core';

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
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
