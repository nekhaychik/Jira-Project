import {Component, Inject, OnInit} from '@angular/core';
import {CardStore} from '../services/types';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  card: CardStore
}

@Component({
  selector: 'app-card-form-update',
  templateUrl: './card-form-update.component.html',
  styleUrls: ['./card-form-update.component.scss']
})
export class CardFormUpdateComponent implements OnInit {

  public formHeader: string = 'Card update';
  public isCreating: boolean = false;

  constructor(public dialogRef: MatDialogRef<CardFormUpdateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
  }

}
