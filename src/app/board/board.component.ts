import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {ButtonAppearance, Icon, Shape, Collection} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {Observable, Subscription, switchMap, tap} from 'rxjs';
import {BoardStore, ListStore, UserStore} from '../services/types';
import {ListFormComponent} from '../list-form/list-form.component';
import {CardFormComponent} from '../card-form/card-form.component';
import {ActivatedRoute, Params} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {BoardUpdateComponent} from '../board-update/board-update.component';
import {MembersFormComponent} from '../members-form/members-form.component';

const SORTING_FIELD: string = 'dateCreating';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  @Input()
  public board: BoardStore | undefined;
  private subscriptionList: Subscription[] = [];
  readonly buttonContentList: string = 'Add List';
  readonly buttonContentCard: string = 'Add Card';
  readonly buttonSize: string = 'width: 48px; height: 48px;';
  public buttonAppearance: typeof ButtonAppearance = ButtonAppearance;
  public icon: typeof Icon = Icon;
  public shape: typeof Shape = Shape;
  private boardID: string = '';
  public membersID: string[] = [];
  public lists: ListStore[] = [];
  private lists$: Observable<ListStore[]> = this.crudService.handleData<ListStore>(Collection.LISTS);
  private boards$: Observable<BoardStore[]> = this.crudService.handleData<BoardStore>(Collection.BOARDS);
  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);
  public users: UserStore[] = [];

  constructor(private crudService: CrudService,
              public dialog: MatDialog,
              private route: ActivatedRoute) {
  }

  test(val: ListStore) {
    console.log(val)
  }

  public ngOnInit(): void {
    this.subscriptionList.push(
      this.route.params.subscribe(
        (params: Params) => {
          this.boardID = params['id'];
          this.getLists();
          this.getBoard(this.boardID);
        }
      )
    );
  }



  public trackByFn(index: number, item: ListStore): number {
    return index;
  }

  private getBoard(boardID: string): void {
    this.subscriptionList.push(
      this.boards$.pipe(
        switchMap(() => this.crudService.getDataDoc<BoardStore>(Collection.BOARDS, boardID)),
        tap((board: BoardStore | undefined) => {
          if (board) {
            this.board = board;
            this.membersID = this.board.membersID;
          }
        })
      ).subscribe()
    );
  }

  private byField(field: string): (a: any, b: any) => (1 | -1) {
    return (a: any, b: any) => a[field] > b[field] ? 1 : -1;
  }

  private getLists(): void {
    this.lists = [];
    this.subscriptionList.push(
      this.lists$.subscribe((lists: ListStore[]) => {
          this.lists = lists.filter((list: ListStore) => list.boardID === this.boardID)
            .sort(this.byField(SORTING_FIELD));
        }
      )
    );
  }

  public openListDialog(): void {
    this.dialog.open(ListFormComponent, {data: {boardID: this.boardID}});
  }

  public openCardDialog(isButtonDisable: boolean): void {
    if (!isButtonDisable) {
      this.dialog.open(CardFormComponent, {data: {boardID: this.boardID, board: this.board}});
    }
  }

  public openBoardDialog(): void {
    if (this.board) {
      this.dialog.open(BoardUpdateComponent, {data: {boardID: this.boardID, boardName: this.board.name}});
    }
  }

  public openMembersDialog(): void {
    console.log(this.boardID)
    this.dialog.open(MembersFormComponent, {data: {boardID: this.boardID, board: this.board}});
  }

  public ngOnDestroy(): void {
    this.subscriptionList.forEach((s: Subscription) => s.unsubscribe());
  }

}
