import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {CardStore, ListStore, UserStore} from '../services/types';
import {CrudService} from '../services/crud/crud.service';
import {Collection, Paths} from '../enums';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CardFormUpdateComponent} from '../card-form-update/card-form-update.component';
import {combineLatest, Subscription, takeWhile} from 'rxjs';
import {UploadService} from '../services/crud/upload.service';
import firebase from 'firebase/compat';
import {AuthService} from '../services/auth/auth.service';
import {Router} from "@angular/router";

export interface DialogData {
  card: CardStore,
  boardID: string
}

type Image = {
  images: string[];
  history: string[];
}

@Component({
  selector: 'app-full-card',
  templateUrl: './full-card.component.html',
  styleUrls: ['./full-card.component.scss']
})
export class FullCardComponent implements OnInit, OnDestroy {

  readonly subscription: Subscription = new Subscription();
  readonly ONE_SECOND: number = 1000;
  readonly MEDIA_FOLDER_PATH: string = 'task-images';
  public list: ListStore | undefined;
  public member: UserStore | undefined;
  public reporter: UserStore | undefined;
  private authUser: firebase.User | null = null;
  public imageLink: string = '';
  public progress: string | undefined = '';

  constructor(private crudService: CrudService,
              private authService: AuthService,
              public dialogRef: MatDialogRef<FullCardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dialog: MatDialog,
              private uploadService: UploadService,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.authService.user$.subscribe((value: firebase.User | null) => {
        this.authUser = value;
      })
    );
    this.getList();
    this.getMember();
    this.getReporter();

  }

  private getList(): void {
    this.subscription.add(
      this.crudService.getDataDoc<ListStore>(Collection.LISTS, this.data.card.listID).subscribe(
        (list: ListStore | undefined) => {
          this.list = list;
        }
      )
    );
  }

  private getMember(): void {
    if (this.data.card.memberID) {
      this.subscription.add(
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
      this.subscription.add(
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
      return new Date(seconds * this.ONE_SECOND).toDateString();
    }
    return 'Error';
  }

  public deleteCard(id: string): void {
    this.crudService.deleteObject(Collection.CARDS, id);
  }

  public openUpdateCardDialog(card: CardStore): void {
    console.log(card);
    let dialogRef = this.dialog.open(CardFormUpdateComponent, {data: {card: card, boardID: this.data.boardID}});
    this.router.navigate([Paths.board + '/' + this.data.boardID]);
  }

  public onFileSelected(event: Event): void {
    if (event) {
      const eventTarget: HTMLInputElement = (<HTMLInputElement>event?.target);
      if (eventTarget && eventTarget.files) {
        const file: File = eventTarget.files[0];
        combineLatest(this.uploadService.uploadFileAndGetMetadata(this.MEDIA_FOLDER_PATH, file))
          .pipe(
            takeWhile(([, link]) => {
              return !link;
            }, true),
          )
          .subscribe(([percent, link]) => {
            this.progress = percent;
            if (link === null) this.imageLink = '';
            else this.imageLink = link;

            if (this.imageLink) {
              let newImage: Image;
              if (this.data.card.images) {
                newImage = {
                  images: [...this.data.card.images, this.imageLink],
                  history: []
                }
              } else {
                newImage = {
                  images: [this.imageLink],
                  history: []
                }
              }
              if (this.data.card.history) {
                newImage.history = [this.authUser?.displayName + ' added image(s)', ...this.data.card.history];
              }

              this.progress = '';
              this.imageLink = '';
              this.crudService.updateObject(Collection.CARDS, this.data.card.id, newImage);
              this.crudService.getDataDoc<CardStore>(Collection.CARDS, this.data.card.id).subscribe((card: CardStore | undefined) => {
                if (card) this.data.card = card;
              });
            }
          });
      }
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
