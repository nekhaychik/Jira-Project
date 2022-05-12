import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {BoardControls, ListControls} from "../models/controls.enum";
import {CrudService} from "../services/crud/crud.service";
import {Board, List, UserStore} from "../services/types";
import {Collection} from "../enums";
import {Observable} from "rxjs";

@Component({
  selector: 'app-board-form',
  templateUrl: './board-form.component.html',
  styleUrls: ['./board-form.component.scss']
})
export class BoardFormComponent implements OnInit {

  @Input() formHeader: string = 'Creating a new board';
  @Input() isCreating: boolean = true;

  public boardForm: FormGroup = new FormGroup({});
  public formControls: typeof BoardControls = BoardControls;

  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    this.boardForm.addControl(BoardControls.name, new FormControl('', Validators.compose([Validators.required, Validators.maxLength(16)])));
    this.boardForm.addControl(BoardControls.membersID, new FormControl('', Validators.required));
  }

  public addBoard(board: Board): void {
    this.crudService.createObject(Collection.BOARDS, board);
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

  public isControlValid(controlName: string): boolean {
    const control: AbstractControl | undefined = this.boardForm?.controls[controlName];
    if (control) {
      return control.invalid && (control.dirty || control.touched);
    } else {
      return false;
    }
  }

}
