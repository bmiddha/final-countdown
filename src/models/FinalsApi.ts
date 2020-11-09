export interface FinalResponse {
  type: string;
  course: string;
  day: string;
  time: string;
  building: string;
  rooms: string;
  comments: string;
}

export interface FinalsResponse {
  rows: number;
  output: FinalResponse[];
}
