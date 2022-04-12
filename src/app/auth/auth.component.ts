import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public buttonContent: string = 'Log In';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public navigate(): void {
    this.router.navigate(['/main']);
  }

}
