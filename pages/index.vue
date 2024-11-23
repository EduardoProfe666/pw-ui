<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Inicio</h1>

    <div v-if="!store.rankingTable" class="flex flex-col items-center justify-center h-screen">
      <v-progress-circular indeterminate color="primary" class="mb-4"></v-progress-circular>
      <p class="text-center text-lg text-gray-700">Cargando datos, por favor espera...</p>
      <p class="text-sm text-gray-500">Esto puede tardar unos segundos.</p>
    </div>

    <div v-else>
      <v-row>
        <v-col cols="12" sm="6" md="3" v-if="authStore.isAdmin">
          <v-card>
            <v-card-text>
              <div class="text-h5 mb-2">Total de Estudiantes</div>
              <div class="text-h4">{{ store.rankingTable.length }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3" v-if="authStore.isAdmin">
          <v-card>
            <v-card-text>
              <div class="text-h5 mb-2">Nota Promedio</div>
              <div class="text-h4">{{ calculateAverage() }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3" v-if="authStore.isStudent">
          <v-card>
            <v-card-text>
              <div class="text-h5 mb-2">Promedio</div>
              <div class="text-h4">{{ authStore.avg }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="mt-6">
        <v-card-title class="d-flex align-center">
          Ranking del Aula
          <v-spacer></v-spacer>
          <v-btn :loading="loadingRankingExport" @click="exportRanking()" color="primary" prepend-icon="mdi-download">
            Exportar
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-data-table
              hover
              :headers="rankingHeaders"
              :items="store.rankingTable"
              :items-per-page="10"
          ></v-data-table>
        </v-card-text>
      </v-card>

      <v-card class="mt-6">
        <v-card-title class="d-flex align-center">
          Mis Notas
          <v-spacer></v-spacer>
          <v-btn :loading="loadingGradesExport" @click="exportGrades()" color="primary" prepend-icon="mdi-download">
            Exportar
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-data-table
              hover
              :headers="gradesHeaders"
              :items="authStore.gradeTable"
              :items-per-page="10"
          ></v-data-table>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const store = useReportsStore();
const authStore = useAuthStore();

const rankingHeaders = [
  {title: 'Pos.', key: 'position'},
  {title: 'Nombre', key: 'studentName'},
  {title: 'Nota Promedio', key: 'avg'},
  {title: 'Nombre Completo', key: 'studentFullName'},
  {title: 'Nombre de Usuario', key: 'username'},
];

const gradesHeaders = [
  {title: 'Evaluación', key: 'assessmentName'},
  {title: 'Nota', key: 'grade'},
  {title: 'Observaciones del Profesor', key: 'professorNote'},
];

const loadingRankingExport = ref(false);
const loadingGradesExport = ref(false);

onMounted(async () => {
  await store.fetchRankingTable();
});

const calculateAverage = () => {
  if (!store.rankingTable || store.rankingTable.length === 0) return 0;
  const total = store.rankingTable.reduce((sum, student) => sum + student.avg, 0);
  return (total / store.rankingTable.length).toFixed(2);
}

const exportRanking = async () => {
  loadingRankingExport.value = true;
  try {
    await store.exportRankingTable();
  } finally {
    loadingRankingExport.value = false;
  }
}

const exportGrades = async () => {
  loadingGradesExport.value = true;
  try {
    await authStore.exportCurrentUserGradesTable();
  } finally {
    loadingGradesExport.value = false;
  }
}
</script>