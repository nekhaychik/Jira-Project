import {Component, OnDestroy, OnInit} from '@angular/core';
import firebase from 'firebase/compat/app';
import {AuthService} from '../services/auth/auth.service';
import {Router} from '@angular/router';
import {ButtonAppearance, Paths} from '../enums';
import {Subscription} from 'rxjs';
import {BoardFormComponent} from '../board-form/board-form.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private subscriptionList: Subscription[] = [];
  public logoPath: string = 'assets/logo.svg';
  public buttonContent: string = 'Log out';
  public buttonAppearance: ButtonAppearance = ButtonAppearance.Secondary;
  public user: firebase.User | null = null;
  public statisticsPath: string = Paths.statistics;
  public boardPath: string = Paths.board;

  constructor(private router: Router,
              private authService: AuthService,
              public dialog: MatDialog) {
  }

  public ngOnInit(): void {
    this.getAuthUser();
  }

  private getAuthUser(): void {
    this.subscriptionList.push(
      this.authService.user$.subscribe((value: firebase.User | null) =>
        this.user = value
      )
    );
  }

  public logout(): void {
    this.subscriptionList.push(
      this.authService.signOut().subscribe(() =>
        this.router.navigate([Paths.authorization])
      )
    );
  }

  public navigate(path: string): void {
    this.router.navigate([path]);
  }

  public openBoardDialog(): void {
    this.dialog.open(BoardFormComponent);
  }

  public ngOnDestroy(): void {
    this.subscriptionList.forEach((s: Subscription) => s.unsubscribe());
  }

}
