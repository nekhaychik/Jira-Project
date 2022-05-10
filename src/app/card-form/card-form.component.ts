import {Component, OnInit, Input, Inject} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {CardControls} from '../models/controls.enum';
import {CrudService} from '../services/crud/crud.service';
import {Card, CardStore, ListStore, UserStore} from '../services/types';
import {Collection} from '../enums';
import {Observable, combineLatest, takeWhile} from 'rxjs';
import {UploadService} from '../services/crud/upload.service';
import firebase from 'firebase/compat';
import {AuthService} from '../services/auth/auth.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  boardID: string
}

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent implements OnInit {

  @Input() public formHeader: string = 'Creating a new card';
  @Input() public card: CardStore | undefined;
  @Input() public isCreating: boolean = true;
  @Input() public boardID: string = '';
  public lists: ListStore[] = [];
  public imageLink: string = '';
  public progress: string | undefined = '';

  private user: firebase.User | null = null;
  private users: UserStore[] = [];
  private lists$: Observable<ListStore[]> = this.crudService.handleData<ListStore>(Collection.LISTS);
  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);

  //add to firestore
  public priorities: string[] = [
    'normal',
    'critical',
    'blocked'
  ];

  public cardForm: FormGroup = new FormGroup({});
  public formControls: typeof CardControls = CardControls;

  constructor(private crudService: CrudService,
              private authService: AuthService,
              private uploadService: UploadService,
              public dialogRef: MatDialogRef<CardFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => {
      this.user = value;
      this.getReporter();
    });
    this.getLists();
    this.cardForm.addControl(CardControls.name, new FormControl(this.card?.name, Validators.required));
    this.cardForm.addControl(CardControls.priority, new FormControl(this.card?.priority, Validators.required));
    this.cardForm.addControl(CardControls.dueDate, new FormControl(this.card?.dueDate, Validators.compose([Validators.required, this.dateValidator])));
    this.cardForm.addControl(CardControls.list, new FormControl(this.card?.listID, Validators.required));
    this.cardForm.addControl(CardControls.member, new FormControl(this.card?.memberID, Validators.required));
    this.cardForm.addControl(CardControls.description, new FormControl(this.card?.description));
  }

  private getReporter(): void {
    this.users$.subscribe((users: UserStore[]) => {
      this.users = users as UserStore[];
      this.users = this.users.filter((user: UserStore) => user.uid === this.user?.uid)
    });
  }

  private getLists(): void {
    this.lists = [];
    this.lists$.subscribe((lists: ListStore[]) => {
        this.lists = lists as ListStore[];
        this.lists = this.lists.filter((list: ListStore) => list.boardID === this.data.boardID);
      }
    );
  }

  private addCard(card: Card): void {
    this.crudService.createObject(Collection.CARDS, card);
  }

  private updateCard(id: string, newCardData: Card): void {
    this.crudService.updateObject(Collection.CARDS, id, newCardData);
  }

  public submitForm(): void {
    if (this.cardForm.valid) {
      const card: Card = {
        name: this.cardForm?.controls[CardControls.name].value,
        description: this.cardForm?.controls[CardControls.description].value,
        priority: this.cardForm?.controls[CardControls.priority].value,
        dueDate: this.cardForm?.controls[CardControls.dueDate].value,
        listID: this.cardForm?.controls[CardControls.list].value,
        memberID: this.cardForm?.controls[CardControls.member].value,
        createDate: new Date().toDateString(),
        updateDate: new Date().toDateString(),
        position: 1,
        reporterID: this.users[0].id,
        images: [this.imageLink]
      };
      this.addCard(card);
      this.cardForm?.reset();
    } else {
      alert('ERROR');
    }
  }

  public submitUpdatingForm(id: string): void {
    if (this.cardForm.valid && this.card) {
      const card: Card = {
        name: this.cardForm?.controls[CardControls.name].value,
        priority: this.cardForm?.controls[CardControls.priority].value,
        dueDate: this.cardForm?.controls[CardControls.dueDate].value,
        listID: this.cardForm?.controls[CardControls.list].value,
        memberID: this.cardForm?.controls[CardControls.member].value,
        reporterID: this.card.reporterID,
        createDate: this.card.createDate,
        updateDate: new Date().toDateString(),
        position: this.card.position,
        description: this.cardForm?.controls[CardControls.description].value,
        // images: [...this.card.images, this.imageLink]
      };
      this.updateCard(id, card);
      this.cardForm?.reset();
    } else {
      alert('ERROR');
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
        return {'dateInvalid': true};
      } else if (match && match[0] !== value) {
        return {'dateInvalid': true};
      }
    }
    return null;
  }

  public onFileSelected(event: Event): void {
    if (event) {
      const eventTarget: HTMLInputElement = (<HTMLInputElement>event?.target);
      if (eventTarget && eventTarget.files) {
        const file: File = eventTarget.files[0];
        combineLatest(this.uploadService.uploadFileAndGetMetadata('task-images', file))
          .pipe(
            takeWhile(([, link]) => {
              return !link;
            }, true),
          )
          .subscribe(([percent, link]) => {
            this.progress = percent;
            if (link === null) this.imageLink = '';
            else this.imageLink = link;
          });
      }
    }
  }

}
