import { Component, Input } from '@angular/core';
import { Parcel } from '../../../models/parcel';


@Component({
  selector: 'mwc-parcels-data-form',
  templateUrl: './parcels-data-form.component.html',
  styleUrls: ['./parcels-data-form.component.css']
})
export class ParcelsDataFormComponent {
  @Input() parcel: Parcel;
  progressBarIndicator: boolean;

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
  ) {
  }



}
