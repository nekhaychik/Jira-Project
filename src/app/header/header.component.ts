import { Component, OnInit } from '@angular/core';
import { USERS } from 'src/app/mock-users';
import firebase from "firebase/compat/app";
import {AuthService} from "../services/auth/auth.service";
import {Router} from "@angular/router";
import {ButtonAppearance} from "../enums";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public logoPath: string = 'assets/logo.svg';
  public userName: string = USERS[0];
  public user: firebase.User | null = null;
  public buttonContent: string = 'Log out';
  public buttonAppearance: ButtonAppearance = ButtonAppearance.Secondary;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => this.user = value);
  }

  public logout(): void {
    this.authService.signOut().subscribe(() => this.router.navigate(['/authorization']));
  }

}
