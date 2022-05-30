import {Component} from '@angular/core';
import {ButtonAppearance, Paths} from '../../enums';
import {MatDialog} from '@angular/material/dialog';
import {BoardFormComponent} from '../../board-form/board-form.component';
import {Navigation} from '../../services/types';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  public navigationLinks: Navigation[] = [
    {name: 'Your boards', path: Paths.board},
    {name: 'Statistics', path: Paths.statistics}
  ];
  public buttonContent: string = 'Create Board';
  public buttonAppearance: ButtonAppearance = ButtonAppearance.Secondary;

  constructor(public dialog: MatDialog) {
  }

  public openBoardDialog(): void {
    this.dialog.open(BoardFormComponent);
  }

}
