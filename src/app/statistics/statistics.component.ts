import {Component, OnDestroy, OnInit} from '@angular/core';
import {BoardStore} from '../services/types';
import firebase from 'firebase/compat';
import {Observable, Subscription} from 'rxjs';
import {Collection, Paths, Size} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {AuthService} from '../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit, OnDestroy {

  readonly subscription: Subscription = new Subscription();
  public buttonSize: Size = Size.s;
  public boards: BoardStore[] = [];
  private userAuth: firebase.User | null = null;
  private allBoards$: Observable<BoardStore[]> = this.crudService.handleData<BoardStore>(Collection.BOARDS);

  constructor(private crudService: CrudService,
              private authService: AuthService,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.authService.user$.subscribe((value: firebase.User | null) => {
        this.userAuth = value;
      })
    );
    this.getBoards();
  }

  public trackByFn(index: number, item: BoardStore): number {
    return index;
  }

  private getBoards(): void {
    this.subscription.add(
      this.allBoards$.subscribe((boards: BoardStore[]) => {
        this.boards = [];
        boards.forEach((board: BoardStore) => {
          board.membersID.forEach((memberID: string) => {
            if (memberID === this.userAuth?.uid) {
              this.boards.push(board);
            }
          });
        });
      })
    );
  }

  public navigate(boardID: string): void {
    this.router.navigate([Paths.statistics + '/' + boardID]);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
