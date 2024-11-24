import {defineStore} from 'pinia'
import {format} from 'date-fns'
import * as XLSX from 'xlsx'
import {createUser, deleteUser, getAllUsers, updateUser} from "~/services/users/users.service";
import {deleteStudent, getAllStudents, updateStudent} from "~/services/students/students.service";
import {
    createGrade,
    deleteGrade,
    getAllGrades,
    getMissingGradesById,
    updateGrade
} from "~/services/grades/grades.service";
import {getAllAssessments} from "~/services/assessments/assessments.service";
import type UserInDto from "~/services/users/dto/in/user.in.dto";
import type StudentInDto from "~/services/students/dto/in/student.in.dto";
import type GradeInDto from "~/services/grades/dto/in/grade.in.dto";
import {useToast} from "vue-toastification";
import {exportGradesTableById, exportStudentList} from "~/services/reports/reports.service";

export interface Grade {
    id: number
    professorNote: string
    grade: number
    assessmentId: number
    assessmentName: string
}

export interface Student {
    id: number
    name: string
    username: string
    avatar?: string
    fullName: string
    isRecognized: boolean
    listNumber: number
    isCarryForward: boolean
    isRepeater: boolean
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
        students: [],
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
        }))
    },

    actions: {
        async fetchStudents() {
            this.loading = true;
            try {
                const studentss = await getAllStudents();
                const gradess = await getAllGrades();
                const a = await getAllAssessments();
                this.students = studentss.map(x => ({
                    id: x.id,
                    username: x.username,
                    isRecognized: x.isRecognized,
                    listNumber: x.listNumber,
                    isRepeater: x.isRepeater,
                    isCarryForward: x.isCarryForward,
                    name: x.name,
                    fullName: x.fullName,
                    avatar: x.avatar,
                    grades: gradess.filter(y => y.studentId === x.id).map(x => ({
                        id: x.id,
                        assessmentId: x.assessmentId,
                        grade: x.grade || 0,
                        professorNote: x.professorNote,
                        assessmentName: a.find(y => y.id === x.assessmentId)?.name || "Evaluación",
                    }))
                }));
            } catch (error) {
                this.error = 'Error al cargar los estudiantes';
            } finally {
                this.loading = false;
            }
        },

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

        async getMissingGrades() {
            this.loading = true;
            try {
                const data = await getMissingGradesById(this.selectedStudent!.id);
                const assessments = await getAllAssessments();
                const returnData = assessments.filter(x => data.includes(x.name))
                    .map(x => ({
                        title: x.name,
                        value: x.id
                    }));
                this.loading = false;
                return returnData;
            } catch (error) {
                this.error = 'Error al cargar las notas faltantes';
            } finally {
                this.loading = false;
            }
        },

        async updateStudent(data: StudentInDto) {
            if (!this.selectedStudent) return;

            try {
                this.loading = true;
                await updateStudent(this.selectedStudent.id, data);

                await this.fetchStudents();

                this.closeDialog();
            } catch (error) {
                this.error = 'Error al actualizar el estudiante';
            } finally {
                this.loading = false;
            }
        },

        async deleteStudent(id: number) {
            try {
                this.loading = true;
                await deleteStudent(id);

                const index = this.students.findIndex(e => e.id === id);
                if (index !== -1) {
                    this.students.splice(index, 1);
                }
            } catch (error) {
                this.error = 'Error al eliminar el estudiante';
            } finally {
                this.loading = false;
            }
        },

        async addGrade(data: GradeInDto) {
            try {
                this.loading = true;
                await createGrade(data);
                await this.fetchStudents();
                this.closeDialog();
            } catch (error) {
                this.error = 'Error al agregar la nota';
            } finally {
                this.loading = false;
            }
        },

        async updateGrade(gradeId: number, data: GradeInDto) {
            if (!this.selectedStudent) return;

            try {
                this.loading = true;
                await updateGrade(gradeId, data);

                await this.fetchStudents();

                this.closeDialog();
            } catch (error) {
                this.error = 'Error al actualizar la nota';
            } finally {
                this.loading = false;
            }
        },

        async deleteGrade(id: number) {
            try {
                this.loading = true;
                await deleteGrade(id);

                await this.fetchStudents();
            } catch (error) {
                this.error = 'Error al eliminar la nota';
            } finally {
                this.loading = false;
            }
        },

        async exportStudentsToPdf() {
            const toast = useToast();
            try {
                await exportStudentList();
            } catch (error) {
                toast.error('Error al exportar la lista de estudiantes.');
            }
        },

        async exportGradesToExcel() {
            const toast = useToast();
            try {
                await exportGradesTableById(this.selectedStudent!.id);
            } catch (error) {
                toast.error('Error al exportar la tabla de calificaciones.');
            }
        }
    }
})