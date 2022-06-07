import {Component, Input} from '@angular/core';
import {ButtonAppearance, Size} from '../enums';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {

  @Input()
  public content: string = '';
  @Input()
  public buttonAppearance: ButtonAppearance = ButtonAppearance.Primary;
  @Input()
  public buttonSize: Size = Size.s;
  @Input()
  public isDisable: boolean = false;

}
