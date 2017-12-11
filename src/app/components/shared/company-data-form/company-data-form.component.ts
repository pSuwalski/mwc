import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mwc-company-data-form',
  templateUrl: './company-data-form.component.html',
  styleUrls: ['./company-data-form.component.css']
})
export class CompanyDataFormComponent implements OnInit {

  @Input() editionDisabled = false;

  constructor() { }

  ngOnInit() {
  }

}
