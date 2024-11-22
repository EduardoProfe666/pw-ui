<template>
  <div>
    <v-card class="mb-4">
      <v-card-title class="d-flex align-center pa-4">
        <div class="d-flex align-center">
          <v-avatar size="64" class="mr-4">
            <v-img :src="student?.avatar" :alt="student?.name"></v-img>
          </v-avatar>
          <div>
            <h1 class="text-h4">{{ student?.name }}</h1>
            <div class="text-subtitle-1 text-medium-emphasis">
              {{ student?.grade }} • Student ID: {{ student?.studentId }}
            </div>
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          class="mr-2"
          prepend-icon="mdi-microsoft-excel"
          @click="exportGrades"
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
    </v-card>

    <GradeStats :grades="student?.grades || []" />

    <GradeChart :grades="student?.grades || []" class="mt-4" />

    <v-card>
      <v-card-title class="pa-4">
        Grade History
      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="student?.grades || []"
          :loading="loading"
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
    </v-card>

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
            :loading="loading"
          >
            {{ selectedGrade ? 'Update' : 'Add' }}
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
            :loading="loading"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useStudentsStore, type Grade } from '~/stores/students'

const route = useRoute()
const studentsStore = useStudentsStore()
const gradeForm = ref()
const loading = ref(false)
const gradeDialog = ref(false)
const deleteGradeDialog = ref(false)
const selectedGrade = ref<Grade | null>(null)
const gradeToDelete = ref<Grade | null>(null)

const headers = [
  { title: 'Subject', key: 'subject', align: 'start' },
  { title: 'Evaluation', key: 'evaluationTitle' },
  { title: 'Score', key: 'score' },
  { title: 'Status', key: 'status' },
  { title: 'Date', key: 'createdAt' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

const gradeFormData = ref({
  evaluationTitle: '',
  subject: '',
  score: 0,
  maxScore: 100
})

const student = computed(() => {
  return studentsStore.students.find(s => s.id === parseInt(route.params.id as string))
})

const gradeDialogTitle = computed(() => {
  return selectedGrade.value ? 'Edit Grade' : 'Add Grade'
})

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

const handleGradeSubmit = async () => {
  const { valid } = await gradeForm.value.validate()
  
  if (!valid || !student.value) return

  try {
    loading.value = true
    if (selectedGrade.value) {
      await studentsStore.updateGrade(
        student.value.id,
        selectedGrade.value.id,
        gradeFormData.value
      )
    } else {
      await studentsStore.addGrade(
        student.value.id,
        gradeFormData.value
      )
    }
    gradeDialog.value = false
    resetGradeForm()
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

const confirmDeleteGrade = (grade: Grade) => {
  gradeToDelete.value = grade
  deleteGradeDialog.value = true
}

const handleDeleteGrade = async () => {
  if (!gradeToDelete.value || !student.value) return
  
  try {
    loading.value = true
    await studentsStore.deleteGrade(
      student.value.id,
      gradeToDelete.value.id
    )
    deleteGradeDialog.value = false
    gradeToDelete.value = null
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

const exportGrades = () => {
  if (student.value) {
    studentsStore.exportGradesToExcel(student.value.id)
  }
}
</script>