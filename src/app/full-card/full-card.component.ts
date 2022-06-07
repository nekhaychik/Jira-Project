import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {CardStore, ListStore, UserStore} from '../services/types';
import {CrudService} from '../services/crud/crud.service';
import {Collection, Paths} from '../enums';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {CardFormUpdateComponent} from '../card-form-update/card-form-update.component';
import {combineLatest, Subscription, takeWhile} from 'rxjs';
import {UploadService} from '../services/crud/upload.service';
import firebase from 'firebase/compat';
import {AuthService} from '../services/auth/auth.service';
import {Router} from '@angular/router';
import {MEDIA_FOLDER_PATH, ONE_SECOND} from '../constants';

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

@Component({
  selector: 'app-full-card',
  templateUrl: './full-card.component.html',
  styleUrls: ['./full-card.component.scss']
})
export class FullCardComponent implements OnInit, OnDestroy {

  private subscriptionList: Subscription[] = [];
  public list: ListStore | undefined;
  public member: UserStore | undefined;
  public reporter: UserStore | undefined;
  private authUser: firebase.User | null = null;
  public labelStyle: string = ACTIVE_LABEL;
  public imageLink: string = '';
  public progress: string | undefined = '';
  public isDisable: boolean = false;

  constructor(private crudService: CrudService,
              private authService: AuthService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dialog: MatDialog,
              private uploadService: UploadService,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.getAuthUser();
    this.getList();
    this.getMember();
    this.getReporter();
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
      this.crudService.getDataDoc<ListStore>(Collection.LISTS, this.data.card.listID).subscribe(
        (list: ListStore | undefined) => {
          this.list = list;
        }
      )
    );
  }

  private getMember(): void {
    if (this.data.card.memberID) {
      this.subscriptionList.push(
        this.crudService.getDataDoc<UserStore>(Collection.USERS, this.data.card.memberID).subscribe(
          (user: UserStore | undefined) => {
            this.member = user;
          }
        )
      );
    }
  }

  private getReporter(): void {
    if (this.data.card.reporterID) {
      this.subscriptionList.push(
        this.crudService.getDataDoc<UserStore>(Collection.USERS, this.data.card.reporterID).subscribe(
          (user: UserStore | undefined) => {
            this.reporter = user;
          }
        )
      );
    }
  }

  public getDate(seconds: number | undefined): string {
    if (seconds) {
      return new Date(seconds * ONE_SECOND).toDateString();
    }
    return 'Not found';
  }

  public deleteCard(id: string): void {
    this.subscriptionList.push(
      this.crudService.deleteObject(Collection.CARDS, id).subscribe()
    );
  }

  public openUpdateCardDialog(card: CardStore): void {
    this.dialog.open(CardFormUpdateComponent, {data: {card: card, boardID: this.data.boardID}});
    this.router.navigate([Paths.board + '/' + this.data.boardID]);
  }

  public onFileSelected(event: Event): void {
    if (event) {
      const eventTarget: HTMLInputElement = (<HTMLInputElement>event?.target);
      if (eventTarget && eventTarget.files) {
        const file: File = eventTarget.files[0];
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
    }
  }

  private addImageToDB(): void {
    if (this.imageLink) {
      let newImage: Image;
      if (this.data.card.images) {
        newImage = {
          images: [...this.data.card.images, this.imageLink],
          history: [this.authUser?.displayName + ' added image(s)', ...this.data.card.history]
        }
      } else {
        newImage = {
          images: [this.imageLink],
          history: [this.authUser?.displayName + ' added image(s)', ...this.data.card.history]
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
      this.crudService.getDataDoc<CardStore>(Collection.CARDS, this.data.card.id).subscribe((card: CardStore | undefined) => {
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
