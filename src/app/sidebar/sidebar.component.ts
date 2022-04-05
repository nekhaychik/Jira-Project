import { Component, OnInit } from '@angular/core';
import { Board } from '../board/models/board';
import { BOARDS } from '../mock-boards';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public boards: Board[] = BOARDS;

  constructor() { }

  ngOnInit(): void {
  }

  public trackByFn(index: number, item: Board): number {
    return index;
  }

}
