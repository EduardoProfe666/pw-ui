export default interface GradeInDto{
  grade: 2 | 3 | 4 | 5 | null;

  professorNote: string;

  assessmentId: number;

  studentId: number;
}