import {Component, Input, OnInit} from '@angular/core';
import {Collection, Status} from '../enums';
import {CrudService} from "../services/crud/crud.service";
import {CardStore, UserStore} from "../services/types";
import {Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {CardFormUpdateComponent} from "../card-form-update/card-form-update.component";

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {

  @Input() public card: CardStore | undefined;
  public status: typeof Status = Status;
  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);

  constructor(private crudService: CrudService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  openDialog(id: string, card: CardStore) {
    this.dialog.open(CardFormUpdateComponent, {data: {id: id, card: card}});
  }

  public deleteCard(id: string) {
    this.crudService.deleteObject(Collection.CARDS, id);
  }

}
