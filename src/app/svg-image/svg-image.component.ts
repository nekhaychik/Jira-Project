import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-svg-image',
  templateUrl: './svg-image.component.html',
  styleUrls: ['./svg-image.component.scss']
})
export class SvgImageComponent implements OnInit {

  @Input() imageSrc: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
