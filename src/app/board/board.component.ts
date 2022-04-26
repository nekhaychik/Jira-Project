import {Component, OnInit, Input} from '@angular/core';
import {ButtonAppearance, Icon, Shape, Collection} from '../enums';
import {CrudService} from "../services/crud/crud.service";
import {Observable} from "rxjs";
import {ListStore, UserStore} from "../services/types";
import {MatDialog} from '@angular/material/dialog';
import {ListFormComponent} from "../list-form/list-form.component";
import {CardFormComponent} from "../card-form/card-form.component";
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() public board: any = null;
  public imagePath: string = 'assets/background.png';
  public buttonContentList: string = 'Add List';
  public buttonContentCard: string = 'Add Card';
  public buttonSize: string = 'width: 48px; height: 48px;';
  public buttonAppearance: typeof ButtonAppearance = ButtonAppearance;
  public icon: typeof Icon = Icon;
  public shape: typeof Shape = Shape;

  public lists$: Observable<ListStore[]> = this.crudService.handleData<ListStore>(Collection.LISTS);
  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);

  constructor(private crudService: CrudService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  public trackByFn(index: number, item: ListStore): number {
    return index;
  }

  openDialog() {
    this.dialog.open(ListFormComponent);
  }

  openCardDialog() {
    this.dialog.open(CardFormComponent);
  }

  public addCard() {
    const card = {
      name: 'Test card',
      priority: 'blocked',
      memberID: '3gYhnvX4D5fpTFizLYm1',
      listID: '0PdgRcgVMWNB2Iy2doTv',
      checklist: '5/10'
    };
    this.crudService.createObject(Collection.CARDS, card).subscribe();
  }

  // public getLists() {
  //   this.crudService.getDate(Collection.LISTS).subscribe();
  // }


}
