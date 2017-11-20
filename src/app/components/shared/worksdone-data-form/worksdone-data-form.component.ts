import { Component, OnInit, Input } from '@angular/core';
import { Works } from '../../../models/works';

@Component({
  selector: 'mwc-worksdone-data-form',
  templateUrl: './worksdone-data-form.component.html',
  styleUrls: ['./worksdone-data-form.component.css']
})
export class WorksdoneDataFormComponent implements OnInit {

  @Input() worksdoneDataForm: Works;
  constructor() { }

  ngOnInit() {
  }

}
