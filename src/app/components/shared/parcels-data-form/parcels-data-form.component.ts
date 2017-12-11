import { Component, Input } from '@angular/core';
import { Parcel, emptyAppliance, emptyForemanDecision, emptyNumbered } from '../../../models/parcel';
import { UserService } from '../../../services/user.service';
import { SectionService } from '../../../services/section.service';
import { Section } from '../../../models/section';
import { OnChanges, OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { User } from '../../../models/user';



@Component({
  selector: 'mwc-parcels-data-form',
  templateUrl: './parcels-data-form.component.html',
  styleUrls: ['./parcels-data-form.component.css']
})
export class ParcelsDataFormComponent implements OnChanges, OnInit {

  currentUser: User;
  sections: Section[];
  @Input() parcel: Parcel;
  @Input() companyId = '';
  @Input() editionDisabled = false;
  progressBarIndicator: boolean;
  progressBar = true;

  selectedPowierzchnia: string;
  powierzchnia = [
    { value: 'zmeliorowana', viewValue: 'Zmeliorowana' },
    { value: 'fizyczna', viewValue: 'Fizyczna' },
    { value: 'calkowita', viewValue: 'Całkowita' },
    { value: 'odnoszaca_korzysci', viewValue: 'Odnosząca korzyści' },
  ];
  selectedRow: boolean;
  row = [
    { value: true, viewValue: 'Tak' },
    { value: false, viewValue: 'Nie' },
  ];
  selectedDrenaz: boolean;
  drenaz = [
    { value: true, viewValue: 'Tak' },
    { value: false, viewValue: 'Nie' },
  ];

  selectedObjetaCzlonkostwem: boolean;
  objetaCzlonkostwem = [
    { value: true, viewValue: 'Tak' },
    { value: false, viewValue: 'Nie' },
  ];

  selectedPodstawaPrawna: string;
  podstawaPrawna = [
    { value: 'deklaracjaWlasciciela', viewValue: 'Deklaracja właściciela' },
    { value: 'nastepstwoPrawne', viewValue: 'Następstwo Prawne' },
  ];

  selectedObjetaDecyzja: boolean;
  objetaDecyzja = [
    { value: true, viewValue: 'Tak' },
    { value: false, viewValue: 'Nie' },
  ];
  constructor(
    private ss: SectionService,
    private us: UserService
  ) {
  }
  ngOnInit() {
    this.us.currentUser.subscribe((u) => {
      this.currentUser = u;
      this.ss.getCompanySections(this.currentUser.unionId, this.parcel.companyId)
        .then((ss) => { this.sections = ss; this.progressBar = false; });
    }
    );
  }

  ngOnChanges() {
    if (this.currentUser) {
      this.sections = [];
      this.ss.getCompanySections(this.currentUser.unionId, this.parcel.companyId).then((ss) => this.sections = ss);
    }
  }

  addAppliance() {
    this.parcel.appliances.push(
      emptyAppliance()
    );
  }

  addDecision() {
    this.parcel.foremanDecisions.push(
      emptyForemanDecision()
    );
  }

  addDrainage() {
    this.parcel.drainages.push(
      emptyNumbered()
    );
  }

  addTrench() {
    this.parcel.trenches.push(
      emptyNumbered()
    );
  }

  removeDecision() {
    this.parcel.foremanDecisions.pop();
  }

  removeDrainage() {
    this.parcel.drainages.pop();
  }

  removeAppliance() {
    this.parcel.appliances.pop();
  }

  removeTrench() {
    this.parcel.trenches.pop();
  }
}
