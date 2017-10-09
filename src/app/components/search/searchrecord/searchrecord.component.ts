import { Component, OnInit } from '@angular/core';
import {stringDistance} from "codelyzer/util/utils";
import { Router } from '@angular/router';

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
  ];

  public searchString: string;

  constructor(
    public router: Router
  ) {
  }

  ngOnInit() {
  }

  sortById() {
    this.users.sort((a, b) => a.id - b.id);
    // console.log('clicked');
  }

 /* revertSortById(){
    this.users.sort((a, b) => b.id - a.id);
    console.log('revert-clicked');
  }*/

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






