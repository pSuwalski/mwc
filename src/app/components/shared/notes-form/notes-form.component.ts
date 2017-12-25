import { Component, Input } from '@angular/core';
import { Note } from '../../search/searchresult/searchresult.component';



@Component({
  selector: 'mwc-notes-form',
  templateUrl: './notes-form.component.html',
  styleUrls: ['./notes-form.component.css']
})
export class NotesFormComponent  {

  @Input() note: Note;
  @Input() editionDisabled = false;
  @Input() id: string;

  constructor(
  ) {


  }


}
