import {Component} from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {

  public imagePath: string = 'assets/background.png';


  open = false;

  toggle(open: boolean) {
    this.open = open;
  }
}
