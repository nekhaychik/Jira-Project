import { Component, OnInit } from '@angular/core';
import { USERS } from 'src/app/mock-users';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public logoPath: string = 'assets/logo.svg';
  public userName: string = USERS[0];

  constructor() { }

  ngOnInit(): void {
  }

}
