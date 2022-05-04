import {Component, OnInit, Input} from '@angular/core';
import {ButtonAppearance, Icon, Shape, Collection} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {Observable} from 'rxjs';
import {BoardStore, ListStore, UserStore} from '../services/types';
import {ListFormComponent} from '../list-form/list-form.component';
import {CardFormComponent} from '../card-form/card-form.component';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() public board: BoardStore | undefined;
  public imagePath: string = 'assets/background.png';
  public buttonContentList: string = 'Add List';
  public buttonContentCard: string = 'Add Card';
  public buttonSize: string = 'width: 48px; height: 48px;';
  public buttonAppearance: typeof ButtonAppearance = ButtonAppearance;
  public icon: typeof Icon = Icon;
  public shape: typeof Shape = Shape;
  public boardID: string = '';
  public members: UserStore[] = [];

  public lists$: Observable<ListStore[]> = this.crudService.handleData<ListStore>(Collection.LISTS);
  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);
  public boards$: Observable<BoardStore[]> = this.crudService.handleData<BoardStore>(Collection.BOARDS);

  constructor(private crudService: CrudService,
              public dialog: MatDialog,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        this.boardID = params['id'];
        if (this.boardID) {
          this.crudService.getUserDoc<BoardStore>(Collection.BOARDS, this.boardID)
            .subscribe((board: BoardStore | undefined) => {
              this.board = board;
              this.members = [];
              this.getMembers();
            });
        }
      }
    );
  }

  public trackByFn(index: number, item: ListStore): number {
    return index;
  }

  public getMembers(): void {
    this.board?.membersID.forEach((memberID: string) => {
      this.crudService.getUserDoc<UserStore>(Collection.USERS, memberID)
        .subscribe((user: UserStore | undefined) => {
            if (user) this.members?.push(user);
          }
        );
    })
  }

  public openListDialog(): void {
    this.dialog.open(ListFormComponent, {data: {boardID: this.boardID}});
  }

  public openCardDialog(): void {
    this.dialog.open(CardFormComponent);
  }

}
