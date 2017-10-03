import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mwc-searchresult',
  templateUrl: './searchresult.component.html',
  styleUrls: ['./searchresult.component.css']
})
export class SearchresultComponent implements OnInit {
  public users: Mwc[] = [
    { name: 'pitor', age: 1, addres: 'Biało' },
    { name: 'asd', age: 9, addres: 'asd' },
    { name: 'pitxcvor', age: 2, addres: 'viia' }
  ];

  constructor() { }

  ngOnInit() {
  }

  sortByName() {
    this.users.sort((a, b) => a.age - b.age);
  }


}


export interface Mwc {
  name: string;
  age: number;
  addres: string;
}
