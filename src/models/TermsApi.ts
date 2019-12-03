interface AcedemicYear {
    code: string;
    description: string;
};

interface TermData {
    term_code: string;
    semester: string;
    term_description: string;
    name: string;
    year: string;
    academic_year: AcedemicYear;
};

interface GradeProcessing {
    due: TermsTimestamp | null;
    comment: TermsTimestamp | null;
    student_available: TermsTimestamp | null;
    view_direct: TermsTimestamp | null;
};

interface TermsDatestamp {
    iso_8601: string;
    human_readable: string;
    week_starting: string
    day: number;
    month: number;
    year: number;
    dst: boolean;
    utc_offset: number;
}

interface CampusCertificates {
    application_submission: TermPeriod;
    program_review: TermPeriod;
    college_review: TermPeriod;
    registrar_review: TermPeriod;
    system_audit: TermPeriod;
};

interface Week extends TermPeriod {
    week_number: number;
};

interface TermsTimestamp {
    datestamp: TermsDatestamp;
    timestamp: number;
    timestamp_eod: number;
};

interface TermPeriod {
    start: TermsTimestamp;
    stop: TermsTimestamp;
};

interface SummerSession<T> {
    session_1: T;
    session_2: T;
};

interface Grades {
    mid_term_processing: GradeProcessing;
    full_term_processing: GradeProcessing;
};

interface SummerGrades {
    mid_term_processing: SummerSession<GradeProcessing>;
    full_term_processing: SummerSession<GradeProcessing>;
};

interface Term {
    term_data: TermData;
    instruction: TermPeriod;
    finals: TermPeriod;
    grades: Grades;
    term_withdrawal: TermPeriod;
    registration_revision: TermPeriod;
    credit_no_credit: TermPeriod;
    campus_certificates: CampusCertificates;
    weeks: Week[];
};


interface SummerTerm {
    term_data: TermData;
    instruction: SummerSession<TermPeriod>;
    finals: SummerSession<TermPeriod>;
    grades: SummerGrades;
    term_withdrawal: TermPeriod;
    registration_revision: TermPeriod;
    credit_no_credit: SummerSession<TermPeriod>;
    campus_certificates: CampusCertificates;
    weeks: Week[];
};

interface Terms {
    fall: Term;
    spring: Term;
    summer: SummerTerm;
};

export interface Response {
    terms: Terms;
    revised: TermsTimestamp;
};
