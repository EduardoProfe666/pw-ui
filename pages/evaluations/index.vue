  <template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <h1 class="text-h5 font-weight-bold">Evaluations Management</h1>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="evaluationsStore.openDialog('create')"
        >
          Add Evaluation
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
              v-model="subjectFilter"
              :items="['All Subjects', 'Mathematics', 'Physics', 'Chemistry', 'Biology']"
              label="Subject"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="statusFilter"
              :items="['All Status', 'pending', 'in_progress', 'completed']"
              label="Status"
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

    <!-- Evaluation Form Dialog -->
    <v-dialog
      v-model="evaluationsStore.isDialogOpen"
      max-width="700px"
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
                  v-model="formData.title"
                  label="Title"
                  required
                  :rules="[v => !!v || 'Title is required']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.subject"
                  :items="['Mathematics', 'Physics', 'Chemistry', 'Biology']"
                  label="Subject"
                  required
                  :rules="[v => !!v || 'Subject is required']"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="formData.description"
                  label="Description"
                  required
                  :rules="[v => !!v || 'Description is required']"
                  rows="3"
                ></v-textarea>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.maxScore"
                  label="Maximum Score"
                  type="number"
                  required
                  :rules="[
                    v => !!v || 'Maximum score is required',
                    v => v > 0 || 'Score must be greater than 0'
                  ]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.weight"
                  label="Weight (%)"
                  type="number"
                  required
                  :rules="[
                    v => !!v || 'Weight is required',
                    v => (v >= 0 && v <= 100) || 'Weight must be between 0 and 100'
                  ]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.dueDate"
                  label="Due Date"
                  type="datetime-local"
                  required
                  :rules="[v => !!v || 'Due date is required']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.status"
                  :items="['pending', 'in_progress', 'completed']"
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
            @click="evaluationsStore.closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="handleSubmit"
            :loading="evaluationsStore.loading"
          >
            {{ evaluationsStore.dialogMode === 'create' ? 'Create' : 'Update' }}
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
          Are you sure you want to delete this evaluation? This action cannot be undone.
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
            :loading="evaluationsStore.loading"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useEvaluationsStore, type Evaluation } from '~/stores/evaluations'

const evaluationsStore = useEvaluationsStore()
const form = ref()
const search = ref('')
const subjectFilter = ref('All Subjects')
const statusFilter = ref('All Status')
const deleteDialog = ref(false)
const evaluationToDelete = ref<Evaluation | null>(null)

const headers = [
  { title: 'Title', key: 'title', align: 'start' },
  { title: 'Subject', key: 'subject' },
  { title: 'Due Date', key: 'formattedDueDate' },
  { title: 'Status', key: 'status' },
  { title: 'Max Score', key: 'maxScore' },
  { title: 'Weight', key: 'weight' },
  { title: 'Created At', key: 'formattedCreatedAt' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

const formData = ref({
  title: '',
  subject: '',
  description: '',
  dueDate: '',
  status: 'pending',
  maxScore: 100,
  weight: 0
})

const dialogTitle = computed(() => {
  return evaluationsStore.dialogMode === 'create' ? 'Create Evaluation' : 'Edit Evaluation'
})

const filteredEvaluations = computed(() => {
  let evaluations = evaluationsStore.formattedEvaluations

  if (subjectFilter.value !== 'All Subjects') {
    evaluations = evaluations.filter(evaluation => evaluation.subject === subjectFilter.value)
  }

  if (statusFilter.value !== 'All Status') {
    evaluations = evaluations.filter(evaluation => evaluation.status === statusFilter.value)
  }

  return evaluations
})

watch(() => evaluationsStore.selectedEvaluation, (newEvaluation) => {
  if (newEvaluation) {
    formData.value = {
      ...newEvaluation,
      dueDate: new Date(newEvaluation.dueDate).toISOString().slice(0, 16)
    }
  } else {
    formData.value = {
      title: '',
      subject: '',
      description: '',
      dueDate: '',
      status: 'pending',
      maxScore: 100,
      weight: 0
    }
  }
})

const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  
  if (!valid) return

  try {
    if (evaluationsStore.dialogMode === 'create') {
      await evaluationsStore.createEvaluation(formData.value)
    } else {
      await evaluationsStore.updateEvaluation(formData.value)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

const confirmDelete = (evaluation: Evaluation) => {
  evaluationToDelete.value = evaluation
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!evaluationToDelete.value) return
  
  try {
    await evaluationsStore.deleteEvaluation(evaluationToDelete.value.id)
    deleteDialog.value = false
    evaluationToDelete.value = null
  } catch (error) {
    console.error('Error:', error)
  }
}
</script>