import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {BoardStore} from '../services/types';
import {Collection} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {AuthService} from '../services/auth/auth.service';
import firebase from 'firebase/compat';
import {MatDrawer} from '@angular/material/sidenav';

const SORTING_FIELD: string = 'name';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input()
  public drawer: MatDrawer | undefined;
  private subscriptionList: Subscription[] = [];
  public boards: BoardStore[] = [];
  public searchValue: string = '';
  private userAuth: firebase.User | null = null;
  private boards$: Observable<BoardStore[]> = this.crudService.handleData<BoardStore>(Collection.BOARDS);

  constructor(private crudService: CrudService,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
    this.getAuthUser();
    this.getBoards();
  }

  private getAuthUser(): void {
    this.subscriptionList.push(
      this.authService.user$.subscribe((value: firebase.User | null) => {
        this.userAuth = value;
      })
    );
  }

  private getBoards(): void {
    this.boards = [];
    this.subscriptionList.push(
      this.boards$.subscribe((boards: BoardStore[]) => {
        this.boards = boards.filter((board: BoardStore) =>
          board.membersID.includes(<string>this.userAuth?.uid))
          .sort(this.byField(SORTING_FIELD));
      })
    );

  }

  private byField(field: string): (a: any, b: any) => (1 | -1) {
    return (a: any, b: any) => a[field] > b[field] ? 1 : -1;
  }

  public trackByFn(index: number, item: BoardStore): number {
    return index;
  }

  public deleteBoard(id: string): void {
    this.subscriptionList.push(
      this.crudService.deleteObject(Collection.BOARDS, id).subscribe()
    );
  }

  public ngOnDestroy(): void {
    this.subscriptionList.forEach((s: Subscription) => s.unsubscribe());
  }

}
