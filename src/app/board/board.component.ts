import {Component, OnInit, OnDestroy} from '@angular/core';
import {ButtonAppearance, Icon, Shape, Collection, Paths} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {Observable, Subscription} from 'rxjs';
import {BoardStore, CardStore, ListStore, UserStore} from '../services/types';
import {ListFormComponent} from '../list-form/list-form.component';
import {CardFormComponent} from '../card-form/card-form.component';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {BoardUpdateComponent} from '../board-update/board-update.component';
import {MembersFormComponent} from '../members-form/members-form.component';
import {AuthService} from '../services/auth/auth.service';
import firebase from 'firebase/compat';

const SORTING_FIELD: string = 'dateCreating';
const SORTING_FIELD_NAME: string = 'name';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy {

  public buttonContentList: string = 'Add List';
  public buttonContentCard: string = 'Add Card';
  public buttonSize: string = 'width: 48px; height: 48px;';
  public buttonAppearance: typeof ButtonAppearance = ButtonAppearance;
  public icon: typeof Icon = Icon;
  public shape: typeof Shape = Shape;
  public searchValue: string = '';

  public board: BoardStore | undefined;
  private boardID: string = '';
  public membersID: string[] = [];
  public lists: ListStore[] = [];
  private listsID: string[] = [];
  public cards: CardStore[] = [];
  public users: UserStore[] = [];
  public authUser: firebase.User | null = null;

  private subscriptionList: Subscription[] = [];
  private lists$: Observable<ListStore[]> = this.crudService.handleData<ListStore>(Collection.LISTS);
  private boards$: Observable<BoardStore[]> = this.crudService.handleData<BoardStore>(Collection.BOARDS);
  private cards$: Observable<CardStore[]> = this.crudService.handleData<CardStore>(Collection.CARDS);
  private users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);

  constructor(private crudService: CrudService,
              public dialog: MatDialog,
              private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.subscriptionList.push(
      this.route.params.subscribe(
        (params: Params) => {
          this.boardID = params['id'];
          this.getBoard();
          this.getLists();
          this.getMembersID();
          this.getAuthUser();
          this.getUsers();
          this.getCards();
        }
      )
    );
  }

  public trackByFn(index: number, item: ListStore | UserStore | CardStore): number {
    return index;
  }

  private getAuthUser(): void {
    this.subscriptionList.push(
      this.authService.user$.subscribe((value: firebase.User | null) => {
        this.authUser = value;
      })
    )
  }

  private getMembersID(): void {
    this.subscriptionList.push(
      this.boards$.subscribe((boards: BoardStore[]) => {
        this.membersID = boards.filter((board: BoardStore) => board.id === this.boardID)[0].membersID;
      })
    );
  }

  private getUsers(): void {
    this.subscriptionList.push(
      this.users$.subscribe((users: UserStore[]) => {
        this.users = users.sort(this.byField(SORTING_FIELD_NAME));
      })
    )
  }

  private getBoard(): void {
    this.subscriptionList.push(
      this.boards$.subscribe((boards: BoardStore[]) => {
        this.board = boards.filter((board: BoardStore) => board.id === this.boardID)[0];
      })
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
        this.listsID = this.lists.map((list: ListStore) => list.id);
      })
    );
  }

  private getCards(): void {
    this.cards = [];
    this.subscriptionList.push(
      this.cards$.subscribe((cards: CardStore[]) => {
        this.cards = cards.filter((card: CardStore) => this.listsID.includes(card.listID));
      })
    )
  }

  public openListDialog(): void {
    if (this.board) {
      this.dialog.open(ListFormComponent, {data: {boardID: this.board.id}});
    }
  }

  public openCardDialog(isButtonDisable: boolean): void {
    if (!isButtonDisable && this.board) {
      this.dialog.open(CardFormComponent, {data: {board: this.board}});
    }
  }

  public openFullCard(card: CardStore): void {
    if (this.board) {
      this.router.navigate([Paths.board + '/' + this.board.id + '/' + card.id]);
    }
  }

  public openBoardDialog(): void {
    if (this.board) {
      this.dialog.open(BoardUpdateComponent, {data: {boardID: this.board.id, boardName: this.board.name}});
    }
  }

  public openMembersDialog(): void {
    if (this.board) {
      this.dialog.open(MembersFormComponent, {data: {board: this.board}});
    }
  }

  public ngOnDestroy(): void {
    this.subscriptionList.forEach((s: Subscription) => s.unsubscribe());
  }

}
