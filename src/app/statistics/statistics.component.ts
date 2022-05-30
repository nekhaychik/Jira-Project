import { Component, OnInit } from '@angular/core';
import {BoardStore} from '../services/types';
import firebase from 'firebase/compat';
import {Observable} from 'rxjs';
import {Collection, Paths} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {AuthService} from '../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  public boards: BoardStore[] = [];
  private userAuth: firebase.User | null = null;
  private boards$: Observable<BoardStore[]> = this.crudService.handleData<BoardStore>(Collection.BOARDS);

  constructor(private crudService: CrudService,
              private authService: AuthService,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => {
      this.userAuth = value;
    });
    this.getBoards();
  }

  private getBoards(): void {
    this.boards$.subscribe((boards: BoardStore[]) => {
      this.boards = [];
      boards.forEach((board: BoardStore) => {
        board.membersID.forEach((memberID: string) => {
          if (memberID === this.userAuth?.uid){
            this.boards.push(board);
          }
        });
      });
    });
  }

  public navigate(boardID: string): void {
      this.router.navigate([Paths.statistics + '/' + boardID]);
  }
}
