import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Board, BoardStore} from "../services/types";

export interface DialogData {
  boardID: string,
  boardName: string
}

@Component({
  selector: 'app-board-update',
  templateUrl: './board-update.component.html',
  styleUrls: ['./board-update.component.scss']
})
export class BoardUpdateComponent implements OnInit {

  public formHeader: string = 'Change board members';
  public nameInput: string = 'New name';
  public isCreating: boolean = false;

  constructor(public dialogRef: MatDialogRef<BoardUpdateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

}
