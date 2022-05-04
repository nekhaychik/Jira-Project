import {Component, OnInit, Input, Inject} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {ListControls} from "../models/controls.enum";
import {List} from "../services/types";
import {Collection} from "../enums";
import {CrudService} from "../services/crud/crud.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface DialogData {
  boardID: string
}

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss']
})
export class ListFormComponent implements OnInit {

  @Input() public formHeader: string = 'Creating a new list';
  @Input() public nameInput: string = 'List Name';
  @Input() public isCreating: boolean = true;
  @Input() public id: string = '';
  @Input() public listName: string | undefined;
  public createListForm: FormGroup = new FormGroup({});
  public formControls: typeof ListControls = ListControls;

  constructor(private crudService: CrudService,
              public dialogRef: MatDialogRef<ListFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
    this.createListForm.addControl(ListControls.name, new FormControl(this.listName, Validators.required));
  }

  public addList(list: List): void {
    this.crudService.createObject(Collection.LISTS, list).subscribe();
  }

  public updateList(id: string, data: {}): void {
    this.crudService.updateObject(Collection.LISTS, id, data);
  }

  public submitForm(): void {
    if (this.createListForm.valid) {
      const list: List = {
        name: this.createListForm?.controls[ListControls.name].value,
        boardID: this.data.boardID
      };
      this.addList(list);
      this.createListForm?.reset();
    } else {
      alert("Error");
    }
  }

  public submitUpdatingForm(id: string): void {
    if (this.createListForm.valid) {
      const list: List = {
        name: this.createListForm?.controls[ListControls.name].value,
      }
      this.updateList(id, list);
      this.createListForm?.reset();
    } else {
      alert("Error");
    }
  }

  public isControlValid(controlName: string): boolean {
    const control: AbstractControl | undefined = this.createListForm?.controls[controlName];
    if (control) {
      return control.invalid && (control.dirty || control.touched);
    } else {
      return false;
    }
  }

}
