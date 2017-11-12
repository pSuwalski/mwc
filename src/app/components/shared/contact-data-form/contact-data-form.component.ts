import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mwc-contact-data-form',
  templateUrl: './contact-data-form.component.html',
  styleUrls: ['./contact-data-form.component.css']
})
export class ContactDataFormComponent implements OnInit {

  @Input() contactDataForm: UserContactData = {
    postalCode: undefined, city: undefined, street: undefined, number: undefined,
    email: undefined, deskPhoneNumber: undefined, cellPhoneNumber: undefined
  };


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