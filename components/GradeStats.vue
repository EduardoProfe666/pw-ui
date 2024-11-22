<template>
  <v-row>
    <v-col cols="12" sm="6" md="3">
      <v-card>
        <v-card-text>
          <div class="text-subtitle-1 mb-2">Average Grade</div>
          <div class="d-flex align-center">
            <div class="text-h4">{{ averageGrade }}%</div>
            <v-icon :color="trendColor" class="ml-2">{{ trendIcon }}</v-icon>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card>
        <v-card-text>
          <div class="text-subtitle-1 mb-2">Highest Grade</div>
          <div class="text-h4">{{ highestGrade }}%</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card>
        <v-card-text>
          <div class="text-subtitle-1 mb-2">Lowest Grade</div>
          <div class="text-h4">{{ lowestGrade }}%</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="3">
      <v-card>
        <v-card-text>
          <div class="text-subtitle-1 mb-2">Total Evaluations</div>
          <div class="text-h4">{{ totalEvaluations }}</div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { Grade } from '~/stores/students'

const props = defineProps<{
  grades: Grade[]
}>()

const gradePercentages = computed(() => 
  props.grades.map(grade => (grade.score / grade.maxScore) * 100)
)

const averageGrade = computed(() => {
  if (gradePercentages.value.length === 0) return 0
  const avg = gradePercentages.value.reduce((a, b) => a + b, 0) / gradePercentages.value.length
  return avg.toFixed(1)
})

const highestGrade = computed(() => {
  if (gradePercentages.value.length === 0) return 0
  return Math.max(...gradePercentages.value).toFixed(1)
})

const lowestGrade = computed(() => {
  if (gradePercentages.value.length === 0) return 0
  return Math.min(...gradePercentages.value).toFixed(1)
})

const totalEvaluations = computed(() => props.grades.length)

const trendIcon = computed(() => {
  if (props.grades.length < 2) return 'mdi-minus'
  const lastTwo = props.grades.slice(-2).map(g => g.score / g.maxScore * 100)
  return lastTwo[1] > lastTwo[0] ? 'mdi-trending-up' : 'mdi-trending-down'
})

const trendColor = computed(() => {
  if (props.grades.length < 2) return 'grey'
  const lastTwo = props.grades.slice(-2).map(g => g.score / g.maxScore * 100)
  return lastTwo[1] > lastTwo[0] ? 'success' : 'error'
})
</script>