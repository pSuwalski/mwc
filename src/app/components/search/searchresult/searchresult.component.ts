import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mwc-searchresult',
  templateUrl: './searchresult.component.html',
  styleUrls: ['./searchresult.component.css']
})
export class SearchresultComponent implements OnInit {

  notes: Note[] = [];

  constructor(
    public router: Router) {

  }

  ngOnInit() {
  }

  /*  sortByName() {
      this.users.sort((a, b) => a.age - b.age);
      }
  */
  navigate(route: string) {
    this.router.navigate([route]);
  }

  addNote(note: any) {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1; // January is 0!
    const yyyy = today.getFullYear();
    note.date = dd.toString() + '.' + mm.toString() + '.' + yyyy.toString();

    this.notes.push({ 'date': note.date, 'content': note.note_content });
  }

}


export interface Note {
  date: string;
  content: number;
}
