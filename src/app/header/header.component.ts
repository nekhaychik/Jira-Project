import {Component, OnInit} from '@angular/core';
import firebase from 'firebase/compat/app';
import {AuthService} from '../services/auth/auth.service';
import {Router} from '@angular/router';
import {ButtonAppearance, Paths} from '../enums';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public logoPath: string = 'assets/logo.svg';
  public buttonContent: string = 'Log out';
  public buttonAppearance: ButtonAppearance = ButtonAppearance.Secondary;
  public user: firebase.User | null = null;

  constructor(private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => this.user = value);
  }

  public logout(): void {
    this.authService.signOut().subscribe(() => this.router.navigate([Paths.authorization]));
  }

}
