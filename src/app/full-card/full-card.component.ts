import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {BoardStore, CardStore, ListStore, UserStore} from '../services/types';
import {CrudService} from '../services/crud/crud.service';
import {Collection, Paths} from '../enums';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {CardFormUpdateComponent} from '../card-form-update/card-form-update.component';
import {combineLatest, Observable, Subscription, takeWhile} from 'rxjs';
import {UploadService} from '../services/crud/upload.service';
import firebase from 'firebase/compat';
import {AuthService} from '../services/auth/auth.service';
import {Router} from '@angular/router';
import {CORRECT_FORMATS, MB_5, MEDIA_FOLDER_PATH, ONE_SECOND} from '../constants';

export interface DialogData {
  card: CardStore,
  boardID: string
}

type Image = {
  images: string[];
  history: string[];
}

const ACTIVE_LABEL: string = 'cursor: pointer; color: #526ed3;';
const NOT_ACTIVE_LABEL: string = 'cursor: default; color: gray;';
const DISPLAY_NONE: string = 'display: none;';
const DISPLAY_BLOCK: string = 'display: block;';

@Component({
  selector: 'app-full-card',
  templateUrl: './full-card.component.html',
  styleUrls: ['./full-card.component.scss']
})
export class FullCardComponent implements OnInit, OnDestroy {

  private subscriptionList: Subscription[] = [];
  private board: BoardStore | undefined;
  public list: ListStore | undefined;
  public member: UserStore | undefined;
  public reporter: UserStore | undefined;
  private authUser: firebase.User | null = null;
  private boards$: Observable<BoardStore[]> = this.crudService.handleData<BoardStore>(Collection.BOARDS);

  public labelStyle: string = ACTIVE_LABEL;
  public sizeErrorStyle: string = DISPLAY_NONE;
  public formatErrorStyle: string = DISPLAY_NONE;
  public imageLink: string = '';
  public progress: string | undefined = '';
  public isDisable: boolean = false;
  public errorsFilesNames: string[] = [];

  constructor(private crudService: CrudService,
              private authService: AuthService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dialog: MatDialog,
              private uploadService: UploadService,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.getBoard();
    this.getAuthUser();
    this.getList();
    this.getMember();
    this.getReporter();
  }

  public trackByFn(index: number, item: string): number {
    return index;
  }

  private getBoard(): void {
    this.subscriptionList.push(
      this.boards$.subscribe((boards: BoardStore[]) => {
        this.board = boards.filter((board: BoardStore) => board.id === this.data.boardID)[0];
      })
    );
  }

  private getAuthUser(): void {
    this.subscriptionList.push(
      this.authService.user$.subscribe((value: firebase.User | null) => {
        this.authUser = value;
      })
    );
  }

  private getList(): void {
    this.subscriptionList.push(
      this.crudService.getDataDoc<ListStore>(Collection.LISTS, this.data.card.listID)
        .subscribe((list: ListStore | undefined) => {
          this.list = list;
        })
    );
  }

  private getMember(): void {
    if (this.data.card.memberID) {
      this.subscriptionList.push(
        this.crudService.getDataDoc<UserStore>(Collection.USERS, this.data.card.memberID)
          .subscribe((user: UserStore | undefined) => {
            this.member = user;
          })
      );
    }
  }

  private getReporter(): void {
    if (this.data.card.reporterID) {
      this.subscriptionList.push(
        this.crudService.getDataDoc<UserStore>(Collection.USERS, this.data.card.reporterID)
          .subscribe((user: UserStore | undefined) => {
            this.reporter = user;
          })
      );
    }
  }

  public getDate(seconds: number | undefined): string {
    if (seconds) {
      return new Date(seconds * ONE_SECOND).toDateString();
    }
    return 'Sorry, we don\'t know due date of this card :(';
  }

  public deleteCard(id: string): void {
    this.subscriptionList.push(
      this.crudService.deleteObject(Collection.CARDS, id).subscribe()
    );
  }

  public openUpdateCardDialog(card: CardStore): void {
    this.dialog.open(CardFormUpdateComponent, {data: {card: card, board: this.board}});
    this.router.navigate([Paths.board + '/' + this.data.boardID]);
  }

  public onFileSelected(event: Event): void {
    if (event) {
      const eventTarget: HTMLInputElement = (<HTMLInputElement>event.target);
      if (eventTarget && eventTarget.files) {
        let files: File[] = Array.from(eventTarget.files);
        files.forEach((file: File) => {
          let error: boolean = false;
          const format: string | undefined = file.name.split('.').pop()?.toLowerCase();
          const size: number = file.size;

          if (format && !CORRECT_FORMATS.includes(format)) {
            error = true;
            this.formatErrorStyle = DISPLAY_BLOCK;
            this.errorsFilesNames.push(file.name);
          }

          if (size > MB_5) {
            error = true;
            this.sizeErrorStyle = DISPLAY_BLOCK;
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
                  if (link === null) {
                    this.isDisable = true;
                    this.labelStyle = NOT_ACTIVE_LABEL;
                  } else {
                    this.imageLink = link;
                    this.isDisable = false;
                    this.labelStyle = ACTIVE_LABEL;
                  }
                  this.addImageToDB();
                })
            );
          }
        });
      }
    }
  }

  private addImageToDB(): void {
    if (this.imageLink) {
      let newImage: Image;
      if (this.data.card.images) {
        newImage = {
          images: [...this.data.card.images, this.imageLink],
          history: [this.authUser?.displayName + ' added image', ...this.data.card.history]
        }
      } else {
        newImage = {
          images: [this.imageLink],
          history: [this.authUser?.displayName + ' added image', ...this.data.card.history]
        }
      }
      this.subscriptionList.push(
        this.crudService.updateObject(Collection.CARDS, this.data.card.id, newImage).subscribe()
      );
      this.updateCardData();
    }
  }

  private updateCardData(): void {
    this.progress = '';
    this.imageLink = '';
    const cardID: string = this.data.card.id;

    this.subscriptionList.push(
      this.crudService.getDataDoc<CardStore>(Collection.CARDS, this.data.card.id)
        .subscribe((card: CardStore | undefined) => {
          if (card) {
            this.data.card = card;
            this.data.card.id = cardID;
          }
        })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptionList.forEach((s: Subscription) => s.unsubscribe());
  }

}
