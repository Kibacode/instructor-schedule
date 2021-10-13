import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { EventDto } from '../core/models/event.model';
import { InstructorDto } from '../core/models/instructor.model';
import { EventServices } from '../core/services/event/event.service';
import { InstructorService } from '../core/services/instructor/instructor.service';

@Component({
  selector: 'app-instructor-detail',
  templateUrl: './instructor-detail.component.html',
  styleUrls: ['./instructor-detail.component.scss'],
})
export class InstructorDetailComponent implements OnInit {
  instructor: InstructorDto;
  events: EventDto[];
  delete: boolean;

  update: boolean = false;
  add: boolean = false;

  form = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    description: new FormControl(),
    eventType: new FormControl(),
    id: new FormControl(),
  });

  displayedColumns: string[] = [
    'startDate',
    'endDate',
    'eventType',
    'description',
    'actions',
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private instructorService: InstructorService,
    public dialog: MatDialog,
    private eventServices: EventServices,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    let idString = this.activatedRoute.snapshot.paramMap.get('id');
    if (idString) {
      let instructorId: number = Number.parseInt(idString);
      this.instructorService.getAllInstructors().subscribe((res) => {
        if (res.success && res.result) {
          this.instructor = res.result.find((i) => i.id === instructorId);
          if (this.instructor?.events) {
            this.events = this.instructor?.events.sort((a, b) => {
              return (
                new Date(a.startDate).getTime() -
                new Date(b.startDate).getTime()
              );
            });
          }
        }
      });
    }
  }

  deleteDialog(id: number) {
    const dialogRef = this.dialog.open(DialogDelete, {
      width: '250px',
    });
    console.log('Numero a eliminar', id);
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result) {
        console.log(result);
        console.log('Se acepto');
        this.eventServices.deleteEvent(id).subscribe((res) => {
          if (res && res.success) {
            this.events = this.events.filter((value) => {
              return value.id !== id;
            });
            // Popup exitoso
            this.openSnackBar(res.message, 'Close');
          }
        });
      }
    });
  }

  addEvent() {
    let event: EventDto = {
      instructorId: this.instructor.id,
      startDate: this.form.controls['start'].value,
      endDate: this.form.controls['end'].value,
      description: this.form.controls['description'].value,
      eventType: this.form.controls['eventType'].value,
    };
    console.log(event);
    this.eventServices.addEvent(event).subscribe(
      (res) => {
        if (res && res.success) {
          this.refresh();
        }
      },
      (err) => {
        console.log(err);
        this.openSnackBar(err.error.message, 'Close');
      }
    );
  }

  updateEvent() {
    let event: EventDto = {
      id: this.form.controls['id'].value,
      instructorId: this.instructor.id,
      startDate: this.form.controls['start'].value,
      endDate: this.form.controls['end'].value,
      description: this.form.controls['description'].value,
      eventType: this.form.controls['eventType'].value,
    };
    this.eventServices.updateEvent(event).subscribe(
      (res) => {
        if (res && res.success) {
          this.refresh();
        }
      },
      (err) => {
        console.log(err);
        this.openSnackBar(err.error.message, 'Close');
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }

  addToggle() {
    this.add = !this.add;
  }

  updateToggle(event: EventDto) {
    this.update = !this.update;
    if (this.update) {
      this.form.controls['id'].setValue(event.id);
      this.form.controls['start'].setValue(event.startDate);
      this.form.controls['end'].setValue(event.endDate);
      this.form.controls['description'].setValue(event.description);
      this.form.controls['eventType'].setValue(event.eventType);
    } else {
      this.clearForm();
    }
  }

  clearForm() {
    this.form.controls['id'].setValue('');
    this.form.controls['start'].setValue('');
    this.form.controls['end'].setValue('');
    this.form.controls['description'].setValue('');
    this.form.controls['eventType'].setValue('');
  }

  refresh(): void {
    window.location.reload();
  }
}

@Component({
  selector: 'dialog-confirm-delete',
  templateUrl: 'dialog-confirm-delete.component.html',
})
export class DialogDelete {
  constructor(
    public dialogRef: MatDialogRef<DialogDelete>,
    @Inject(MAT_DIALOG_DATA) public data: boolean
  ) {}

  onNoClick(): void {
    console.log('Se cerro popup');
    this.dialogRef.close();
  }
}
