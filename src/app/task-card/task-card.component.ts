import { Component, OnInit, Input } from '@angular/core';
import { Card } from 'src/app/task-card/models/card';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  @Input() card: Card | undefined;
   critical: string = 'critical';
   blocked: string = 'blocked';

  constructor() { }

  ngOnInit(): void {
  }

}
