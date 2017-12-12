import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContactData } from '../../../models/owner';
import * as _ from 'lodash';

@Component({
  selector: 'mwc-contact-data-form',
  templateUrl: './contact-data-form.component.html',
  styleUrls: ['./contact-data-form.component.css']
})
export class ContactDataFormComponent implements OnInit {

  sameAddressIndicator: boolean;

  @Input() contactDataForm: ContactData;
  @Input() editionDisabled = false;
  @Output() sameAddress = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
