import { Component, OnInit } from '@angular/core';
import {ClassroomService} from "../services/classroom.service";



@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
  providers: [ClassroomService]
})
export class ReservationsComponent implements OnInit {

  constructor(private classroomService: ClassroomService) { }

  ngOnInit() {
    var classrooms = this.classroomService.getAllClassrooms();
  }


}
