import {Component, OnInit} from '@angular/core';
import {Observable, take} from "rxjs";
import {BoardStore} from "../services/types";
import {CrudService} from "../services/crud/crud.service";
import {Collection} from "../enums";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  public imagePath: string = 'assets/background.png';
  public board: any | undefined;
  public boards$: Observable<BoardStore[]> = this.crudService.handleData<BoardStore>(Collection.BOARDS);

  constructor(private crudService: CrudService) {
  }

  ngOnInit(): void {
    this.board = this.boards$.pipe(take(1));
  }

}
