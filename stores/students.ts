import { defineStore } from 'pinia'
import { format } from 'date-fns'
import * as XLSX from 'xlsx'

export interface Grade {
  id: number
  studentId: number
  evaluationId: number
  score: number
  evaluationTitle: string
  subject: string
  maxScore: number
  status: 'pending' | 'graded'
  createdAt: string
  updatedAt: string
}

export interface Student {
  id: number
  name: string
  email: string
  studentId: string
  grade: string
  status: 'active' | 'inactive'
  avatar?: string
  createdAt: string
  grades: Grade[]
}

interface StudentsState {
  students: Student[]
  loading: boolean
  error: string | null
  selectedStudent: Student | null
  isDialogOpen: boolean
  isGradesDialogOpen: boolean
  dialogMode: 'create' | 'edit'
}

export const useStudentsStore = defineStore('students', {
  state: (): StudentsState => ({
    students: [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@school.com',
        studentId: 'STU001',
        grade: '10th Grade',
        status: 'active',
        avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
        createdAt: '2024-03-15T10:00:00Z',
        grades: [
          {
            id: 1,
            studentId: 1,
            evaluationId: 1,
            score: 85,
            evaluationTitle: 'Final Math Exam',
            subject: 'Mathematics',
            maxScore: 100,
            status: 'graded',
            createdAt: '2024-03-15T10:00:00Z',
            updatedAt: '2024-03-15T10:00:00Z'
          }
        ]
      }
    ],
    loading: false,
    error: null,
    selectedStudent: null,
    isDialogOpen: false,
    isGradesDialogOpen: false,
    dialogMode: 'create'
  }),

  getters: {
    formattedStudents: (state) => state.students.map(student => ({
      ...student,
      formattedDate: format(new Date(student.createdAt), 'PPP'),
      statusColor: student.status === 'active' ? 'success' : 'error',
      averageGrade: student.grades.length 
        ? (student.grades.reduce((acc, grade) => acc + (grade.score / grade.maxScore * 100), 0) / student.grades.length).toFixed(2)
        : 'N/A'
    }))
  },

  actions: {
    setSelectedStudent(student: Student | null) {
      this.selectedStudent = student
    },

    openDialog(mode: 'create' | 'edit', student?: Student) {
      this.dialogMode = mode
      this.selectedStudent = student || null
      this.isDialogOpen = true
    },

    openGradesDialog(student: Student) {
      this.selectedStudent = student
      this.isGradesDialogOpen = true
    },

    closeDialog() {
      this.isDialogOpen = false
      this.selectedStudent = null
    },

    closeGradesDialog() {
      this.isGradesDialogOpen = false
      this.selectedStudent = null
    },

    async createStudent(studentData: Partial<Student>) {
      try {
        this.loading = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newStudent: Student = {
          id: this.students.length + 1,
          name: studentData.name!,
          email: studentData.email!,
          studentId: studentData.studentId!,
          grade: studentData.grade!,
          status: 'active',
          createdAt: new Date().toISOString(),
          grades: [],
          avatar: `https://cdn.vuetifyjs.com/images/avatar/${Math.floor(Math.random() * 6) + 1}.jpg`
        }
        
        this.students.push(newStudent)
        this.closeDialog()
      } catch (error) {
        this.error = 'Failed to create student'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateStudent(studentData: Partial<Student>) {
      try {
        this.loading = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const index = this.students.findIndex(s => s.id === this.selectedStudent?.id)
        if (index !== -1) {
          this.students[index] = {
            ...this.students[index],
            ...studentData
          }
        }
        
        this.closeDialog()
      } catch (error) {
        this.error = 'Failed to update student'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteStudent(id: number) {
      try {
        this.loading = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const index = this.students.findIndex(s => s.id === id)
        if (index !== -1) {
          this.students.splice(index, 1)
        }
      } catch (error) {
        this.error = 'Failed to delete student'
        throw error
      } finally {
        this.loading = false
      }
    },

    async addGrade(studentId: number, gradeData: Partial<Grade>) {
      try {
        this.loading = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const student = this.students.find(s => s.id === studentId)
        if (student) {
          const newGrade: Grade = {
            id: student.grades.length + 1,
            studentId,
            evaluationId: gradeData.evaluationId!,
            score: gradeData.score!,
            evaluationTitle: gradeData.evaluationTitle!,
            subject: gradeData.subject!,
            maxScore: gradeData.maxScore!,
            status: 'graded',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          student.grades.push(newGrade)
        }
      } catch (error) {
        this.error = 'Failed to add grade'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateGrade(studentId: number, gradeId: number, gradeData: Partial<Grade>) {
      try {
        this.loading = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const student = this.students.find(s => s.id === studentId)
        if (student) {
          const gradeIndex = student.grades.findIndex(g => g.id === gradeId)
          if (gradeIndex !== -1) {
            student.grades[gradeIndex] = {
              ...student.grades[gradeIndex],
              ...gradeData,
              updatedAt: new Date().toISOString()
            }
          }
        }
      } catch (error) {
        this.error = 'Failed to update grade'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteGrade(studentId: number, gradeId: number) {
      try {
        this.loading = true
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const student = this.students.find(s => s.id === studentId)
        if (student) {
          const gradeIndex = student.grades.findIndex(g => g.id === gradeId)
          if (gradeIndex !== -1) {
            student.grades.splice(gradeIndex, 1)
          }
        }
      } catch (error) {
        this.error = 'Failed to delete grade'
        throw error
      } finally {
        this.loading = false
      }
    },

    exportStudentsToExcel() {
      const data = this.students.map(student => ({
        'Student ID': student.studentId,
        'Name': student.name,
        'Email': student.email,
        'Grade': student.grade,
        'Status': student.status,
        'Average Grade': this.formattedStudents.find(s => s.id === student.id)?.averageGrade,
        'Created At': format(new Date(student.createdAt), 'PPP')
      }))

      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Students')
      XLSX.writeFile(wb, 'students.xlsx')
    },

    exportGradesToExcel(studentId: number) {
      const student = this.students.find(s => s.id === studentId)
      if (!student) return

      const data = student.grades.map(grade => ({
        'Subject': grade.subject,
        'Evaluation': grade.evaluationTitle,
        'Score': grade.score,
        'Max Score': grade.maxScore,
        'Percentage': `${((grade.score / grade.maxScore) * 100).toFixed(2)}%`,
        'Status': grade.status,
        'Date': format(new Date(grade.createdAt), 'PPP')
      }))

      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, `${student.name}'s Grades`)
      XLSX.writeFile(wb, `${student.name.toLowerCase().replace(/\s+/g, '_')}_grades.xlsx`)
    }
  }
})