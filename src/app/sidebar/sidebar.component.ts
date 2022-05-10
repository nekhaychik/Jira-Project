import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BoardStore, UserStore} from '../services/types';
import {Collection} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {AuthService} from "../services/auth/auth.service";
import firebase from "firebase/compat";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public boards: BoardStore[] = [];
  private userAuth: firebase.User | null = null;
  public user: UserStore | undefined;
  public boards$: Observable<BoardStore[]> = this.crudService.handleData<BoardStore>(Collection.BOARDS);
  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);

  constructor(private crudService: CrudService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => {
      this.userAuth = value;
      this.getUser();
    });
    this.getBoards();
  }

  private getUser(): void {
    this.users$.subscribe((users: UserStore[]) => {
      let allUsers: UserStore[] = users as UserStore[];
      allUsers = allUsers.filter((user: UserStore) => user.uid === this.userAuth?.uid);
      this.user = allUsers[0];
    });
  }

  private getBoards(): void {
    this.boards$.subscribe((boards: BoardStore[]) => {
      this.boards = [];
      boards.forEach(board => {
        board.membersID.forEach(memberID => {
          if (memberID === this.user?.id){
            this.boards.push(board);
            return;
          }
        });
      });
    });
  }

  public trackByFn(index: number, item: BoardStore): number {
    return index;
  }

}
