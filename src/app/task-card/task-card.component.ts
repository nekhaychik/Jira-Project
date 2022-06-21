import {Component, Input, OnDestroy} from '@angular/core';
import {Collection, Paths, Status} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {BoardStore, CardStore, UserStore} from '../services/types';
import {Observable, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {CardFormUpdateComponent} from '../card-form-update/card-form-update.component';
import {Router} from '@angular/router';
import {SHORT_DESCRIPTION_MAX_LENGTH} from '../constants';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnDestroy {

  @Input()
  public card: CardStore | undefined;
  @Input()
  public board: BoardStore | undefined;

  public status: typeof Status = Status;

  private subscriptionList: Subscription[] = [];
  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);

  constructor(private crudService: CrudService,
              private dialog: MatDialog,
              private router: Router) {
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
