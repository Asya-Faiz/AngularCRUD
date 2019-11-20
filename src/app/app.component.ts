import {Component, OnInit,ViewChild, ChangeDetectorRef} from '@angular/core';
import {NotesService} from './notes.service';
import {Note} from './note';
import {Observable} from 'rxjs';
import {MatTableDataSource, MatPaginator} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
 
  errMessage: string;
  openState: boolean = false;
  btn_update: boolean = true;
  btn_done: boolean = false;
  del_id :string;
  up_id:string;
  note = new Note();
  note_array: Array<Note> = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<Note>;

  constructor(private noteservice: NotesService, private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.note = new Note();
    this.changeDetectorRef.detectChanges();
    this.noteservice.getNotes().subscribe(data => {
      console.log(data);
      this.note_array = data;
      this.dataSource = new MatTableDataSource<Note>(this.note_array);
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    },
    error => {
      this.errMessage = error.message;
    }
    );

  }
  add() {
    // console.log(this.openState)
    if (this.note.title == null || this.note.text == null) {
      this.errMessage = 'Title and Text both are required fields';
    }else{
      this.note_array.push(this.note);
      this.noteservice.addNote(this.note).subscribe(data => {
        
        this.ngOnInit();
      },
      error => {
        this.errMessage = error.message;
        this.note_array.pop();
     });
      this.note = new Note();
    }
  }

  delete(del: string) {
    this.del_id = del;
    console.log(this.del_id);
    let pos = this.note_array.findIndex(k => k.id == this.del_id);
    if(pos > -1){
      this.noteservice.deleteNote(this.del_id).subscribe(data => {
        this.ngOnInit();
      },
      error => {
        this.errMessage = error.message;
        // this.note_array.splice(pos,1);
      })
      
      console.log(this.note_array);
    }
  }

  search(up: string){
    this.up_id=up;
    this.noteservice.searchNote(this.up_id).subscribe(data => {
      this.openState = true;
      this.note.title = data.title;
      this.note.text = data.text;
      this.btn_done = true;
      this.btn_update = false;
    },
    error => {
      this.errMessage = error.message;
    });
  }

  update() {
    this.note.id = this.up_id;
    console.log(this.up_id);
    this.note.title = this.note.title;
    this.note.text = this.note.text;
    if(this.note.title != null || this.note.text != null){
      this.noteservice.updateNote(this.note).subscribe(data => {
        let pos = this.note_array.findIndex(k => k.id == this.up_id);{
          this.note_array[pos].title = this.note.title;
          this.note_array[pos].text = this.note.text;
          this.btn_done = false;
          this.btn_update = true;
          this.openState = false;
          this.ngOnInit();
        }
      },
      error => {
        this.errMessage = error.message;
      });
    }
    else{
      this.errMessage = 'Title and Text both are required fields'; 
    }

  }
}
