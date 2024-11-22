import { defineStore } from 'pinia'
import { format } from 'date-fns'

export interface Evaluation {
  id: number
  title: string
  subject: string
  description: string
  dueDate: string
  status: 'pending' | 'in_progress' | 'completed'
  maxScore: number
  weight: number
  createdAt: string
}

interface EvaluationsState {
  evaluations: Evaluation[]
  loading: boolean
  error: string | null
  selectedEvaluation: Evaluation | null
  isDialogOpen: boolean
  dialogMode: 'create' | 'edit'
}

export const useEvaluationsStore = defineStore('evaluations', {
  state: (): EvaluationsState => ({
    evaluations: [
      {
        id: 1,
        title: 'Final Math Exam',
        subject: 'Mathematics',
        description: 'Comprehensive exam covering algebra and calculus',
        dueDate: '2024-04-15T14:00:00Z',
        status: 'pending',
        maxScore: 100,
        weight: 40,
        createdAt: '2024-03-15T10:00:00Z'
      },
      {
        id: 2,
        title: 'Physics Project',
        subject: 'Physics',
        description: 'Group project on renewable energy',
        dueDate: '2024-04-20T23:59:59Z',
        status: 'in_progress',
        maxScore: 100,
        weight: 30,
        createdAt: '2024-03-14T15:30:00Z'
      }
    ],
    loading: false,
    error: null,
    selectedEvaluation: null,
    isDialogOpen: false,
    dialogMode: 'create'
  }),

  getters: {
    formattedEvaluations: (state) => state.evaluations.map(evaluation => ({
      ...evaluation,
      formattedDueDate: format(new Date(evaluation.dueDate), 'PPP'),
      formattedCreatedAt: format(new Date(evaluation.createdAt), 'PPP'),
      statusColor: {
        pending: 'warning',
        in_progress: 'info',
        completed: 'success'
      }[evaluation.status],
      statusText: {
        pending: 'Pending',
        in_progress: 'In Progress',
        completed: 'Completed'
      }[evaluation.status]
    }))
  },

  actions: {
    setSelectedEvaluation(evaluation: Evaluation | null) {
      this.selectedEvaluation = evaluation
    },

    openDialog(mode: 'create' | 'edit', evaluation?: Evaluation) {
      this.dialogMode = mode
      this.selectedEvaluation = evaluation || null
      this.isDialogOpen = true
    },

    closeDialog() {
      this.isDialogOpen = false
      this.selectedEvaluation = null
    },

    async createEvaluation(data: Partial<Evaluation>) {
      try {
        this.loading = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newEvaluation: Evaluation = {
          id: this.evaluations.length + 1,
          title: data.title!,
          subject: data.subject!,
          description: data.description!,
          dueDate: data.dueDate!,
          status: 'pending',
          maxScore: data.maxScore!,
          weight: data.weight!,
          createdAt: new Date().toISOString()
        }
        
        this.evaluations.push(newEvaluation)
        this.closeDialog()
      } catch (error) {
        this.error = 'Failed to create evaluation'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateEvaluation(data: Partial<Evaluation>) {
      try {
        this.loading = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const index = this.evaluations.findIndex(e => e.id === this.selectedEvaluation?.id)
        if (index !== -1) {
          this.evaluations[index] = {
            ...this.evaluations[index],
            ...data
          }
        }
        
        this.closeDialog()
      } catch (error) {
        this.error = 'Failed to update evaluation'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteEvaluation(id: number) {
      try {
        this.loading = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const index = this.evaluations.findIndex(e => e.id === id)
        if (index !== -1) {
          this.evaluations.splice(index, 1)
        }
      } catch (error) {
        this.error = 'Failed to delete evaluation'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})