import {Component, OnInit} from '@angular/core';
import {BOARDS} from "../mock-boards";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  board = BOARDS[0];

  constructor() {
  }

  ngOnInit(): void {
  }

}
