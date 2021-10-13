import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventDto } from '../../models/event.model';
import { ResponseService } from '../../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class EventServices {
  constructor(private http: HttpClient) {}

  deleteEvent(id: number) {
    console.log(id);
    return this.http.delete<ResponseService>(
      `http://localhost:8080/event/${id}`
    );
  }

  addEvent(event: EventDto) {
    return this.http.post<ResponseService>(
      `http://localhost:8080/event`,
      event
    );
  }

  updateEvent(event: EventDto) {
    console.log(event);
    return this.http.put<ResponseService>(`http://localhost:8080/event`, event);
  }
}
