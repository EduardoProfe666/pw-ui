import { defineStore } from 'pinia'
import type AssessmentOutDto from "~/services/assessments/dto/out/assessment.out.dto";
import type AssessmentInDto from "~/services/assessments/dto/in/assessment.in.dto";
import { getAllAssessments, createAssessment, updateAssessment, deleteAssessment } from "~/services/assessments/assessments.service";

interface AssessmentState {
  assessments: AssessmentOutDto[]
  loading: boolean
  error: string | null
  selectedAssessment: AssessmentOutDto | null
  isDialogOpen: boolean
  dialogMode: 'create' | 'edit'
}

export const useAssessmentsStore = defineStore('assessments', {
  state: (): AssessmentState => ({
    assessments: [],
    loading: false,
    error: null,
    selectedAssessment: null,
    isDialogOpen: false,
    dialogMode: 'create'
  }),

  getters: {
    formattedEvaluations: (state) => state.assessments.map(assessment => ({
      ...assessment,
      statusColor: assessment.onGoing ? 'success' : 'error',
      statusText: assessment.onGoing ? 'Activa' : 'Inactiva',
    }))
  },

  actions: {
    async fetchAssessments() {
      this.loading = true;
      try {
        this.assessments = await getAllAssessments();
      } catch (error) {
        this.error = 'Error al cargar las evaluaciones';
      } finally {
        this.loading = false;
      }
    },

    setSelectedAssessment(assessment: AssessmentOutDto | null) {
      this.selectedAssessment = assessment;
    },

    openDialog(mode: 'create' | 'edit', assessment?: AssessmentOutDto) {
      this.dialogMode = mode;
      this.selectedAssessment = assessment || null;
      this.isDialogOpen = true;
    },

    closeDialog() {
      this.isDialogOpen = false;
      this.selectedAssessment = null;
    },

    async createAssessment(data: AssessmentInDto) {
      try {
        console.log(1)
        this.loading = true;
        const newAssessment = await createAssessment(data);
        this.assessments.push(newAssessment);
        this.closeDialog();
      } catch (error) {
        this.error = 'Error al crear la evaluación';
      } finally {
        this.loading = false;
      }
    },

    async updateAssessment(data: AssessmentInDto) {
      if (!this.selectedAssessment) return;

      try {
        this.loading = true;
        await updateAssessment(this.selectedAssessment.id, data);

        const index = this.assessments.findIndex(e => e.id === this.selectedAssessment!.id);
        if (index !== -1) {
          this.assessments[index] = { ...this.assessments[index], ...data };
        }

        this.closeDialog();
      } catch (error) {
        this.error = 'Error al actualizar la evaluación';
      } finally {
        this.loading = false;
      }
    },

    async deleteAssessment(id: number) {
      try {
        this.loading = true;
        await deleteAssessment(id);

        const index = this.assessments.findIndex(e => e.id === id);
        if (index !== -1) {
          this.assessments.splice(index, 1);
        }
      } catch (error) {
        this.error = 'Error al eliminar la evaluación';
      } finally {
        this.loading = false;
      }
    }
  }
});