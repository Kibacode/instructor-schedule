import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseService } from '../../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  constructor(private http: HttpClient) {}

  getAllInstructors() {
    return this.http.get<ResponseService>('http://localhost:8080/instructor');
  }
}
