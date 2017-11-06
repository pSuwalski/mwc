import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mwc-parcels-data-form',
  templateUrl: './parcels-data-form.component.html',
  styleUrls: ['./parcels-data-form.component.css']
})
export class ParcelsDataFormComponent implements OnInit {
  selectedPowierzchnia: string;
  powierzchnia = [
    {value: 'zmeliorowana', viewValue: 'Zmeliorowana'},
    {value: 'fizyczna', viewValue: 'Fizyczna'},
    {value: 'calkowita', viewValue: 'Całkowita'},
    {value: 'odnoszaca_korzysci', viewValue: 'Odnosząca korzyści'},
  ];
  selectedRow: string;
  row = [
    {value: 'tak', viewValue: 'Tak'},
    {value: 'nie', viewValue: 'Nie'},
  ];
  selectedDrenaz: string;
  drenaz = [
    {value: 'tak', viewValue: 'Tak'},
    {value: 'nie', viewValue: 'Nie'},
  ];

  selectedObjetaCzlonkostwem: string;
  objetaCzlonkostwem = [
    {value: 'tak', viewValue: 'Tak'},
    {value: 'nie', viewValue: 'Nie'},
  ];

  selectedPodstawaPrawna: string;
  podstawaPrawna = [
    {value: 'deklaracjaWlasciciela', viewValue: 'Deklaracja właściciela'},
    {value: 'nastepstwoPrawne', viewValue: 'Następstwo Prawne'},
  ];

  selectedObjetaDecyzja: string;
  objetaDecyzja = [
    {value: 'tak', viewValue: 'Tak'},
    {value: 'nie', viewValue: 'Nie'},
  ];
  constructor() { }

  ngOnInit() {
  }



}
