import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {ListControls} from '../models/controls.enum';
import {List, ListStore} from '../services/types';
import {ButtonAppearance, Collection, Size, ValidationErrors} from '../enums';
import {CrudService} from '../services/crud/crud.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Observable, Subscription} from 'rxjs';
import {NAME_MAX_LENGTH} from '../constants';
import {nameExistValidator} from '../validators';
import {AuthService} from '../services/auth/auth.service';
import firebase from 'firebase/compat/app';

export interface DialogData {
  boardID: string
}

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss']
})
export class ListFormComponent implements OnInit, OnDestroy {

  @Input()
  public formHeader: string = 'Creating a new list';
  @Input()
  public nameInput: string = 'List Name';
  @Input()
  public isCreating: boolean = true;
  @Input()
  public id: string = '';
  @Input()
  public listName: string = '';

  public listForm: FormGroup = new FormGroup({});
  public formControls: typeof ListControls = ListControls;

  public listsNames: string[] = [];
  public buttonSize: Size = Size.l;
  public buttonAppearance: typeof ButtonAppearance = ButtonAppearance;
  public errors: typeof ValidationErrors = ValidationErrors;
  public currentError: string | undefined;
  public authUser: firebase.User | null = null;

  private subscriptionList: Subscription[] = [];
  private lists$: Observable<ListStore[]> = this.crudService.handleData<ListStore>(Collection.LISTS);

  constructor(private crudService: CrudService,
              public dialogRef: MatDialogRef<ListFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
    this.getAuthUser();
    this.getLists();
    this.listForm.addControl(ListControls.name, new FormControl(this.listName, Validators.compose([Validators.required, Validators.maxLength(NAME_MAX_LENGTH), nameExistValidator(this.listsNames)])));
  }

  private getAuthUser(): void {
    this.subscriptionList.push(
      this.authService.user$.subscribe((value: firebase.User | null) => {
        this.authUser = value;
      })
    );
  }

  private getLists(): void {
    this.subscriptionList.push(
      this.lists$.subscribe((lists: ListStore[]) => {
        const filteredLists = lists.filter((list: ListStore) => this.data.boardID === list.boardID);
        filteredLists.forEach((list: ListStore) => this.listsNames.push(list.name));
      })
    );
  }

  private addList(list: List): void {
    this.subscriptionList.push(
      this.crudService.createObject(Collection.LISTS, list).subscribe()
    );
  }

  private updateList(id: string, data: List): void {
    this.subscriptionList.push(
      this.crudService.updateObject(Collection.LISTS, id, data).subscribe()
    );
  }

  public submitForm(): void {
    if (this.listForm.valid) {
      const list: List = {
        name: this.listForm.controls[ListControls.name].value.trim(),
        boardID: this.data.boardID,
        dateCreating: new Date().getTime(),
        createdBy: this.authUser?.displayName
      };
      this.addList(list);
    } else {
      alert('ERROR');
    }
  }

  public submitUpdatingForm(id: string): void {
    if (this.listForm.valid) {
      const list: List = {
        name: this.listForm.controls[ListControls.name].value.trim(),
      }
      this.updateList(id, list);
    } else {
      alert('ERROR');
    }
  }

  public isControlValid(controlName: string): boolean {
    const control: AbstractControl | undefined = this.listForm.controls[controlName];
    if (control) {
      if (control.value && control.value.match(/^[ ]+$/)) {
        control.setValue(control.value.trim());
      }
      if (control.errors) {
        this.currentError = Object.keys(control.errors)[0];
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
