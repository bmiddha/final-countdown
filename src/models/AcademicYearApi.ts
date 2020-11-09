export interface AcademicYearApi {
  code: string;
  description: string;
}

export interface TermData {
  term_code: string;
  semester: string;
  term_description: string;
  name: string;
  year: string;
  academic_year: AcademicYearApi;
}

export interface GradeProcessing {
  due: TermsTimestamp | null;
  comment: TermsTimestamp | null;
  student_available: TermsTimestamp | null;
  view_direct: TermsTimestamp | null;
}

export interface TermsDatestamp {
  iso_8601: string;
  human_readable: string;
  week_starting: string;
  day: number;
  month: number;
  year: number;
  dst: boolean;
  utc_offset: number;
}

export interface CampusCertificates {
  application_submission: TermPeriod;
  program_review: TermPeriod;
  college_review: TermPeriod;
  registrar_review: TermPeriod;
  system_audit: TermPeriod;
}

export interface Week extends TermPeriod {
  week_number: number;
}

export interface TermsTimestamp {
  datestamp: TermsDatestamp;
  timestamp: number;
  timestamp_eod: number;
}

export interface TermPeriod {
  start: TermsTimestamp;
  stop: TermsTimestamp;
}

export interface SummerSession<T> {
  session_1: T;
  session_2: T;
}

export interface Grades {
  mid_term_processing: GradeProcessing;
  full_term_processing: GradeProcessing;
}

export interface SummerGrades {
  mid_term_processing: SummerSession<GradeProcessing>;
  full_term_processing: SummerSession<GradeProcessing>;
}

export interface Term {
  term_data: TermData;
  instruction: TermPeriod;
  finals: TermPeriod;
  grades: Grades;
  term_withdrawal: TermPeriod;
  registration_revision: TermPeriod;
  credit_no_credit: TermPeriod;
  campus_certificates: CampusCertificates;
  weeks: Week[];
}

export interface SummerTerm {
  term_data: TermData;
  instruction: SummerSession<TermPeriod>;
  finals: SummerSession<TermPeriod>;
  grades: SummerGrades;
  term_withdrawal: TermPeriod;
  registration_revision: TermPeriod;
  credit_no_credit: SummerSession<TermPeriod>;
  campus_certificates: CampusCertificates;
  weeks: Week[];
}

export interface Terms {
  fall: Term;
  spring: Term;
  summer: SummerTerm;
}

export interface Response {
  terms: Terms;
  revised: TermsTimestamp;
}
