import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {BoardStore} from '../services/types';
import {Collection} from '../enums';
import {CrudService} from '../services/crud/crud.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public boards$: Observable<BoardStore[]> = this.crudService.handleData<BoardStore>(Collection.BOARDS);

  constructor(private crudService: CrudService) {
  }

  ngOnInit(): void {
  }

  public trackByFn(index: number, item: BoardStore): number {
    return index;
  }

}
