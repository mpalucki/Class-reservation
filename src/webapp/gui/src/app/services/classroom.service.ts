import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'


interface Classroom {
  number: Number
}


@Injectable({
  providedIn: 'root'
})
export class ClassroomService {

  constructor(private http: HttpClient) { }


  getAllClassrooms(): Observable<Classroom[]> {
    return this.http.get<Classroom[]>('http://localhost:9000/classroom')
  }

  insertClassroom(classroom:Classroom): Observable<Classroom> {
    return this.http.post<Classroom>('http://localhost:9000/classroom', classroom)
  }

  //name must be an Id from mongoDB
  deleteClassroom(name: string) {
    return this.http.delete('http://localhost:8000/classroom/' + name)
  }

}
