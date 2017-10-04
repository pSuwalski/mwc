import { Component } from '@angular/core';

@Component({
  selector: 'mwc-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  public history_records: UserData[] = [
    { time: '8:10', name: 'anna', surname: 'kowalska', postcode: '50-235',
    city: 'Biało', street: 'wawrzynkowskiego', number: 20, flatNumber: 90},
    { time: '9:05', name: 'knna', surname: 'towalska', postcode: '50-235',
    city: 'Biało', street: 'wawrzynkowskiego', number: 14, flatNumber: 12 },
    { time: '9:45', name: 'snna', surname: 'powalska', postcode: '50-235',
    city: 'Biało', street: 'wawrzynkowskiego', number: 8, flatNumber: 43 },
    { time: '8:10', name: 'anna', surname: 'kowalska', postcode: '50-235',
    city: 'Biało', street: 'wawrzynkowskiego', number: 20, flatNumber: 90},
    { time: '9:05', name: 'knna', surname: 'towalska', postcode: '50-235',
    city: 'Biało', street: 'wawrzynkowskiego', number: 14, flatNumber: 12 },
    { time: '9:45', name: 'snna', surname: 'powalska', postcode: '50-235',
    city: 'Biało', street: 'wawrzynkowskiego', number: 8, flatNumber: 43 },
    { time: '8:10', name: 'anna', surname: 'kowalska', postcode: '50-235',
    city: 'Biało', street: 'wawrzynkowskiego', number: 20, flatNumber: 90},
    { time: '9:05', name: 'knna', surname: 'towalska', postcode: '50-235',
    city: 'Biało', street: 'wawrzynkowskiego', number: 14, flatNumber: 12 },
    { time: '9:45', name: 'snna', surname: 'powalska', postcode: '50-235',
    city: 'Biało', street: 'wawrzynkowskiego', number: 8, flatNumber: 43 },
  ];
}

export interface UserData {
  time: string;
  name: string;
  surname: string;
  postcode: string;
  city: string;
  street: string;
  number: number;
  flatNumber: number;
}
