import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  headerNav: string[] = [
    'Your boards',
    'Statistics'
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
