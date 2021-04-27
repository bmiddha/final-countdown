import { DateTime } from 'luxon';

export interface FinalModel {
  type: string;
  department: string;
  course: string;
  crn: string;
  finalStart: DateTime;
  finalEnd: DateTime;
  location: string;
  comments: string;
  instructor: string;
  sectionInfo: string;
}
