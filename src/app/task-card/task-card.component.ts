import {Component, Input, OnInit} from '@angular/core';
import {Collection, Status} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {CardStore, UserStore} from '../services/types';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {CardFormUpdateComponent} from '../card-form-update/card-form-update.component';
import {FullCardComponent} from '../full-card/full-card.component';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {

  @Input() public card: CardStore | undefined;
  public status: typeof Status = Status;
  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);
  private boardID: string = '';

  constructor(private crudService: CrudService,
              private dialog: MatDialog,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.boardID = params['id'];
      }
    );
  }

  public shortDescription(description: string): string {
    if (description.length > 130) {
      return description.slice(0, 129) + '...';
    }
    return description;
  }

  public openUpdateCardDialog(card: CardStore): void {
    this.dialog.open(CardFormUpdateComponent, {data: {card: card, boardID: this.boardID}});
  }

  public deleteCard(id: string): void {
    this.crudService.deleteObject(Collection.CARDS, id);
  }

  public openFullCard(card: CardStore): void {
    this.dialog.open(FullCardComponent, {data: {card: card, boardID: this.boardID}});
  }

}
