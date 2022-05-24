import {Component, OnInit, Inject} from '@angular/core';
import {CardStore, ListStore, UserStore} from '../services/types';
import {CrudService} from '../services/crud/crud.service';
import {Collection} from '../enums';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CardFormUpdateComponent} from '../card-form-update/card-form-update.component';
import {combineLatest, takeWhile} from "rxjs";
import {UploadService} from "../services/crud/upload.service";
import firebase from "firebase/compat";
import {AuthService} from "../services/auth/auth.service";

export interface DialogData {
  card: CardStore,
  boardID: string
}

type Image = {
  images: string[],
  history: string[]
}

@Component({
  selector: 'app-full-card',
  templateUrl: './full-card.component.html',
  styleUrls: ['./full-card.component.scss']
})
export class FullCardComponent implements OnInit {

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
              private uploadService: UploadService) {
    this.crudService.handleData<CardStore>(Collection.CARDS).subscribe(
      (value) => {
        value.forEach((card) => {
          if(card.id === this.data.card.id)
            this.data.card = card;
        })
      }
    )
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => {
      this.authUser = value;
    });
    this.getList();
    this.getMember();
    this.getReporter();
  }

  private getList(): void {
    this.crudService.getDataDoc<ListStore>(Collection.LISTS, this.data.card.listID).subscribe(
      (value: ListStore | undefined) => {
        this.list = value;
      }
    );
  }

  private getMember(): void {
    if (this.data.card.memberID) {
      this.crudService.getDataDoc<UserStore>(Collection.USERS, this.data.card.memberID).subscribe(
        (value: UserStore | undefined) => {
          this.member = value;
        }
      );
    }
  }

  private getReporter(): void {
    if (this.data.card.reporterID) {
      this.crudService.getDataDoc<UserStore>(Collection.USERS, this.data.card.reporterID).subscribe(
        (value: UserStore | undefined) => {
          this.reporter = value;
        }
      );
    }
  }

  public getDate(value: number | undefined): string {
    if (value) {
      return new Date(value * 1000).toDateString();
    }
    return 'Error';
  }

  public deleteCard(id: string): void {
    this.crudService.deleteObject(Collection.CARDS, id);
  }

  public openUpdateCardDialog(card: CardStore): void {
    this.dialog.open(CardFormUpdateComponent, {data: {card: card, boardID: this.data.boardID}});
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

            if(this.imageLink) {
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
                newImage.history = [this.authUser?.displayName + ' added image(s)', ...this.data.card.history]
              }

              this.progress = ''; this.imageLink = '';
              this.crudService.updateObject(Collection.CARDS, this.data.card.id, newImage)
            }
          });
      }
    }

  }

}
