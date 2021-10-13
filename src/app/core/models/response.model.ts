import { InstructorDto } from './instructor.model';

export interface ResponseService{
  success: boolean
  message: string,
  result?: InstructorDto[]
}
