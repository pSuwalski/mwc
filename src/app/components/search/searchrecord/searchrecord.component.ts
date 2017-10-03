import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mwc-searchrecord',
  templateUrl: './searchrecord.component.html',
  styleUrls: ['./searchrecord.component.css']
})
export class SearchrecordComponent implements OnInit {
  public users: UserData[] = [
    { id: 2, name: 'karafjka', surname: 'kowalska', postcode: '50-235', city: 'Wroclaw', street: 'wawrzynkowskiego', number: 20, flatNumber: 90},
    { id: 8, name: 'anna', surname: 'towalska', postcode: '60-235', city: 'Krakow', street: 'pilsudzkiego', number: 14, flatNumber: 12 },
    { id: 3, name: 'snna', surname: 'powalska', postcode: '70-235', city: 'Antonin', street: 'lukasinskiego', number: 8, flatNumber: 43 },
  ];


  constructor() { }

  ngOnInit() {
  }

  sortById() {
    this.users.sort((a, b) => a.id - b.id);
    console.log('clicked');
  }

  sortByName() {
    this.users.sort((a, b) => { if (a.name < b.name) { return -1; }
      if (a.name > b.name) {return 1; }
      return 0;
    } );
  }

  sortBySurname() {
    this.users.sort((a, b) => { if (a.surname < b.surname) { return -1; }
      if (a.surname > b.surname) {return 1; }
      return 0;
    } );
  }

  sortByPostcode() {
    this.users.sort((a, b) => { if (a.postcode < b.postcode) { return -1; }
      if (a.postcode > b.postcode) {return 1; }
      return 0;
    } );
  }

  sortByCity() {
    this.users.sort((a, b) => { if (a.city < b.city) { return -1; }
      if (a.city > b.city) {return 1; }
      return 0;
    } );
  }

  sortByStreet() {
    this.users.sort((a, b) => { if (a.street < b.street) { return -1; }
      if (a.street > b.street) {return 1; }
      return 0;
    } );
  }

  sortByNumber() {
    this.users.sort((a, b) => a.number - b.number);
  }

  sortByFlatNumber() {
    this.users.sort((a, b) => a.flatNumber - b.flatNumber);
  }
}


export interface UserData{
  id: number;
  name: string;
  surname: string;
  postcode: string;
  city: string;
  street: string;
  number: number;
  flatNumber: number;
}





