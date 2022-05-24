import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  id: string,
  name: string
}

@Component({
  selector: 'app-list-form-update',
  templateUrl: './list-form-update.component.html',
  styleUrls: ['./list-form-update.component.scss']
})
export class ListFormUpdateComponent {

  public formHeader: string = 'List update';
  public nameInput: string = 'New name';
  public isCreating: boolean = false;

  constructor(public dialogRef: MatDialogRef<ListFormUpdateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

}
