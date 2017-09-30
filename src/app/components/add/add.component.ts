import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'mwc-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {


  buttonclicked() {
    console.log('clicked');
  }
}
