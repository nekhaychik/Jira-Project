import {Component} from '@angular/core';
import {Shape, Size} from "../enums";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {

  public imagePath: string = 'assets/background.png';
  public buttonSize: Size = Size.xs;
  public buttonShape: typeof Shape = Shape;

}
