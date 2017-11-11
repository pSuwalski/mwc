import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mwc-contact-data-form',
  templateUrl: './contact-data-form.component.html',
  styleUrls: ['./contact-data-form.component.css']
})
export class ContactDataFormComponent implements OnInit {

  @Input() dataForm: any;

  constructor() { }

  ngOnInit() {
  }

}
