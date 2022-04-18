import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from "firebase/compat/app";
import {AuthService} from "../services/auth/auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public buttonContent: string = 'Log In';
  public user: firebase.User | null = null;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe((value: firebase.User | null) => this.user = value);
  }

  public login(): void {
    this.authService.googleSignIn().subscribe(() => this.authService.user$.subscribe(() => this.router.navigate(['/'])));
  }

}
