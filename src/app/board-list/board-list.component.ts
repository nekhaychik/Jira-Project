import {Component, OnInit, Input} from '@angular/core';
import {Card} from 'src/app/task-card/models/card';
import {ButtonAppearance, Collection, Icon} from '../enums';
import {CrudService} from "../services/crud/crud.service";
import {Observable} from "rxjs";
import {CardStore, ListStore} from "../services/types";
import {MatDialog} from "@angular/material/dialog";
import {ListFormUpdateComponent} from "../list-form-update/list-form-update.component";

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent implements OnInit {

  @Input() public list: ListStore | null = null;
  public icon: typeof Icon = Icon;
  public buttonAppearance: typeof ButtonAppearance = ButtonAppearance;
  public cards$: Observable<CardStore[]> = this.crudService.handleData<CardStore>(Collection.CARDS);

  constructor(private crudService: CrudService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  public trackByFn(index: number, item: Card): number {
    return index;
  }

  public openDialog(id: string, name: string) {
    this.dialog.open(ListFormUpdateComponent, {data: {id: id, name: name}});
  }

  public deleteList(id: string) {
    this.crudService.deleteObject(Collection.LISTS, id);
  }

  public editList(id: string, newData: ListStore) {
    this.crudService.updateObject(Collection.LISTS, id, newData);
  }

}
