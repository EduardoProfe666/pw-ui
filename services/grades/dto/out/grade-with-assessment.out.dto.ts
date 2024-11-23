import type AssessmentOutDto from "~/services/assessments/dto/out/assessment.out.dto";

export default interface GradeWithAssessmentOutDto {
  id: number;

  professorNote: string;

  grade: 2 | 3 | 4 | 5 | null;

  studentId: number;

  assessment: AssessmentOutDto;
}