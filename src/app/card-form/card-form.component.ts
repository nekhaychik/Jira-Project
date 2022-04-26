import {Component, OnInit, Input} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {CardControls} from "../board/models/controls.enum";
import {CrudService} from "../services/crud/crud.service";
import {Card, CardStore, ListStore, UserStore} from "../services/types";
import {Collection} from "../enums";
import {Observable} from "rxjs";

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent implements OnInit {

  @Input() public formHeader: string = 'Creating a new card';
  @Input() public card: CardStore | undefined;
  @Input() public isCreating: boolean = true;
  @Input() public id: string = '';
  public lists$: Observable<ListStore[]> = this.crudService.handleData<ListStore>(Collection.LISTS);
  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);
  public priorities: string[] = [
    'normal',
    'critical',
    'blocked'
  ];

  public cardForm: FormGroup = new FormGroup({});
  public formControls: typeof CardControls = CardControls;

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    this.cardForm.addControl(CardControls.name, new FormControl('', Validators.required));
    this.cardForm.addControl(CardControls.priority, new FormControl('', Validators.required));
    this.cardForm.addControl(CardControls.dueDate, new FormControl('', Validators.compose([Validators.required, this.dateValidator])));
    this.cardForm.addControl(CardControls.list, new FormControl('', Validators.required));
    this.cardForm.addControl(CardControls.member, new FormControl('', Validators.required));
  }

  public addCard(card: Card) {
    this.crudService.createObject(Collection.CARDS, card).subscribe();
  }

  public submitForm(): void {
    if(this.cardForm.valid) {
      const card: Card = {
        name: this.cardForm?.controls[CardControls.name].value,
        priority: this.cardForm?.controls[CardControls.priority].value,
        dueDate: this.cardForm?.controls[CardControls.dueDate].value,
        listID: this.cardForm?.controls[CardControls.list].value,
        memberID: this.cardForm?.controls[CardControls.member].value
      }
      this.addCard(card);
      this.cardForm?.reset();
    } else {
      alert('Error');
    }
  }

  public updateCard(id: string, data: Card) {
    this.crudService.updateObject(Collection.CARDS, id, data);
  }

  public submitUpdatingForm(id: string): void {
    if(this.cardForm.valid) {
      const card: Card = {
        name: this.cardForm?.controls[CardControls.name].value,
        priority: this.cardForm?.controls[CardControls.priority].value,
        dueDate: this.cardForm?.controls[CardControls.dueDate].value,
        listID: this.cardForm?.controls[CardControls.list].value,
        memberID: this.cardForm?.controls[CardControls.member].value
      }
      this.updateCard(id, card);
      this.cardForm?.reset();
    } else {
      alert('Error');
    }
  }

  public isControlValid(controlName: string): boolean {
    const control: AbstractControl | undefined = this.cardForm?.controls[controlName];
    if (control) {
      return control.invalid && (control.dirty || control.touched);
    } else {
      return false;
    }
  }

  public dateValidator(c: AbstractControl): { [key: string]: boolean } | null {
    let value = c.value;
    if (value && typeof value === "string") {
      let match = value.match(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/);
      if (!match) {
        return { 'dateInvalid': true };
      } else if (match && match[0] !== value) {
        return { 'dateInvalid': true };
      }
    }
    return null;
  }

}
