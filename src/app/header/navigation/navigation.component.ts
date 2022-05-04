import {Component, OnInit} from '@angular/core';
import {ButtonAppearance} from '../../enums';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public navigationLinks: string[] = [
    'Your boards',
    'Statistics'
  ];
  public buttonContent: string = 'Create Board';
  public buttonAppearance: ButtonAppearance = ButtonAppearance.Secondary;

  constructor() {
  }

  ngOnInit(): void {
  }

}
