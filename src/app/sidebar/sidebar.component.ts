import {Component, NgIterable, OnInit} from '@angular/core';
import { Board } from '../board/models/board';
import { BOARDS } from '../mock-boards';
import {Observable} from "rxjs";
import {BoardStore, CardStore, ID} from "../services/types";
import {Collection} from "../enums";
import {CrudService} from "../services/crud/crud.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public boards: Observable<BoardStore[]> = this.crudService.handleData<BoardStore>(Collection.BOARDS);

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
  }

  public trackByFn(index: number, item: any): number {
    return index;
  }

}
