import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Collection, Paths, Status} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {BoardStore, CardStore, UserStore} from '../services/types';
import {Observable, Subscription, switchMap} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {CardFormUpdateComponent} from '../card-form-update/card-form-update.component';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {SHORT_DESCRIPTION_MAX_LENGTH} from '../constants';

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
  private subscriptionList: Subscription[] = [];
  private boardID: string = '';
  public status: typeof Status = Status;
  public assignee: UserStore | undefined;
  private cards$: Observable<CardStore[]> = this.crudService.handleData(Collection.CARDS);

  constructor(private crudService: CrudService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.subscriptionList.push(
      this.route.params.subscribe(
        (params: Params) => {
          this.boardID = params['id'];
        }
      )
    );
    this.getAssignee();
  }

  private getAssignee(): void {
    if (this.card) {
      this.subscriptionList.push(
        this.cards$.pipe(
          switchMap(() => this.crudService.getDataDoc<UserStore>(Collection.USERS, <string>this.card?.memberID))
        ).subscribe((user: UserStore | undefined) => {
          this.assignee = user;
        })
      );
    }
  }

  public shortDescription(description: string): string {
    if (description.length > SHORT_DESCRIPTION_MAX_LENGTH) {
      return description.slice(0, SHORT_DESCRIPTION_MAX_LENGTH - 1) + '...';
    }
    return description;
  }

  public openUpdateCardDialog(card: CardStore): void {
    this.dialog.open(CardFormUpdateComponent, {data: {card: card, board: this.board, boardID: this.boardID}});
  }

  public deleteCard(id: string): void {
    this.subscriptionList.push(
      this.crudService.deleteObject(Collection.CARDS, id).subscribe()
    );
  }

  public openFullCard(card: CardStore): void {
    this.router.navigate([Paths.board + '/' + this.boardID + '/' + card.id]);
  }

  public ngOnDestroy(): void {
    this.subscriptionList.forEach((s: Subscription) => s.unsubscribe());
  }

}
