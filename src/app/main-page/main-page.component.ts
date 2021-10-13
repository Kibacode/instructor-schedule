import { Component, OnInit } from '@angular/core';
import { InstructorDto } from '../core/models/instructor.model';
import { InstructorService } from '../core/services/instructor/instructor.service';
import { ResponseService } from '../core/models/response.model';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  constructor(private instructorService: InstructorService) {}

  responseService?: ResponseService;
  instructors: InstructorDto[] = [];

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.instructorService.getAllInstructors().subscribe((res) => {
      if (res.success && res.result) {
        this.instructors = res.result;
      }
    });
  }
}
