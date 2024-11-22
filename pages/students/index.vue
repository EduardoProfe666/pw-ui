<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <h1 class="text-h5 font-weight-bold">Students Management</h1>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          class="mr-2"
          prepend-icon="mdi-microsoft-excel"
          @click="studentsStore.exportStudentsToExcel"
        >
          Export to Excel
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="studentsStore.openDialog('create')"
        >
          Add Student
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              variant="outlined"
              density="comfortable"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="gradeFilter"
              :items="['All Grades', '9th Grade', '10th Grade', '11th Grade', '12th Grade']"
              label="Grade"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="statusFilter"
              :items="['All Status', 'active', 'inactive']"
              label="Status"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-select>
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="filteredStudents"
          :search="search"
          :loading="studentsStore.loading"
          hover
          class="mt-4"
        >
          <template v-slot:item.avatar="{ item }">
            <v-avatar size="40">
              <v-img :src="item.avatar" :alt="item.name"></v-img>
            </v-avatar>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.statusColor"
              size="small"
              class="text-uppercase"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <template v-slot:item.averageGrade="{ item }">
            <v-chip
              :color="getGradeColor(item.averageGrade)"
              size="small"
            >
              {{ item.averageGrade }}%
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon
              variant="text"
              color="info"
              size="small"
              class="mr-2"
              @click="studentsStore.openGradesDialog(item)"
            >
              <v-icon>mdi-book-education</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="primary"
              size="small"
              class="mr-2"
              @click="studentsStore.openDialog('edit', item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="error"
              size="small"
              @click="confirmDelete(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Student Form Dialog -->
    <v-dialog
      v-model="studentsStore.isDialogOpen"
      max-width="600px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="pa-4">
          <span class="text-h5">{{ dialogTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="handleSubmit" ref="form">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.name"
                  label="Name"
                  required
                  :rules="[v => !!v || 'Name is required']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  type="email"
                  required
                  :rules="[
                    v => !!v || 'Email is required',
                    v => /.+@.+\..+/.test(v) || 'Email must be valid'
                  ]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.studentId"
                  label="Student ID"
                  required
                  :rules="[v => !!v || 'Student ID is required']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.grade"
                  :items="['9th Grade', '10th Grade', '11th Grade', '12th Grade']"
                  label="Grade"
                  required
                  :rules="[v => !!v || 'Grade is required']"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.status"
                  :items="['active', 'inactive']"
                  label="Status"
                  required
                  :rules="[v => !!v || 'Status is required']"
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="studentsStore.closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="handleSubmit"
            :loading="studentsStore.loading"
          >
            {{ studentsStore.dialogMode === 'create' ? 'Create' : 'Update' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Grades Dialog -->
    <v-dialog
      v-model="studentsStore.isGradesDialogOpen"
      max-width="900px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="d-flex align-center pa-4">
          <span class="text-h5">{{ studentsStore.selectedStudent?.name }}'s Grades</span>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            class="mr-2"
            prepend-icon="mdi-microsoft-excel"
            @click="exportSelectedStudentGrades"
          >
            Export Grades
          </v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="openAddGradeDialog"
          >
            Add Grade
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-data-table
            :headers="gradeHeaders"
            :items="selectedStudentGrades"
            :loading="studentsStore.loading"
          >
            <template v-slot:item.score="{ item }">
              {{ item.score }} / {{ item.maxScore }}
              ({{ ((item.score / item.maxScore) * 100).toFixed(2) }}%)
            </template>

            <template v-slot:item.status="{ item }">
              <v-chip
                :color="item.status === 'graded' ? 'success' : 'warning'"
                size="small"
                class="text-uppercase"
              >
                {{ item.status }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                icon
                variant="text"
                color="primary"
                size="small"
                class="mr-2"
                @click="openEditGradeDialog(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                variant="text"
                color="error"
                size="small"
                @click="confirmDeleteGrade(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="studentsStore.closeGradesDialog"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Grade Form Dialog -->
    <v-dialog v-model="gradeDialog" max-width="500px">
      <v-card>
        <v-card-title class="pa-4">
          <span class="text-h5">{{ gradeDialogTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="handleGradeSubmit" ref="gradeForm">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="gradeFormData.evaluationTitle"
                  label="Evaluation Title"
                  required
                  :rules="[v => !!v || 'Evaluation title is required']"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="gradeFormData.subject"
                  :items="['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature']"
                  label="Subject"
                  required
                  :rules="[v => !!v || 'Subject is required']"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="gradeFormData.score"
                  label="Score"
                  type="number"
                  required
                  :rules="[
                    v => !!v || 'Score is required',
                    v => v >= 0 || 'Score must be positive',
                    v => v <= gradeFormData.maxScore || 'Score cannot exceed maximum'
                  ]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="gradeFormData.maxScore"
                  label="Maximum Score"
                  type="number"
                  required
                  :rules="[
                    v => !!v || 'Maximum score is required',
                    v => v > 0 || 'Maximum score must be positive'
                  ]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="gradeDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="handleGradeSubmit"
            :loading="studentsStore.loading"
          >
            {{ selectedGrade ? 'Update' : 'Add' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5 pa-4">
          Confirm Delete
        </v-card-title>

        <v-card-text>
          Are you sure you want to delete this student? This action cannot be undone.
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            @click="handleDelete"
            :loading="studentsStore.loading"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Grade Confirmation Dialog -->
    <v-dialog v-model="deleteGradeDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5 pa-4">
          Confirm Delete Grade
        </v-card-title>

        <v-card-text>
          Are you sure you want to delete this grade? This action cannot be undone.
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="deleteGradeDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            @click="handleDeleteGrade"
            :loading="studentsStore.loading"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useStudentsStore, type Student, type Grade } from '~/stores/students'

const studentsStore = useStudentsStore()
const form = ref()
const gradeForm = ref()
const search = ref('')
const gradeFilter = ref('All Grades')
const statusFilter = ref('All Status')
const deleteDialog = ref(false)
const deleteGradeDialog = ref(false)
const gradeDialog = ref(false)
const studentToDelete = ref<Student | null>(null)
const gradeToDelete = ref<Grade | null>(null)
const selectedGrade = ref<Grade | null>(null)

const headers = [
  { title: 'Avatar', key: 'avatar', sortable: false },
  { title: 'Student ID', key: 'studentId', align: 'start' },
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Grade', key: 'grade' },
  { title: 'Average Grade', key: 'averageGrade' },
  { title: 'Status', key: 'status' },
  { title: 'Created At', key: 'formattedDate' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

const gradeHeaders = [
  { title: 'Subject', key: 'subject', align: 'start' },
  { title: 'Evaluation', key: 'evaluationTitle' },
  { title: 'Score', key: 'score' },
  { title: 'Status', key: 'status' },
  { title: 'Date', key: 'createdAt' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

const formData = ref({
  name: '',
  email: '',
  studentId: '',
  grade: '',
  status: 'active'
})

const gradeFormData = ref({
  evaluationTitle: '',
  subject: '',
  score: 0,
  maxScore: 100
})

const dialogTitle = computed(() => {
  return studentsStore.dialogMode === 'create' ? 'Create Student' : 'Edit Student'
})

const gradeDialogTitle = computed(() => {
  return selectedGrade.value ? 'Edit Grade' : 'Add Grade'
})

const filteredStudents = computed(() => {
  let students = studentsStore.formattedStudents

  if (gradeFilter.value !== 'All Grades') {
    students = students.filter(student => student.grade === gradeFilter.value)
  }

  if (statusFilter.value !== 'All Status') {
    students = students.filter(student => student.status === statusFilter.value)
  }

  return students
})

const selectedStudentGrades = computed(() => {
  return studentsStore.selectedStudent?.grades || []
})

watch(() => studentsStore.selectedStudent, (newStudent) => {
  if (newStudent && studentsStore.dialogMode === 'edit') {
    formData.value = { ...newStudent }
  } else {
    formData.value = {
      name: '',
      email: '',
      studentId: '',
      grade: '',
      status: 'active'
    }
  }
})

const getGradeColor = (grade: string | number) => {
  if (grade === 'N/A') return 'grey'
  const numGrade = typeof grade === 'string' ? parseFloat(grade) : grade
  if (numGrade >= 90) return 'success'
  if (numGrade >= 80) return 'info'
  if (numGrade >= 70) return 'warning'
  return 'error'
}

const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  
  if (!valid) return

  try {
    if (studentsStore.dialogMode === 'create') {
      await studentsStore.createStudent(formData.value)
    } else {
      await studentsStore.updateStudent(formData.value)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

const handleGradeSubmit = async () => {
  const { valid } = await gradeForm.value.validate()
  
  if (!valid) return

  try {
    if (selectedGrade.value) {
      await studentsStore.updateGrade(
        studentsStore.selectedStudent!.id,
        selectedGrade.value.id,
        gradeFormData.value
      )
    } else {
      await studentsStore.addGrade(
        studentsStore.selectedStudent!.id,
        gradeFormData.value
      )
    }
    gradeDialog.value = false
    resetGradeForm()
  } catch (error) {
    console.error('Error:', error)
  }
}

const confirmDelete = (student: Student) => {
  studentToDelete.value = student
  deleteDialog.value = true
}

const confirmDeleteGrade = (grade: Grade) => {
  gradeToDelete.value = grade
  deleteGradeDialog.value = true
}

const handleDelete = async () => {
  if (!studentToDelete.value) return
  
  try {
    await studentsStore.deleteStudent(studentToDelete.value.id)
    deleteDialog.value = false
    studentToDelete.value = null
  } catch (error) {
    console.error('Error:', error)
  }
}

const handleDeleteGrade = async () => {
  if (!gradeToDelete.value || !studentsStore.selectedStudent) return
  
  try {
    await studentsStore.deleteGrade(
      studentsStore.selectedStudent.id,
      gradeToDelete.value.id
    )
    deleteGradeDialog.value = false
    gradeToDelete.value = null
  } catch (error) {
    console.error('Error:', error)
  }
}

const openAddGradeDialog = () => {
  selectedGrade.value = null
  resetGradeForm()
  gradeDialog.value = true
}

const openEditGradeDialog = (grade: Grade) => {
  selectedGrade.value = grade
  gradeFormData.value = {
    evaluationTitle: grade.evaluationTitle,
    subject: grade.subject,
    score: grade.score,
    maxScore: grade.maxScore
  }
  gradeDialog.value = true
}

const resetGradeForm = () => {
  gradeFormData.value = {
    evaluationTitle: '',
    subject: '',
    score: 0,
    maxScore: 100
  }
}

const exportSelectedStudentGrades = () => {
  if (studentsStore.selectedStudent) {
    studentsStore.exportGradesToExcel(studentsStore.selectedStudent.id)
  }
}
</script>