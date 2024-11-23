export default interface GradeOutDto{
  id: number;

  professorNote: string;

  grade: 2 | 3 | 4 | 5 | null;

  studentId: number;

  assessmentId: number;
}