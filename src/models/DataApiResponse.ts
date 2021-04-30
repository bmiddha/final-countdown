import { AcademicYearResponse, FinalModel } from '.';

export type DataApiResponse = {
  allFinals: FinalModel[];
  academicYear: AcademicYearResponse;
};
