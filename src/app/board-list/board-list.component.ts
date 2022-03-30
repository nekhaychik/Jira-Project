import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { List } from 'src/app/board-list/models/list';
import { LISTS } from 'src/app/mock-lists';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardListComponent implements OnInit {
  lists: List[] = LISTS;

  testForm = new FormGroup({
    testValue: new FormControl(true),
  });

  skeletonVisible = false;
  lightMode = false;
  placeholder = 'Some paragraph with information';

  showSkeleton() {
    this.skeletonVisible = !this.skeletonVisible;
  }

  toggleLight() {
    this.lightMode = !this.lightMode;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
