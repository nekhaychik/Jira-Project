import {Component, OnInit, Input, Inject, OnDestroy} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {CardControls} from '../models/controls.enum';
import {CrudService} from '../services/crud/crud.service';
import {BoardStore, Card, CardStore, ListStore, UserStore} from '../services/types';
import {ButtonAppearance, Collection, Size} from '../enums';
import {Observable, combineLatest, takeWhile, Subscription, tap} from 'rxjs';
import {UploadService} from '../services/crud/upload.service';
import firebase from 'firebase/compat';
import {AuthService} from '../services/auth/auth.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  DESCRIPTION_MAX_LENGTH,
  FIRST_POSITION,
  MEDIA_FOLDER_PATH,
  MS_IN_DAY,
  NAME_MAX_LENGTH,
  ONE_SECOND,
  CORRECT_FORMATS, MB_5
} from '../constants';

export interface DialogData {
  board: BoardStore
}

const ACTIVE_LABEL: string = 'cursor: pointer; color: #526ed3;';
const NOT_ACTIVE_LABEL: string = 'cursor: default; color: gray;';
const DISPLAY_NONE: string = 'display: none;';
const DISPLAY_BLOCK: string = 'display: block;';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent implements OnInit, OnDestroy {

  @Input()
  public formHeader: string = 'Creating a new card';
  @Input()
  public card: CardStore | undefined;
  @Input()
  public isCreating: boolean = true;
  @Input()
  public board: BoardStore | undefined;
  @Input()
  public boardID: string = '';

  public buttonSize: Size = Size.l;
  public buttonAppearance: typeof ButtonAppearance = ButtonAppearance;
  public isDisable: boolean = false;
  public labelStyle: string = ACTIVE_LABEL;
  public formatErrorStyle: string = DISPLAY_NONE;
  public sizeErrorStyle: string = DISPLAY_NONE;
  private imageLinks: string[] = [];
  public errorsFilesNames: string[] = [];
  public filesNames: string[] = [];
  public progress: string | undefined = '';
  private currentDueDate: string | null = null;

  private subscriptionList: Subscription[] = [];
  public lists: ListStore[] = [];
  public users: UserStore[] = [];
  private authUser: firebase.User | null = null;
  private lists$: Observable<ListStore[]> = this.crudService.handleData<ListStore>(Collection.LISTS);
  private users$: Observable<UserStore[]> = this.crudService.handleData<UserStore>(Collection.USERS);
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
    if (this.card?.dueDate.seconds) {
      this.currentDueDate = new Date(this.card?.dueDate.seconds * ONE_SECOND).toISOString();
    }

    this.getAuthUser();
    this.getUsers();
    this.getLists();

    this.cardForm.addControl(CardControls.name, new FormControl(this.card?.name, Validators.compose([Validators.required, Validators.maxLength(NAME_MAX_LENGTH)])));
    this.cardForm.addControl(CardControls.priority, new FormControl(this.card?.priority, Validators.required));
    this.cardForm.addControl(CardControls.dueDate, new FormControl(this.currentDueDate, Validators.required));
    this.cardForm.addControl(CardControls.list, new FormControl(this.card?.listID, Validators.required));
    this.cardForm.addControl(CardControls.member, new FormControl(this.card?.memberID, Validators.required));
    this.cardForm.addControl(CardControls.description, new FormControl(this.card?.description, Validators.maxLength(DESCRIPTION_MAX_LENGTH)));
  }

  public trackByFn(index: number, item: string): number {
    return index;
  }

  public myFilter = (d: Date | null): boolean => {
    const day: number = (d || new Date()).getTime();
    const lastDay: number = new Date(2025, 1, 1).getTime();
    return (day >= new Date().getTime() - MS_IN_DAY && day <= lastDay);
  };

  private getAuthUser(): void {
    this.subscriptionList.push(
      this.authService.user$.subscribe((value: firebase.User | null) => {
        this.authUser = value;
      })
    );
  }

  private getLists(): void {
    this.lists = [];
    this.subscriptionList.push(
      this.lists$.subscribe((lists: ListStore[]) => {
          this.lists = lists.filter((list: ListStore) => list.boardID === this.data.board.id);
        }
      )
    );
  }

  private getUsers(): void {
    this.users = [];
    this.subscriptionList.push(
      this.users$.pipe(
        tap((users: UserStore[]) => {
          this.users = users.filter((user: UserStore) => this.data.board.membersID.includes(user.uid));
        })
      ).subscribe()
    );
  }

  private getListName(id: string): string {
    let listsRet: ListStore[];
    listsRet = this.lists.filter((list: ListStore) => list.id === id);
    return listsRet[0].name;
  }

  private getUserName(id: string): string {
    let usersRet: UserStore[];
    usersRet = this.users.filter((user: UserStore) => user.id === id);
    return usersRet[0].name;
  }

  private addCard(card: Card): void {
    this.subscriptionList.push(
      this.crudService.createObject(Collection.CARDS, card).subscribe()
    );
  }

  private updateCard(id: string, newCardData: Card): void {
    this.subscriptionList.push(
      this.crudService.updateObject(Collection.CARDS, id, newCardData).subscribe()
    );
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
        position: FIRST_POSITION,
        reporterID: this.authUser.uid,
        history: [this.authUser.displayName + ' created this card'],
      };
      if (this.imageLinks.length) {
        card.images = [...this.imageLinks];
      }
      this.addCard(card);
    } else {
      alert('ERROR');
    }
  }

  public submitUpdatingForm(id: string | undefined): void {
    let history: string[] = [];
    if (this.cardForm.valid && this.card && id) {
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
        history: history
      };

      if (typeof this.cardForm?.controls[CardControls.dueDate].value === 'string') {
        card.dueDate = {
          seconds: new Date(this.cardForm?.controls[CardControls.dueDate].value).getTime() / ONE_SECOND,
          nanoseconds: 0
        };
      }

      //if changed due date
      if (this.card.dueDate.seconds && !card.dueDate.seconds) {
        const cardDueDate: string = new Date(this.card.dueDate.seconds * ONE_SECOND).toDateString();
        // @ts-ignore
        let newCardDueDate: string = new Date(card.dueDate.getTime()).toDateString();
        history.push(this.authUser?.displayName + ' changed card due date from ' + cardDueDate + ' to ' + newCardDueDate);
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

      if (this.card.history) {
        card.history = [...history, ...this.card.history];
      } else {
        card.history = [...history];
      }

      this.updateCard(id, card);
    } else {
      alert('ERROR');
    }
  }

  public textValueValid(controlName: string): void {
    const control: AbstractControl | undefined = this.cardForm.controls[controlName];
    if (control.value && control.value.match(/^[ ]+$/)) {
      control.setValue(control.value.trim());
    }
  }

  public isInputControlValid(controlName: string): boolean {
    const control: AbstractControl | undefined = this.cardForm?.controls[controlName];
    if (control) {
      this.textValueValid(controlName);
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
        let files: File[] = Array.from(eventTarget.files);
        files.forEach((file: File) => {
          const size: number = file.size;
          const format: string | undefined = file.name.split('.').pop()?.toLowerCase();
          let error: boolean = false;
          if (size > MB_5) {
            error = true;
            this.sizeErrorStyle = DISPLAY_BLOCK;
            this.errorsFilesNames.push(file.name)
          }
          if (format && !CORRECT_FORMATS.includes(format)) {
            error = true;
            this.formatErrorStyle = DISPLAY_BLOCK;
            if (!this.errorsFilesNames.includes(file.name)) {
              this.errorsFilesNames.push(file.name);
            }
          }
          if (!error) {
            this.subscriptionList.push(
              combineLatest(this.uploadService.uploadFileAndGetMetadata(MEDIA_FOLDER_PATH, file))
                .pipe(
                  takeWhile(([, link]) => {
                    return !link;
                  }, true),
                )
                .subscribe(([percent, link]) => {
                  this.progress = percent;
                  if (link !== null) {
                    this.labelStyle = ACTIVE_LABEL;
                    this.isDisable = false;
                    this.filesNames.push(file.name);
                    this.imageLinks.push(link);
                  } else {
                    this.labelStyle = NOT_ACTIVE_LABEL;
                    this.isDisable = true;
                  }
                })
            );
          }
        });
      }
    }
  }

  public ngOnDestroy(): void {
    this.subscriptionList.forEach((s: Subscription) => s.unsubscribe());
  }

}
