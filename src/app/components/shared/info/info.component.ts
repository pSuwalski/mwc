import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Resolution, emptyPayment } from '../../../models/resolution';
import { Router } from '@angular/router';


@Component({
  selector: 'mwc-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {
  @Input() text: string;
  @Input() buttonText: string;
  @Input() success: boolean;
  @Input() link: string;
  @Output() click = new EventEmitter<string>();

  constructor(
    public router: Router
  ) {
  }

}
