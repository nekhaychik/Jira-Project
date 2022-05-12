import {Component, OnInit} from '@angular/core';
import {ButtonAppearance} from '../../enums';
import {MatDialog} from "@angular/material/dialog";
import {BoardFormComponent} from "../../board-form/board-form.component";

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

  constructor(public dialog: MatDialog,) {
  }

  ngOnInit(): void {
  }

  public openBoardDialog(): void {
    this.dialog.open(BoardFormComponent);
  }

}
