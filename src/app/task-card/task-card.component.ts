import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Collection, Paths, Status} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {BoardStore, CardStore, UserStore} from '../services/types';
import {Observable, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {CardFormUpdateComponent} from '../card-form-update/card-form-update.component';
import {Router} from '@angular/router';
import {SHORT_DESCRIPTION_MAX_LENGTH} from '../constants';
import {AuthService} from "../services/auth/auth.service";
import firebase from "firebase/compat";

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit, OnDestroy {

  @Input()
  public card: CardStore | undefined;
  @Input()
  public board: BoardStore | undefined;
  public status: typeof Status = Status;
  private authUser: firebase.User | null = null;
  private subscriptionList: Subscription[] = [];
  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);
  private boards$: Observable<BoardStore[]> = this.crudService.handleData<BoardStore>(Collection.BOARDS);

  constructor(private crudService: CrudService,
              private authService: AuthService,
              private dialog: MatDialog,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.getAuthUser();
    this.isExitAssignee();
  }

  private getAuthUser(): void {
    this.subscriptionList.push(
      this.authService.user$.subscribe((value: firebase.User | null) => {
        this.authUser = value;
      })
    );
  }

  private isExitAssignee(): void {
    this.subscriptionList.push(
      this.boards$.subscribe(() => {
        if (this.card) {
          if (!this.board?.membersID.includes(this.card.memberID)) {
            this.updateAssignee();
          }
        }
      })
    );

  }

  private updateAssignee(): void {
    if (this.card && this.authUser) {
      this.subscriptionList.push(
        this.crudService.updateObject(Collection.CARDS, this.card.id, {memberID: this.authUser.uid}).subscribe()
      )
    }
  }

  public shortDescription(description: string): string {
    if (description.length > SHORT_DESCRIPTION_MAX_LENGTH) {
      return description.slice(0, SHORT_DESCRIPTION_MAX_LENGTH - 1) + '...';
    }
    return description;
  }

  public openUpdateCardDialog(card: CardStore): void {
    this.dialog.open(CardFormUpdateComponent, {data: {card: card, board: this.board}});
  }

  public deleteCard(id: string): void {
    this.subscriptionList.push(
      this.crudService.deleteObject(Collection.CARDS, id).subscribe()
    );
  }

  public openFullCard(card: CardStore): void {
    if (this.board) {
      this.router.navigate([Paths.board + '/' + this.board.id + '/' + card.id]);
    }
  }

  public ngOnDestroy(): void {
    this.subscriptionList.forEach((s: Subscription) => s.unsubscribe());
  }

}
