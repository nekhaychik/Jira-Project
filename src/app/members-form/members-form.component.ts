import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {MembersControls} from '../models/controls.enum';
import {filter, Observable, Subscription, switchMap, tap} from 'rxjs';
import {BoardStore, CardStore, ListStore, UserStore} from '../services/types';
import {ButtonAppearance, Collection, Size} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import firebase from 'firebase/compat';
import {AuthService} from '../services/auth/auth.service';

export interface DialogData {
  board: BoardStore
}

@Component({
  selector: 'app-members-form',
  templateUrl: './members-form.component.html',
  styleUrls: ['./members-form.component.scss']
})
export class MembersFormComponent implements OnInit, OnDestroy {

  private subscriptionList: Subscription[] = [];
  private authUser: firebase.User | null = null;
  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);
  public membersForm: FormGroup = new FormGroup({});
  public formControls: typeof MembersControls = MembersControls;
  public buttonSize: typeof Size = Size;
  public buttonAppearance: typeof ButtonAppearance = ButtonAppearance;
  private lists: string[] = [];
  public assignees: string[] = [];
  private lists$: Observable<ListStore[]> = this.crudService.handleData<ListStore>(Collection.LISTS);
  private cards$: Observable<CardStore[]> = this.crudService.handleData<CardStore>(Collection.CARDS);

  constructor(private crudService: CrudService,
              public dialogRef: MatDialogRef<MembersFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
    this.getAuthUser();
    this.getAssignees();
    this.membersForm.addControl(MembersControls.membersID, new FormControl(this.data.board.membersID, Validators.required));
  }

  private getAuthUser(): void {
    this.subscriptionList.push(
      this.authService.user$.subscribe((value: firebase.User | null) => {
        this.authUser = value;
      })
    );
  }

  private getAssignees(): void {
    this.lists = [];
    this.assignees = [];

    this.lists$.pipe(
      tap((lists: ListStore[]) => {
        lists
          .filter((list: ListStore) => list.boardID === this.data.board.id)
          .forEach((list: ListStore) => {
            this.lists.push(list.id);
          });
      }),
      switchMap(() => this.cards$),
    ).subscribe((cards: CardStore[]) => {
      cards.forEach((card: CardStore) => {
        if (this.lists.includes(card.listID)) {
          this.assignees.push(card.memberID)
        }
      })
    })
  }

  private addMembers(members: { membersID: string[] }): void {
    this.subscriptionList.push(
      this.crudService.updateObject(Collection.BOARDS, this.data.board.id, members).subscribe()
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
