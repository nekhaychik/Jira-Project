import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {BoardControls} from '../models/controls.enum';
import {CrudService} from '../services/crud/crud.service';
import {Board, UserStore} from '../services/types';
import {Collection} from '../enums';
import {Observable} from 'rxjs';
import {Router} from "@angular/router";

@Component({
  selector: 'app-board-form',
  templateUrl: './board-form.component.html',
  styleUrls: ['./board-form.component.scss']
})

export class BoardFormComponent implements OnInit {

  @Input()
  board: string | undefined;
  @Input()
  formHeader: string = 'Creating a new board';
  @Input()
  isCreating: boolean = true;
  @Input()
  boardName: string = '';

  public boardForm: FormGroup = new FormGroup({});
  public formControls: typeof BoardControls = BoardControls;

  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);

  constructor(private router: Router,
              private crudService: CrudService) {
  }

  public ngOnInit(): void {
    console.log(this.isCreating, this.board)
    this.boardForm.addControl(BoardControls.name, new FormControl(this.boardName, Validators.compose([Validators.required, Validators.maxLength(16)])));
    this.boardForm.addControl(BoardControls.membersID, new FormControl('', Validators.required));
  }

  public addBoard(board: Board): void {
    this.crudService.createObject(Collection.BOARDS, board);
  }

  public updateBoard(board: Board): void {
    if (this.board) {
      this.crudService.updateObject(Collection.BOARDS, this.board, board);
    }
  }

  public submitForm(): void {
    if (this.boardForm.valid) {
      const board: Board = {
        name: this.boardForm?.controls[BoardControls.name].value,
        membersID: this.boardForm.controls[BoardControls.membersID].value
      };
      this.addBoard(board);
      this.boardForm?.reset();
    } else {
      alert('ERROR');
    }
  }

  public submitUpdatingForm(): void {
    if (this.boardForm.valid) {
      const board: Board = {
        name: this.boardForm?.controls[BoardControls.name].value,
        membersID: this.boardForm.controls[BoardControls.membersID].value
      };
      this.updateBoard(board);
      this.boardForm?.reset();
      if (this.board && this.boardName) {
        let path = 'board/' + this.board + '/' + this.boardName;
        this.router.navigate([path]);
      }
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
