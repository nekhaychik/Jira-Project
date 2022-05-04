import {Component, OnInit, Input} from '@angular/core';
import {ButtonAppearance, Size} from '../enums';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {

  @Input() content: string = '';
  @Input() buttonAppearance: ButtonAppearance = ButtonAppearance.Primary;
  @Input() buttonSize: Size = Size.s;

  constructor() {
  }

  ngOnInit(): void {
  }

}
