import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatHeaderRowDef} from '@angular/material';
import {Sort} from '@angular/material';

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
    { id: 2, name: 'trafjka', surname: 'kowaelska', postcode: '50-245', city: 'Wroclaw', street: 'wawrzynkowskiego', number: 20, flatNumber: 90},
    { id: 89, name: 'asnna', surname: 'towalseka', postcode: '60-245', city: 'Krakow', street: 'pilsudzriego', number: 14, flatNumber: 12 },
    { id: 36, name: 'snsna', surname: 'powalseka', postcode: '70-245', city: 'Antorin', street: 'lukasirskiego', number: 8, flatNumber: 43 },
    { id: 25, name: 'karsafjka', surname: 'kowealska', postcode: '50-245', city: 'Wgoclaw', street: 'warrzynkowskiego', number: 20, flatNumber: 90},
    { id: 82, name: 'annsa', surname: 'towalskea', postcode: '60-245', city: 'Krasow', street: 'pilsudzriego', number: 14, flatNumber: 12 },
    { id: 32, name: 'snsna', surname: 'powalskea', postcode: '73-235', city: 'Antosin', street: 'lukasirskiego', number: 8, flatNumber: 43 },
    { id: 23, name: 'karsafjka', surname: 'kowealska', postcode: '53-235', city: 'Wsoclaw', street: 'warrzynkowskiego', number: 20, flatNumber: 90},
    { id: 85, name: 'annsa', surname: 'towealska', postcode: '60-235', city: 'Kradkow', street: 'pilsudrkiego', number: 14, flatNumber: 12 },
    { id: 34, name: 'snnsa', surname: 'peowalska', postcode: '73-235', city: 'Anhtonin', street: 'lukasrnskiego', number: 8, flatNumber: 43 },
    { id: 2, name: 'karafjka', surname: 'kowalska', postcode: '50-235', city: 'Wroclaw', street: 'wawrzynkowskiego', number: 20, flatNumber: 90},
    { id: 8, name: 'anna', surname: 'towalska', postcode: '60-235', city: 'Krakow', street: 'pilsudzkiego', number: 14, flatNumber: 12 },
    { id: 3, name: 'snna', surname: 'powalska', postcode: '70-235', city: 'Antonin', street: 'lukasinskiego', number: 8, flatNumber: 43 },
    { id: 2, name: 'karafjka', surname: 'kowaelska', postcode: '50-245', city: 'Wroclaw', street: 'wawrzynkowskiego', number: 20, flatNumber: 90},
    { id: 89, name: 'asnna', surname: 'towalseka', postcode: '60-245', city: 'Krakow', street: 'pilsudzriego', number: 14, flatNumber: 12 },
    { id: 36, name: 'snsna', surname: 'powalseka', postcode: '70-245', city: 'Antorin', street: 'lukasirskiego', number: 8, flatNumber: 43 },
    { id: 25, name: 'karsafjka', surname: 'kowealska', postcode: '50-245', city: 'Wgoclaw', street: 'warrzynkowskiego', number: 20, flatNumber: 90},
    { id: 82, name: 'annsa', surname: 'towalskea', postcode: '60-245', city: 'Krasow', street: 'pilsudzriego', number: 14, flatNumber: 12 },
    { id: 32, name: 'snsna', surname: 'powalskea', postcode: '73-235', city: 'Antosin', street: 'lukasirskiego', number: 8, flatNumber: 43 },
    { id: 23, name: 'karsafjka', surname: 'kowealska', postcode: '53-235', city: 'Wsoclaw', street: 'warrzynkowskiego', number: 20, flatNumber: 90},
    { id: 85, name: 'annsa', surname: 'towealska', postcode: '60-235', city: 'Kradkow', street: 'pilsudrkiego', number: 14, flatNumber: 12 },
    { id: 34, name: 'snnsa', surname: 'peowalska', postcode: '73-235', city: 'Anhtonin', street: 'lukasrnskiego', number: 8, flatNumber: 43 },
    { id: 2, name: 'karafjka', surname: 'kowalska', postcode: '50-235', city: 'Wroclaw', street: 'wawrzynkowskiego', number: 20, flatNumber: 90},
    { id: 8, name: 'anna', surname: 'towalska', postcode: '60-235', city: 'Krakow', street: 'pilsudzkiego', number: 14, flatNumber: 12 },
    { id: 3, name: 'snna', surname: 'aowalska', postcode: '70-235', city: 'Antonin', street: 'lukasinskiego', number: 8, flatNumber: 43 },
    { id: 2, name: 'karafjka', surname: 'kowaelska', postcode: '50-245', city: 'Wroclaw', street: 'wawrzynkowskiego', number: 20, flatNumber: 90},
    { id: 89, name: 'asnna', surname: 'towalseka', postcode: '60-245', city: 'Krakow', street: 'pilsudzriego', number: 14, flatNumber: 12 },
    { id: 36, name: 'snsna', surname: 'powalseka', postcode: '70-245', city: 'Antorin', street: 'lukasirskiego', number: 8, flatNumber: 43 },
    { id: 25, name: 'karsafjka', surname: 'kowealska', postcode: '50-245', city: 'Wgoclaw', street: 'warrzynkowskiego', number: 20, flatNumber: 90},
    { id: 82, name: 'annsa', surname: 'towalskea', postcode: '60-245', city: 'Krasow', street: 'pilsudzriego', number: 14, flatNumber: 12 },
    { id: 32, name: 'snsna', surname: 'powalskea', postcode: '73-235', city: 'Antosin', street: 'lukasirskiego', number: 8, flatNumber: 43 },
    { id: 23, name: 'karsafjka', surname: 'kowealska', postcode: '53-235', city: 'Wsoclaw', street: 'warrzynkowskiego', number: 20, flatNumber: 90},
    { id: 85, name: 'znnsa', surname: 'aowealska', postcode: '60-235', city: 'Kradkow', street: 'pilsudrkiego', number: 14, flatNumber: 12 },
    { id: 34, name: 'znnsa', surname: 'zeowalska', postcode: '13-235', city: 'Anhtonin', street: 'lukasrnskiego', number: 8, flatNumber: 43 },
  ];

  public searchString: string;
  id_sorted = false;
  name_sorted = false;
  surname_sorted = false;
  postcode_sorted = false;
  city_sorted = false;
  street_sorted = false;
  number_sorted = false;
  flat_number_sorted = false;

  constructor(
    public router: Router
  ) {
  }

  ngOnInit() {
  }

  sortById(){
    if (this.id_sorted === false) {
      this.users.sort((a, b) => a.id - b.id);
      this.id_sorted = true;
    }
    else {
      this.users.sort((a, b) => b.id - a.id);
      this.id_sorted = false;
    }
  }

  sortByName() {
    if (this.name_sorted === false) {
      this.users.sort((a, b) => { if (a.name < b.name) { return -1; }
        if (a.name > b.name) {return 1; }
        return 0;
      } );
      this.name_sorted = true;
    }
    else {
      this.users.sort((a, b) => { if (a.name > b.name) { return -1; }
        if (a.name < b.name) {return 1; }
        return 0;
      } );
      this.name_sorted = false;
    }
  }

  sortBySurname() {
    if (this.surname_sorted === false) {
      this.users.sort((a, b) => { if (a.surname < b.surname) { return -1; }
        if (a.surname > b.surname) {return 1; }
        return 0;
      } );
      this.surname_sorted = true;
    }
    else {
      this.users.sort((a, b) => { if (a.surname < b.surname) { return 1; }
        if (a.surname > b.surname) {return -1; }
        return 0;
      } );
      this.surname_sorted = false;
    }
  }

  sortByPostcode() {
    if (this.postcode_sorted === false) {
      this.users.sort((a, b) => { if (a.postcode < b.postcode) { return -1; }
        if (a.postcode > b.postcode) {return 1; }
        return 0;
      } );
      this.postcode_sorted = true;
    }
    else {
      this.users.sort((a, b) => { if (a.postcode < b.postcode) { return 1; }
        if (a.postcode > b.postcode) {return -1; }
        return 0;
      } );
      this.postcode_sorted = false;
    }
  }

  sortByCity() {
    if (this.city_sorted === false) {
      this.users.sort((a, b) => { if (a.city < b.city) { return -1; }
        if (a.city > b.city) {return 1; }
        return 0;
      } );
      this.city_sorted = true;
    }
    else {
      this.users.sort((a, b) => { if (a.city < b.city) { return 1; }
        if (a.city > b.city) {return -1; }
        return 0;
      } );
      this.city_sorted = false;
    }
  }

  sortByStreet() {
    if (this.street_sorted === false) {
      this.users.sort((a, b) => { if (a.street < b.street) { return -1; }
        if (a.street > b.street) {return 1; }
        return 0;
      } );
      this.street_sorted = true;
    }
    else {
      this.users.sort((a, b) => { if (a.street < b.street) { return 1; }
        if (a.street > b.street) {return -1; }
        return 0;
      } );
      this.street_sorted = false;
    }
  }

  sortByNumber() {
    if (this.number_sorted === false) {
      this.users.sort((a, b) => a.number - b.number);
      this.number_sorted = true;
    }
    else {
      this.users.sort((a, b) => b.number - a.number);
      this.number_sorted = false;
    }
  }

  sortByFlatNumber() {
    if (this.flat_number_sorted === false) {
      this.users.sort((a, b) => a.flatNumber - b.flatNumber);
      this.flat_number_sorted = true;
    }
    else {
      this.users.sort((a, b) => b.flatNumber - a.flatNumber);
      this.flat_number_sorted = false;
    }
  }

  search() {
    /*this.searchString = (<HTMLInputElement>document.getElementById('inputText')).value;*/

    /*console.log(this.searchString);
    console.log('clicked');*/
  }

  navigate(route: string) {
  this.router.navigate([route]);
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






