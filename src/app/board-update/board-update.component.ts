import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  boardID: string,
  boardName: string
}

@Component({
  selector: 'app-board-update',
  templateUrl: './board-update.component.html',
  styleUrls: ['./board-update.component.scss']
})
export class BoardUpdateComponent {

  public formHeader: string = 'Change board name';
  public nameInput: string = 'New name';
  public isCreating: boolean = false;

  constructor(public dialogRef: MatDialogRef<BoardUpdateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

}
