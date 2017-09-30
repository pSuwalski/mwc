import { Component } from '@angular/core';

@Component({
  selector: 'mwc-personal-data-form',
  templateUrl: './personal-data-form.component.html',
  styleUrls: ['./personal-data-form.component.css']
})
export class PersonalDataFormComponent {
  buttonclicked() {
    console.log('clicked');
  }
}
