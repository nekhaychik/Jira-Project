import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import firebase from 'firebase/compat/app';
import {AuthService} from '../services/auth/auth.service';
import {CrudService} from '../services/crud/crud.service';
import {UserStore} from '../services/types';
import {Collection, Paths, Size} from '../enums';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public buttonContent: string = 'Log in with Google';
  public buttonSize: Size = Size.l;
  public user: firebase.User | null = null;
  public users: UserStore[] = [];

  constructor(private router: Router,
              private authService: AuthService,
              private crudService: CrudService) {
  }

  ngOnInit(): void {
    this.crudService.handleData<UserStore>(Collection.USERS).subscribe((value: UserStore[]) => {
      this.users = value;
    });
    this.authService.user$.subscribe((value: firebase.User | null) => this.user = value);
  }

  public addUser(): void {
    for (let user of this.users) {
      if (user.uid === this.user?.uid) return;
      else {
        this.crudService.createObject(Collection.USERS, {
          name: this.user?.displayName,
          uid: this.user?.uid,
          avatarUrl: this.user?.photoURL,
        });
      }
    }
  }

  public login(): void {
    this.authService.googleSignIn().pipe(
      switchMap(() => this.authService.user$),
    ).subscribe(() => {
      this.addUser();
      this.router.navigate([Paths.board]);
    });
  }
}
