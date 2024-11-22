<template>
  <v-card class="mb-4">
    <v-card-title class="d-flex align-center pa-4">
      <span class="text-h6">Grade Distribution</span>
      <v-spacer></v-spacer>
      <v-btn-toggle v-model="chartType" mandatory>
        <v-btn value="bar" icon="mdi-chart-bar"></v-btn>
        <v-btn value="line" icon="mdi-chart-line"></v-btn>
      </v-btn-toggle>
    </v-card-title>
    <v-card-text>
      <canvas ref="chartRef"></canvas>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js'
import { format } from 'date-fns'
import type { Grade } from '~/stores/students'

Chart.register(...registerables)

const props = defineProps<{
  grades: Grade[]
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
const chartInstance = ref<Chart | null>(null)
const chartType = ref('bar')

const createChart = () => {
  if (!chartRef.value) return

  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return

  const sortedGrades = [...props.grades].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  const data = {
    labels: sortedGrades.map(grade => format(new Date(grade.createdAt), 'MMM d')),
    datasets: [{
      label: 'Grade (%)',
      data: sortedGrades.map(grade => (grade.score / grade.maxScore) * 100),
      backgroundColor: '#1867C0',
      borderColor: '#1867C0',
      tension: 0.4
    }]
  }

  if (chartInstance.value) {
    chartInstance.value.destroy()
  }

  chartInstance.value = new Chart(ctx, {
    type: chartType.value,
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value) => `${value}%`
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })
}

watch(() => props.grades, createChart, { deep: true })
watch(chartType, createChart)

onMounted(createChart)
onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
})
</script>