import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {MembersControls} from '../models/controls.enum';
import {Observable} from 'rxjs';
import {BoardStore, UserStore} from '../services/types';
import {Collection} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  boardID: string
}

@Component({
  selector: 'app-members-form',
  templateUrl: './members-form.component.html',
  styleUrls: ['./members-form.component.scss']
})
export class MembersFormComponent implements OnInit {

  public membersForm: FormGroup = new FormGroup({});
  public formControls: typeof MembersControls = MembersControls;
  private boards: BoardStore[] = [];
  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);

  constructor(private crudService: CrudService,
              public dialogRef: MatDialogRef<MembersFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  public ngOnInit(): void {
    this.getBoard();
  }

  private getBoard(): void {
    this.crudService.handleData<BoardStore>(Collection.BOARDS).subscribe((boards: BoardStore[]) => {
      this.boards = boards as BoardStore[];
      this.boards = this.boards.filter((board: BoardStore) => board.id === this.data.boardID);
      console.log(this.boards)
      this.membersForm.addControl(MembersControls.membersID, new FormControl(this.boards[0].membersID[0], Validators.required));
    });
  }

  public addMembers(members: {}): void {
    this.crudService.updateObject(Collection.BOARDS, this.data.boardID, members);
  }

  public submitForm(): void {
    if (this.membersForm.valid) {
      const board = {
        membersID: this.membersForm.controls[MembersControls.membersID].value
      };
      console.log(board)
      this.addMembers(board);
      this.membersForm?.reset();
    } else {
      alert('ERROR');
    }
  }

  public isControlValid(controlName: string): boolean {
    const control: AbstractControl | undefined = this.membersForm?.controls[controlName];
    if (control) {
      return control.invalid && (control.dirty || control.touched);
    } else {
      return false;
    }
  }

}
