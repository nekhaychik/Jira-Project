import {Component, OnInit, Inject} from '@angular/core';
import {CardStore, ListStore, UserStore} from '../services/types';
import {CrudService} from '../services/crud/crud.service';
import {Collection} from '../enums';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CardFormUpdateComponent} from '../card-form-update/card-form-update.component';

export interface DialogData {
  card: CardStore
}

@Component({
  selector: 'app-full-card',
  templateUrl: './full-card.component.html',
  styleUrls: ['./full-card.component.scss']
})
export class FullCardComponent implements OnInit {

  public list: ListStore | undefined;
  public member: UserStore | undefined;
  public reporter: UserStore | undefined;

  constructor(private crudService: CrudService,
              public dialogRef: MatDialogRef<FullCardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getList();
    this.getMember();
    this.getReporter();
  }

  private getList(): void {
    this.crudService.getDataDoc<ListStore>(Collection.LISTS, this.data.card.listID).subscribe(
      (value: ListStore | undefined) => {
        this.list = value;
      }
    );
  }

  private getMember(): void {
    if (this.data.card.memberID) {
      this.crudService.getDataDoc<UserStore>(Collection.USERS, this.data.card.memberID).subscribe(
        (value: UserStore | undefined) => {
          this.member = value;
        }
      );
    }
  }

  private getReporter(): void {
    if (this.data.card.reporterID) {
      this.crudService.getDataDoc<UserStore>(Collection.USERS, this.data.card.reporterID).subscribe(
        (value: UserStore | undefined) => {
          this.reporter = value;
        }
      );
    }
  }

  public getDate(value: number | undefined): string {
    if (value) {
      return new Date(value * 1000).toDateString();
    }
    return 'Error';
  }

  public deleteCard(id: string): void {
    this.crudService.deleteObject(Collection.CARDS, id);
  }

  public openUpdateCardDialog(card: CardStore): void {
    this.dialog.open(CardFormUpdateComponent, {data: {card: card}});
  }

}
