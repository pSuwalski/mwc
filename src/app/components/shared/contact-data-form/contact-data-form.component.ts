import { Component, OnInit, Input } from '@angular/core';
import { ContactData } from '../../../models/leesee';

@Component({
  selector: 'mwc-contact-data-form',
  templateUrl: './contact-data-form.component.html',
  styleUrls: ['./contact-data-form.component.css']
})
export class ContactDataFormComponent implements OnInit {
  @Input() contactDataForm: ContactData;

  constructor() { }

  ngOnInit() {
  }

}
