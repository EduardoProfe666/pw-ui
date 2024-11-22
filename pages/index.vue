<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
    
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="text-h5 mb-2">Total Students</div>
            <div class="text-h4">156</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="text-h5 mb-2">Average Grade</div>
            <div class="text-h4">8.5</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-6">
      <v-card-title class="d-flex align-center">
        Class Ranking
        <v-spacer></v-spacer>
        <v-btn color="primary" prepend-icon="mdi-download">
          Export
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="students"
          :items-per-page="5"
        ></v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const headers = [
  { title: 'Rank', key: 'rank' },
  { title: 'Student', key: 'name' },
  { title: 'Average Grade', key: 'average' },
  { title: 'Performance', key: 'performance' }
]

const students = [
  { rank: 1, name: 'John Doe', average: 9.5, performance: 'Excellent' },
  { rank: 2, name: 'Jane Smith', average: 9.2, performance: 'Excellent' },
  { rank: 3, name: 'Mike Johnson', average: 8.9, performance: 'Very Good' }
]
</script>