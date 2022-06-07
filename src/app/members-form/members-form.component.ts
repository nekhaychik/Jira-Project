import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {MembersControls} from '../models/controls.enum';
import {Observable, Subscription} from 'rxjs';
import {BoardStore, UserStore} from '../services/types';
import {Collection} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import firebase from 'firebase/compat';
import {AuthService} from '../services/auth/auth.service';

export interface DialogData {
  boardID: string
}

@Component({
  selector: 'app-members-form',
  templateUrl: './members-form.component.html',
  styleUrls: ['./members-form.component.scss']
})
export class MembersFormComponent implements OnInit, OnDestroy {

  private subscriptionList: Subscription[] = [];
  public membersForm: FormGroup = new FormGroup({});
  public formControls: typeof MembersControls = MembersControls;
  public board: BoardStore | undefined;
  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);
  private authUser: firebase.User | null = null;
  public membersID: string[] = [];

  constructor(private crudService: CrudService,
              public dialogRef: MatDialogRef<MembersFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
    this.getAuthUser();
    this.getBoard();
    this.membersForm.addControl(MembersControls.membersID, new FormControl(this.membersID, Validators.required));
  }

  private getAuthUser(): void {
    this.subscriptionList.push(
      this.authService.user$.subscribe((value: firebase.User | null) => {
        this.authUser = value;
      })
    );
  }

  private getBoard(): void {
    this.subscriptionList.push(
      this.crudService.getDataDoc<BoardStore>(Collection.BOARDS, this.data.boardID).subscribe(
        (board: BoardStore | undefined) => {
          this.board = board;
          if (this.board) {
            this.getMembersID(this.board);
          }
        }
      )
    );
  }

  private getMembersID(board: BoardStore): void {
    board.membersID.forEach((id: string) => {
      this.membersID.push(id);
    });
  }

  private addMembers(members: { membersID: string[] }): void {
    this.subscriptionList.push(
      this.crudService.updateObject(Collection.BOARDS, this.data.boardID, members).subscribe()
    );
  }

  public submitForm(): void {
    if (this.membersForm.valid) {
      const board: { membersID: string[] } = {
        membersID: this.membersForm.controls[MembersControls.membersID].value
      };
      if (this.authUser) {
        if (!board.membersID.includes(this.authUser.uid)) {
          board.membersID.push(this.authUser.uid);
        }
      }
      this.addMembers(board);
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

  public ngOnDestroy(): void {
    this.subscriptionList.forEach((s: Subscription) => s.unsubscribe());
  }

}
