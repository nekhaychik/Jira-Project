import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {BoardControls} from '../models/controls.enum';
import {CrudService} from '../services/crud/crud.service';
import {Board, UserStore} from '../services/types';
import {Collection} from '../enums';
import {Observable} from 'rxjs';
import {Router} from "@angular/router";
import firebase from "firebase/compat";
import {AuthService} from "../services/auth/auth.service";

@Component({
  selector: 'app-board-form',
  templateUrl: './board-form.component.html',
  styleUrls: ['./board-form.component.scss']
})

export class BoardFormComponent implements OnInit {

  @Input()
  boardID: string | undefined;
  @Input()
  formHeader: string = 'Creating a new board';
  @Input()
  isCreating: boolean = true;
  @Input()
  boardName: string = '';
  private authUser: firebase.User | null = null;

  public boardForm: FormGroup = new FormGroup({});
  public formControls: typeof BoardControls = BoardControls;

  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);

  constructor(private router: Router,
              private crudService: CrudService,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => {
      this.authUser = value;
    });
    this.boardForm.addControl(BoardControls.name, new FormControl(this.boardName, Validators.compose([Validators.required, Validators.maxLength(16)])));
    this.boardForm.addControl(BoardControls.membersID, new FormControl(''));
  }

  public addBoard(board: Board): void {
    this.crudService.createObject(Collection.BOARDS, board);
  }

  public updateBoard(board: any): void {
    if (this.boardID) {
      this.crudService.updateObject(Collection.BOARDS, this.boardID, board);
    }
  }

  public submitForm(): void {
    if (this.boardForm.valid) {
      const board: Board = {
        name: this.boardForm?.controls[BoardControls.name].value,
        membersID: this.boardForm.controls[BoardControls.membersID].value
      };
      if (this.authUser) {
        if (!board.membersID.includes(this.authUser.uid)) {
          board.membersID.push(this.authUser.uid);
        }
      }

      this.addBoard(board);
      this.boardForm?.reset();
    } else {
      alert('ERROR');
    }
  }

  public submitUpdatingForm(): void {
    if (this.boardForm.valid) {
      const board = {
        name: this.boardForm?.controls[BoardControls.name].value
      };
      this.updateBoard(board);
      this.boardForm?.reset();
    } else {
      alert('ERROR');
    }
  }

  public isControlValid(controlName: string): boolean {
    const control: AbstractControl | undefined = this.boardForm?.controls[controlName];
    if (control) {
      return control.invalid && (control.dirty || control.touched);
    } else {
      return false;
    }
  }

}
