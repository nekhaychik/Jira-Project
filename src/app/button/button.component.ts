import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ButtonComponent implements OnInit {

  @Input() content: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
