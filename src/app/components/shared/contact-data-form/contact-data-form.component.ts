import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mwc-contact-data-form',
  templateUrl: './contact-data-form.component.html',
  styleUrls: ['./contact-data-form.component.css']
})
export class ContactDataFormComponent implements OnInit {
  @Input() contactDataForm: UserContactData;

  constructor() { }

  ngOnInit() {
  }

}

export interface UserContactData {
  postalCode: number;
  city: string;
  street: string;
  number: number;
  email: string;
  deskPhoneNumber: number;
  cellPhoneNumber: number;
}
