import {Component, Inject} from '@angular/core';
import {BoardStore, CardStore} from '../services/types';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  card: CardStore,
  board: BoardStore
}

@Component({
  selector: 'app-card-form-update',
  templateUrl: './card-form-update.component.html',
  styleUrls: ['./card-form-update.component.scss']
})
export class CardFormUpdateComponent {

  public formHeader: string = 'Card update';
  public isCreating: boolean = false;

  constructor(public dialogRef: MatDialogRef<CardFormUpdateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

}
