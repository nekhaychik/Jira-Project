import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import firebase from 'firebase/compat/app';
import {AuthService} from '../services/auth/auth.service';
import {Paths, Size} from '../enums';
import {Subscription, switchMap} from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  private subscriptionList: Subscription[] = [];
  private user: firebase.User | null = null;
  public buttonContent: string = 'Log in with Google';
  public buttonSize: Size = Size.l;

  constructor(private router: Router,
              private authService: AuthService) {
  }

  public ngOnInit(): void {
    this.subscriptionList.push(
      this.authService.user$.subscribe((value: firebase.User | null) =>
        this.user = value
      )
    );
  }

  public login(): void {
    this.subscriptionList.push(
      this.authService.googleSignIn().pipe(
        switchMap(() => this.authService.user$),
      ).subscribe(() => {
        this.router.navigate([Paths.board]);
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptionList.forEach((s: Subscription) => s.unsubscribe());
  }

}
