import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/task-card/models/card';
import {Collection, Status} from '../enums';
import {CrudService} from "../services/crud/crud.service";

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {

  @Input() public card: any;
  public status: typeof Status = Status;

  constructor(private crudService: CrudService) {
  }

  ngOnInit(): void {
  }

  public deleteCard(id: string) {
    this.crudService.deleteObject(Collection.CARDS, id);
  }

}
