<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <h1 class="text-h5 font-weight-bold">Gestión de estudiantes</h1>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          class="mr-2"
          prepend-icon="mdi-microsoft-excel"
          :loading="loadingStudentsExport"
          @click="exportStudents"
        >
          Exportar a Excel
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
              variant="outlined"
              density="comfortable"
            ></v-text-field>
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

          <template v-slot:item.isRecognized="{ item }">
            {{item.isRecognized ? '✅' : '❌'}}
          </template>

          <template v-slot:item.isCarryForward="{ item }">
            {{item.isCarryForward ? '✅' : '❌'}}
          </template>

          <template v-slot:item.isRepeater="{ item }">
            {{item.isRepeater ? '✅' : '❌'}}
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
            <v-row class="border-t">
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.name"
                  label="Nombre"
                  required
                  :rules="[v => !!v || 'Nombre es requerido']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="formData.fullName"
                    label="Nombre Completo"
                    required
                    :rules="[v => !!v || 'Nombre Completo es requerido']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-radio-group
                    v-model="formData.isRepeater"
                    label="Repitente"
                    required
                    inline
                >
                  <v-radio
                      :value="true"
                      label="Sí"
                  ></v-radio>
                  <v-radio
                      :value="false"
                      label="No"
                  ></v-radio>
                </v-radio-group>
              </v-col>

              <v-col cols="12" sm="6">
                <v-radio-group
                    v-model="formData.isCarryForward"
                    label="Arrastre"
                    required
                    inline
                >
                  <v-radio
                      :value="true"
                      label="Sí"
                  ></v-radio>
                  <v-radio
                      :value="false"
                      label="No"
                  ></v-radio>
                </v-radio-group>
              </v-col>

              <v-col cols="12" sm="6">
                <v-radio-group
                    v-model="formData.isRecognized"
                    label="Convalidado"
                    required
                    inline
                >
                  <v-radio
                      :value="true"
                      label="Sí"
                  ></v-radio>
                  <v-radio
                      :value="false"
                      label="No"
                  ></v-radio>
                </v-radio-group>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="formData.listNumber"
                    label="Número de lista"
                    required
                    type="number"
                    :rules="[
                      v => !!v || 'Número de lista es requerido',
                      v => Number.isInteger(Number(v)) || 'Debe ser un número entero',
                      v => Number(v) > 0 || 'Debe ser mayor que 0'
                    ]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 border-t">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="studentsStore.closeDialog"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="handleSubmit"
            :loading="studentsStore.loading"
          >
            {{ studentsStore.dialogMode === 'create' ? 'Crear' : 'Actualizar' }}
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
          <span class="text-h5">Notas de {{ studentsStore.selectedStudent?.name }}</span>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            class="mr-2"
            prepend-icon="mdi-download"
            :loading="loadingGradesExport"
            @click="exportSelectedStudentGrades"
          >
            Exportar Notas
          </v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            :loading="loadingMissingGrades"
            @click="openAddGradeDialog"
          >
            Agregar Nota
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-data-table
            :headers="gradeHeaders"
            :items="selectedStudentGrades"
            :loading="studentsStore.loading"
          >
            <template v-slot:item.actions="{ item }">
              <v-btn
                icon
                variant="text"
                color="primary"
                size="small"
                class="mr-2"
                :loading="loadingMissingGrades"
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
            Cerrar
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
            <v-row class="border-t">
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="gradeFormData.grade"
                    label="Nota"
                    required
                    type="number"
                    :rules="[
                      v => !!v || 'Nota es requerida',
                      v => Number.isInteger(Number(v)) || 'Debe ser un número entero',
                      v => Number(v) >= 2 || 'Debe ser mayor o igual que 2',
                      v => Number(v) <= 5 || 'Debe ser menor o igual que 5',
                    ]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="gradeFormData.assessmentId"
                  :items="missingGradesList"
                  label="Evaluación"
                  required
                  :rules="[v => !!v || 'Evaluación es requerida']"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-textarea
                    v-model="gradeFormData.professorNote"
                    label="Notas del profesor"
                    required
                    :rules="[
                        v => !!v || 'Notas del profesor son requeridas',
                        v => String(v).length <= 255 || 'El máximo de caracteres es 255'
                    ]"
                    rows="4"
                ></v-textarea>
              </v-col>

            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 border-t">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="gradeDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="handleGradeSubmit"
            :loading="studentsStore.loading"
          >
            {{ selectedGrade ? 'Actualizar' : 'Agregar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5 pa-4">
          Confirmar Borrado de Estudiante
        </v-card-title>

        <v-card-text>
          Estás seguro que quieres borrar este estudiante? Esta acción <strong>NO</strong> puede deshacerse.
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            @click="handleDelete"
            :loading="studentsStore.loading"
          >
            Borrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Grade Confirmation Dialog -->
    <v-dialog v-model="deleteGradeDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5 pa-4">
          Confirmar Borrado de Nota
        </v-card-title>

        <v-card-text>
          Estás seguro que quieres borrar esta nota?
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="deleteGradeDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            @click="handleDeleteGrade"
            :loading="studentsStore.loading"
          >
            Borrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {type Grade, type Student, useStudentsStore} from '~/stores/students'
import type StudentInDto from "~/services/students/dto/in/student.in.dto";

definePageMeta({
  middleware: ['auth']
})

const studentsStore = useStudentsStore()
const form = ref()
const gradeForm = ref()
const search = ref('')
const deleteDialog = ref(false)
const deleteGradeDialog = ref(false)
const gradeDialog = ref(false)
const studentToDelete = ref<Student | null>(null)
const gradeToDelete = ref<Grade | null>(null)
const selectedGrade = ref<Grade | null>(null)

const headers = [
  { title: 'Avatar', key: 'avatar', sortable: false },
  { title: 'Nombre', key: 'name', align: 'start' },
  { title: 'Nombre de Usuario', key: 'username' },
  { title: 'Nombre Completo', key: 'fullName' },
  { title: 'No. de lista', key: 'listNumber' },
  { title: 'Convalidado', key: 'isRecognized' },
  { title: 'Arrastre', key: 'isCarryForward' },
  { title: 'Repitente', key: 'isRepeater' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' }
]

const gradeHeaders = [
  { title: 'Nota', key: 'grade', align: 'start' },
  { title: 'Evaluación', key: 'assessmentName' },
  { title: 'Notas del Profesor', key: 'professorNote' },
  { title: 'Acciones', key: 'actions', sortable: false, align: 'end' }
]

const formData = ref({
  name: '',
  fullName: '',
  isRecognized: false,
  isRepeater: false,
  isCarryForward: false,
  listNumber: 0,
})

const gradeFormData = ref({
  grade: 2,
  professorNote: '',
  assessmentId: 0,
})

const dialogTitle = computed(() => {
  return studentsStore.dialogMode === 'create' ? 'Crear Estudiante' : 'Actualizar Estudiante'
})

const gradeDialogTitle = computed(() => {
  return selectedGrade.value ? 'Actualizar Nota' : 'Agregar Nota'
})

const filteredStudents = computed(() => {
  return studentsStore.formattedStudents
})

const selectedStudentGrades = computed(() => {
  return studentsStore.selectedStudent?.grades || []
})

const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  
  if (!valid) return

  try {
    const data: StudentInDto = {
      name: formData.value.name,
      fullName: formData.value.fullName,
      isCarryForward: formData.value.isCarryForward,
      isRecognized: formData.value.isRecognized,
      isRepeater: formData.value.isRepeater,
      listNumber: parseInt(formData.value.listNumber),
    }
    if (studentsStore.dialogMode === 'create') {
      await studentsStore.createStudent(data)
    } else {
      await studentsStore.updateStudent(data)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

const handleGradeSubmit = async () => {
  const { valid } = await gradeForm.value.validate()
  
  if (!valid) return

  try {
    const data: GradeInDto = {
      grade: parseInt(gradeFormData.value.grade),
      professorNote: gradeFormData.value.professorNote,
      assessmentId: gradeFormData.value.assessmentId,
      studentId: studentsStore.selectedStudent!.id,
    }
    if (selectedGrade.value) {
      await studentsStore.updateGrade(
        selectedGrade.value.id,
        data
      )
    } else {
      await studentsStore.addGrade(
        data
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
      gradeToDelete.value.id
    )
    deleteGradeDialog.value = false
    gradeToDelete.value = null
  } catch (error) {
    console.error('Error:', error)
  }
}

let missingGradesList = []

const openAddGradeDialog = () => {
  selectedGrade.value = null
  resetGradeForm()
  gradeDialog.value = true
}

const openEditGradeDialog = (grade: Grade) => {
  selectedGrade.value = grade
  gradeFormData.value = {
    grade: grade.grade,
    professorNote: grade.professorNote,
    assessmentId: grade.assessmentId,
    studentId: studentsStore.selectedStudent!.id,
  }
  gradeDialog.value = true
}

const resetGradeForm = () => {
  gradeFormData.value = {
    grade: 2,
    professorNote: '',
    assessmentId: undefined,
    studentId: studentsStore.selectedStudent!.id,
  }
}

const loadingStudentsExport = ref(false);
const loadingGradesExport = ref(false);
const loadingMissingGrades = ref(false);


const missingGrades = async () => {
  loadingMissingGrades.value = true;
  let m = []
  try{
    m = await studentsStore.getMissingGrades();
  }finally {
    loadingMissingGrades.value = false;
  }
  return m;
}

watch(() => studentsStore.selectedStudent, (newStudent) => {
  if (newStudent && studentsStore.dialogMode === 'edit') {
    formData.value = { ...newStudent }
  } else {
    formData.value = {
      name: '',
      fullName: '',
      isRecognized: false,
      isRepeater: false,
      isCarryForward: false,
      listNumber: 0,
    }
  }

  if(newStudent){
    missingGrades().then((res) => {
      missingGradesList = res;
    });
  }
})

const exportStudents = async () => {
  loadingStudentsExport.value = true;
  try{
    await studentsStore.exportStudentsToPdf();
  }finally{
    loadingStudentsExport.value = false;
  }
}

const exportSelectedStudentGrades = async () => {
  if (studentsStore.selectedStudent) {
    loadingGradesExport.value = true;
    try {
      await studentsStore.exportGradesToExcel()
    } finally {
      loadingGradesExport.value = false;
    }
  }
}

onMounted(async () => {
  await studentsStore.fetchStudents();
});
</script>