import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {BoardStore} from '../services/types';
import {Collection} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {AuthService} from '../services/auth/auth.service';
import firebase from 'firebase/compat';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  readonly subscription: Subscription = new Subscription();
  public boards: BoardStore[] = [];
  private userAuth: firebase.User | null = null;
  private boards$: Observable<BoardStore[]> = this.crudService.handleData<BoardStore>(Collection.BOARDS);

  constructor(private crudService: CrudService,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.authService.user$.subscribe((value: firebase.User | null) => {
        this.userAuth = value;
      })
    );
    this.getBoards();
  }

  private getBoards(): void {
    this.subscription.add(
      this.boards$.subscribe((boards: BoardStore[]) => {
        this.boards = [];
        boards.forEach(board => {
          board.membersID.forEach(memberID => {
            if (memberID === this.userAuth?.uid) {
              this.boards.push(board);
              return;
            }
          });
        });
      })
    );
  }

  public trackByFn(index: number, item: BoardStore): number {
    return index;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
