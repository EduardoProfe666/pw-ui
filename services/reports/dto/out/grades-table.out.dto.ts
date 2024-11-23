export interface GradeRow{
  gradeId: number;

  assessmentName: string;

  assessmentId: number;

  grade: 2 | 3 | 4 | 5 | null;
}

export default interface GradesTableOutDto{
  gradeTable: GradeRow[];

  avg: number;

  studentId: number;
}
