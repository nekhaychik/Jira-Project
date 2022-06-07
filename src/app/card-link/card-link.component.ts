import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CardStore} from '../services/types';
import {CrudService} from '../services/crud/crud.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Collection, Paths} from '../enums';
import {FullCardComponent} from '../full-card/full-card.component';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-card-link',
  templateUrl: './card-link.component.html',
  styleUrls: ['./card-link.component.scss']
})
export class CardLinkComponent implements OnInit, OnDestroy {

  private subscriptionList: Subscription[] = [];
  public card: CardStore | undefined;
  private boardID: string = '';

  constructor(private crudService: CrudService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.subscriptionList.push(
      this.route.params.subscribe((params: Params) => {
        this.getCard(params['id']);
        this.getBoardID();
      })
    );
  }

  private getCard(id: string): void {
    this.subscriptionList.push(
      this.crudService.getDataDoc<CardStore>(Collection.CARDS, id).subscribe((card: CardStore | undefined) => {
        this.card = card;
        if (this.card) {
          this.card.id = id;
        }
        this.navigate();
      })
    )
  }

  private getBoardID(): void {
    let startIndex: number = this.router.url.indexOf('/', 1) + 1;
    let endIndex: number = this.router.url.lastIndexOf('/');
    this.boardID = this.router.url.slice(startIndex, endIndex);
  }

  private navigate(): void {
    let dialogRef: MatDialogRef<FullCardComponent> = this.dialog.open(FullCardComponent, {
      data: {
        card: this.card,
        boardID: this.boardID
      }
    });
    this.subscriptionList.push(
      dialogRef.afterClosed().subscribe(() => {
        this.router.navigate([Paths.board + '/' + this.boardID]);
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptionList.forEach((s: Subscription) => s.unsubscribe());
  }

}
