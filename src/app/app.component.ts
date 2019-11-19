import {Component, OnInit} from '@angular/core';
import {NotesService} from './notes.service';
import {Note} from './note';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  errMessage: string;
  note = new Note();
  note_array: Array<Note> = [];

  constructor(private noteservice: NotesService) {

  }

  ngOnInit() {
    this.note = new Note();
    this.noteservice.getNotes().subscribe(data => {
      console.log(data);
      this.note_array = data;
    },
    error => {
      this.errMessage = error.message;
    }
    );

  }
  add() {
    if (this.note.title == null || this.note.text == null) {
      this.errMessage = 'Title and Text both are required fields';
    }
      this.note_array.push(this.note);
      this.noteservice.addNote(this.note).subscribe(data => {
      // console.log('Posted to JSON');
      },
      error => {
        this.errMessage = error.message;
        this.note_array.pop();
     });
      this.note = new Note();
    }
}
