import {Component, OnInit, Input, Inject} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {CardControls} from '../models/controls.enum';
import {CrudService} from '../services/crud/crud.service';
import {BoardStore, Card, CardStore, ListStore, UserStore} from '../services/types';
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
  public imageLink: string[] = [];
  public progress: string | undefined = '';
  private boards: BoardStore[] = [];

  private currentDueDate: string | null = null;
  private msInDay: number = 60 * 60 * 24 * 1000;

  private authUser: firebase.User | null = null;
  public users: UserStore[] = [];
  public users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);

  public lists: ListStore[] = [];
  private lists$: Observable<ListStore[]> = this.crudService.handleData<ListStore>(Collection.LISTS);

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

  public ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => {
      this.authUser = value;
    });
    if (this.card?.dueDate.seconds) this.currentDueDate = new Date(this.card?.dueDate.seconds * 1000).toISOString();
    if (this.isCreating) this.boardID = this.data.boardID;

    this.getBoard();
    this.getLists();
    this.getUsers();

    this.cardForm.addControl(CardControls.name, new FormControl(this.card?.name, Validators.compose([Validators.required, Validators.maxLength(16)])));
    this.cardForm.addControl(CardControls.priority, new FormControl(this.card?.priority, Validators.compose([Validators.required, Validators.maxLength(1200)])));
    this.cardForm.addControl(CardControls.dueDate, new FormControl(this.currentDueDate, Validators.required));
    this.cardForm.addControl(CardControls.list, new FormControl(this.card?.listID, Validators.required));
    this.cardForm.addControl(CardControls.member, new FormControl(this.card?.memberID, Validators.required));
    this.cardForm.addControl(CardControls.description, new FormControl(this.card?.description));
  }

  private getBoard(): void {
    this.crudService.handleData<BoardStore>(Collection.BOARDS).subscribe((boards: BoardStore[]) => {
      this.boards = boards as BoardStore[];
      this.boards = this.boards.filter((board: BoardStore) => board.id === this.boardID);
    })
  }

  public myFilter = (d: Date | null): boolean => {
    const day: number = (d || new Date()).getTime();
    return day >= new Date().getTime() - this.msInDay;
  };

  private getLists(): void {
    this.lists = [];
    this.lists$.subscribe((lists: ListStore[]) => {
        this.lists = lists as ListStore[];
        this.lists = this.lists.filter((list: ListStore) => list.boardID === this.data.boardID);
      }
    );
  }

  private getUsers(): void {
    this.users = [];
    this.users$.subscribe((users: UserStore[]) => {
      this.users = users as UserStore[];
      this.users = this.users.filter((user: UserStore) => this.boards[0].membersID.includes(user.uid));
    });
  }

  private getListName(id: string): string {
    let listsRet: ListStore[] = [];
    listsRet = this.lists.filter((list: ListStore) => list.id === id);
    return listsRet[0].name;
  }

  private getUserName(id: string): string {
    let usersRet: UserStore[] = [];
    usersRet = this.users.filter((user: UserStore) => user.id === id);
    return usersRet[0].name;
  }

  private addCard(card: Card): void {
    this.crudService.createObject(Collection.CARDS, card);
  }

  private updateCard(id: string, newCardData: Card): void {
    this.crudService.updateObject(Collection.CARDS, id, newCardData);
  }

  public submitForm(): void {
    if (this.cardForm.valid && this.authUser) {
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
        reporterID: this.authUser.uid,
        history: [this.authUser.displayName + ' created this card'],
      };
      if (this.imageLink.length) card.images = [...this.imageLink];
      this.addCard(card);
      this.cardForm?.reset();
    } else {
      alert('ERROR');
    }
  }

  public submitUpdatingForm(id: string): void {
    let history: string[] = [];

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
      };

      if (typeof this.cardForm?.controls[CardControls.dueDate].value === 'string') {
        card.dueDate = {
          seconds: new Date(this.cardForm?.controls[CardControls.dueDate].value).getTime() / 1000,
          nanoseconds: 0
        };
      }

      //if changed due date
      if (this.card.dueDate.seconds && !card.dueDate.seconds) {
        const cardDueDate: string = new Date(this.card.dueDate.seconds * 1000).toDateString();
        // @ts-ignore
        let newCardDueDate: string = new Date(card.dueDate.getTime()).toDateString();
        history.push(this.authUser?.displayName + 'changed card due date from ' + cardDueDate + ' to ' + newCardDueDate);
      }
      //if changed assignees (member)
      if (this.card.memberID !== card.memberID) {
        const memberName: string = this.getUserName(this.card.memberID);
        const newMemberName: string = this.getUserName(card.memberID);
        history.push(this.authUser?.displayName + ' changed assignees from ' + memberName + ' to ' + newMemberName);
      }
      //if changed priority
      if (this.card.priority !== card.priority) {
        history.push(this.authUser?.displayName + ' changed priority from ' + this.card.priority + ' to ' + card.priority);
      }
      //if changed status (list)
      if (this.card.listID !== card.listID) {
        const listName: string = this.getListName(this.card.listID);
        const newListName: string = this.getListName(card.listID);
        history.push(this.authUser?.displayName + ' changed status from ' + listName + ' to ' + newListName);
      }
      //if changed description
      if (this.card.description !== card.description) {
        history.push(this.authUser?.displayName + ' changed card description');
      }
      //if changed card name
      if (this.card.name !== card.name) {
        history.push(this.authUser?.displayName + ' renamed card from ' + this.card.name + ' to ' + card.name);
      }

      if (this.card.history)
        card.history = [...history, ...this.card.history]
      else
        card.history = [...history];

      this.updateCard(id, card);
      this.cardForm?.reset();
    } else {
      alert('ERROR');
    }
  }

  public isTextValueValid(controlName: string): void {
    const control: AbstractControl | undefined = this.cardForm?.controls[controlName];
    if (control.value && control.value.match(/^[ ]+$/)) {
      control.setValue(control.value.trim());
    }
  }

  public isInputControlValid(controlName: string): boolean {
    const control: AbstractControl | undefined = this.cardForm?.controls[controlName];
    if (control) {
      this.isTextValueValid(controlName);
      return control.invalid && (control.dirty || control.touched);
    } else {
      return false;
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
            if (link === null) this.imageLink = this.imageLink;
            else this.imageLink.push(link);
            // if (this.imageLink) this.progress = '';
          });
      }
    }
  }


}
