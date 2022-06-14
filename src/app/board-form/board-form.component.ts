import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {BoardControls} from '../models/controls.enum';
import {CrudService} from '../services/crud/crud.service';
import {Board, UserStore} from '../services/types';
import {ButtonAppearance, Collection, Paths, Size} from '../enums';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import firebase from 'firebase/compat';
import {AuthService} from '../services/auth/auth.service';
import {BOARD_NAME_MAX_LENGTH} from '../constants';

@Component({
  selector: 'app-board-form',
  templateUrl: './board-form.component.html',
  styleUrls: ['./board-form.component.scss']
})

export class BoardFormComponent implements OnInit, OnDestroy {

  @Input()
  public boardID: string | undefined;
  @Input()
  public formHeader: string = 'Creating a new board';
  @Input()
  public isCreating: boolean = true;
  @Input()
  public boardName: string = '';
  public buttonSize: typeof Size = Size;
  public buttonAppearance: typeof ButtonAppearance = ButtonAppearance;
  private subscriptionList: Subscription[] = [];
  private authUser: firebase.User | null = null;
  public boardForm: FormGroup = new FormGroup({});
  public formControls: typeof BoardControls = BoardControls;
  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);

  constructor(private router: Router,
              private crudService: CrudService,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
    this.getAuthUser();
    this.boardForm.addControl(BoardControls.name, new FormControl(this.boardName, Validators.compose([Validators.required, Validators.maxLength(BOARD_NAME_MAX_LENGTH)])));
    this.boardForm.addControl(BoardControls.membersID, new FormControl([this.authUser?.uid], Validators.required));
  }

  private getAuthUser(): void {
    this.subscriptionList.push(
      this.authService.user$.subscribe((value: firebase.User | null) => {
        this.authUser = value;
      })
    );
  }

  private addBoard(board: Board): void {
    this.subscriptionList.push(
      this.crudService.createObject(Collection.BOARDS, board).subscribe()
    );
  }

  private updateBoard(board: { name: string }): void {
    if (this.boardID) {
      this.subscriptionList.push(
        this.crudService.updateObject(Collection.BOARDS, this.boardID, board).subscribe()
      );
    }
  }

  public submitForm(): void {
    if (this.boardForm.valid) {
      const board: Board = {
        name: this.boardForm.controls[BoardControls.name].value.trim(),
        membersID: this.boardForm.controls[BoardControls.membersID].value
      };
      if (this.authUser) {
        if (!board.membersID.includes(this.authUser.uid)) {
          board.membersID.push(this.authUser.uid);
        }
      }
      this.addBoard(board);
    } else {
      alert('ERROR');
    }
  }

  public submitUpdatingForm(): void {
    if (this.boardForm.valid) {
      const board: { name: string } = {
        name: this.boardForm.controls[BoardControls.name].value.trim()
      };
      this.updateBoard(board);
    } else {
      alert('ERROR');
    }
  }

  public isControlValid(controlName: string): boolean {
    const control: AbstractControl | undefined = this.boardForm?.controls[controlName];
    if (control) {
      if (control.value && control.value.match(/^[ ]+$/)) {
        control.setValue(control.value.trim());
      }
      return control.invalid && (control.dirty || control.touched);
    } else {
      return false;
    }
  }

  public ngOnDestroy(): void {
    this.subscriptionList.forEach((s: Subscription) => s.unsubscribe());
  }

}
