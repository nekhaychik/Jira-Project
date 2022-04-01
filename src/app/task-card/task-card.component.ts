import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/task-card/models/card';
import { Status } from '../enums';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {

  @Input() public card: Card | undefined;
  public status: typeof Status = Status;

  constructor() {
  }

  ngOnInit(): void {
  }

}
