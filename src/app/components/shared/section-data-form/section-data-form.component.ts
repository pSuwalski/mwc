import { Component, OnInit, Input } from '@angular/core';
import { Section } from '../../../models/section';

@Component({
  selector: 'mwc-section-data-form',
  templateUrl: './section-data-form.component.html',
  styleUrls: ['./section-data-form.component.css']
})
export class SectionDataFormComponent implements OnInit {

  @Input() sectionDataForm: Section;
  @Input() editionDisabled: boolean;
  selectedAreaType: string;
  areaType = [
    { value: 'wojewodztwo', viewValue: 'województwo' },
    { value: 'powiat', viewValue: 'powiat' },
    { value: 'gmina', viewValue: 'gmina' },
    { value: 'miasto', viewValue: 'miasto' },
    { value: 'wioska', viewValue: 'wioska' },
    { value: 'solectwo', viewValue: 'sołectwo' },
    { value: 'zlewnia', viewValue: 'zlewnia' },
    { value: 'inne', viewValue: 'inne' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
