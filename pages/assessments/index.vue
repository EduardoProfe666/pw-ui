<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <h1 class="text-h5 font-weight-bold">Gestión de Evaluaciones</h1>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="evaluationsStore.openDialog('create')"
        >
          Agregar
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
          <v-col cols="12" sm="4">
            <v-select
              v-model="statusFilter"
              :items="['Todos', 'Activa', 'Inactiva']"
              label="Estado"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-select>
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="filteredEvaluations"
          :search="search"
          :loading="evaluationsStore.loading"
          hover
          class="mt-4"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.statusColor"
              size="small"
              class="text-uppercase"
            >
              {{ item.statusText }}
            </v-chip>
          </template>

          <template v-slot:item.weight="{ item }">
            {{ item.weight }}%
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon
              variant="text"
              color="primary"
              size="small"
              class="mr-2"
              @click="evaluationsStore.openDialog('edit', item)"
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

    <!-- Assessment Form Dialog -->
    <v-dialog
      v-model="evaluationsStore.isDialogOpen"
      max-width="700px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="pa-4">
          <span class="text-h5">{{ dialogTitle }}</span>
        </v-card-title>

        <v-card-text class="border-t">
          <v-form @submit.prevent="handleSubmit" ref="form">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.name"
                  label="Nombre"
                  required
                  :rules="[v => !!v || 'Nombre es requerido']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-radio-group
                    v-model="formData.onGoing"
                    label="Estado"
                    required
                    inline
                >
                  <v-radio
                      :value="true"
                      label="Activa"
                  ></v-radio>
                  <v-radio
                      :value="false"
                      label="Inactiva"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 border-t">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="evaluationsStore.closeDialog"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            @click="handleSubmit"
            :loading="evaluationsStore.loading"
          >
            {{ evaluationsStore.dialogMode === 'create' ? 'Crear' : 'Actualizar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5 pa-4">
          Confirmar Borrado
        </v-card-title>

        <v-card-text>
          Estás seguro que quieres borrar esta evaluación? Esta acción <strong>NO</strong> puede deshacerse.
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
            :loading="evaluationsStore.loading"
          >
            Borrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import type AssessmentInDto from "~/services/assessments/dto/in/assessment.in.dto";

definePageMeta({
  middleware: ['auth']
})

const evaluationsStore = useAssessmentsStore()
const form = ref()
const search = ref('')
const statusFilter = ref('Todos')
const deleteDialog = ref(false)
const evaluationToDelete = ref<Assessment | null>(null)

const headers = [
  { title: 'Nombre', key: 'name', align: 'start' },
  { title: 'Estado', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

const formData = ref({
  name: '',
  onGoing: true,
})

const dialogTitle = computed(() => {
  return evaluationsStore.dialogMode === 'create' ? 'Crear Evaluación' : 'Actualizar Evaluación'
})

const filteredEvaluations = computed(() => {
  let evaluations = evaluationsStore.formattedEvaluations

  if (statusFilter.value !== 'Todos') {
    evaluations = evaluations.filter(evaluation => evaluation.statusText === statusFilter.value)
  }

  return evaluations
})

watch(() => evaluationsStore.selectedAssessment, (newEvaluation) => {
  if (newEvaluation) {
    formData.value = {
      ...newEvaluation,
    }
  } else {
    formData.value = {
      name: '',
      onGoing: true
    }
  }
})

const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  
  if (!valid) return

  try {
    const data: AssessmentInDto = {
      name: formData.value.name,
      onGoing: formData.value.onGoing
    }
    if (evaluationsStore.dialogMode === 'create') {
      await evaluationsStore.createAssessment(data)
    } else {
      await evaluationsStore.updateAssessment(data)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

const confirmDelete = (evaluation: Assessment) => {
  evaluationToDelete.value = evaluation
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!evaluationToDelete.value) return
  
  try {
    await evaluationsStore.deleteAssessment(evaluationToDelete.value.id)
    deleteDialog.value = false
    evaluationToDelete.value = null
  } catch (error) {
    console.error('Error:', error)
  }
}

onMounted(async () => {
  await evaluationsStore.fetchAssessments();
});
</script>