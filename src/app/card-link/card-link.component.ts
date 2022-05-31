import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Observable, Subscription, takeWhile} from "rxjs";
import {CardStore, ListStore, UserStore} from "../services/types";
import firebase from "firebase/compat";
import {CrudService} from "../services/crud/crud.service";
import {AuthService} from "../services/auth/auth.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {UploadService} from "../services/crud/upload.service";
import {Collection, Paths} from "../enums";
import {CardFormUpdateComponent} from "../card-form-update/card-form-update.component";
import {DialogData, FullCardComponent} from "../full-card/full-card.component";
import {ActivatedRoute, Params, Router} from "@angular/router";

type Image = {
  images: string[];
  history: string[];
}

@Component({
  selector: 'app-card-link',
  templateUrl: './card-link.component.html',
  styleUrls: ['./card-link.component.scss']
})
export class CardLinkComponent implements OnInit, OnDestroy {

  readonly subscription: Subscription = new Subscription();
  readonly ONE_SECOND: number = 1000;
  readonly MEDIA_FOLDER_PATH: string = 'task-images';
  public list: ListStore | undefined;
  public member: UserStore | undefined;
  public reporter: UserStore | undefined;
  private authUser: firebase.User | null = null;
  public imageLink: string = '';
  public progress: string | undefined = '';
  public card: CardStore | undefined;
  private cards$: Observable<CardStore[]> = this.crudService.handleData<CardStore>(Collection.CARDS);

  private boardID: string = '';

  constructor(private crudService: CrudService,
              private authService: AuthService,
              private dialog: MatDialog,
              private uploadService: UploadService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {

      this.crudService.getDataDoc<CardStore>(Collection.CARDS, params['id']).subscribe((card: CardStore | undefined) => {
        this.card = card;
        if (this.card) this.card.id = params['id'];

        let startIndex = this.router.url.indexOf('/', 1) + 1;
        let endIndex = this.router.url.lastIndexOf('/');
        this.boardID = this.router.url.slice(startIndex, endIndex);

        let dialogRef = this.dialog.open(FullCardComponent, {data: {card: card, boardID: this.boardID}});
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate([Paths.board + '/' + this.boardID]);
        })
      });
    });


  }


  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
