import { EventDto } from './event.model';

export interface InstructorDto {
  id: number;
  firstName: string;
  lastName: string;
  birthday: Date;
  events?: EventDto[];
  overallDays: number;
}
