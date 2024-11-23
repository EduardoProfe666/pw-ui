<template>
  <v-container fluid class="flex items-center justify-center h-screen bg-gray-100">
    <v-card class="text-center p-10 shadow-2xl rounded-lg max-w-md mx-auto">
      <div class="text-center p-6">
        <v-icon large class="mb-6" color="red">mdi-alert-circle</v-icon>
        <h1 class="text-8xl font-bold text-red-600">403</h1>
        <p class="mt-4 text-2xl font-semibold">Acceso Prohibido</p>
        <p class="mt-2 text-gray-600">No tienes permiso para acceder a esta página.</p>
        <v-btn
            class="mt-6"
            color="blue"
            @click="goHome"
            large
        >
          Volver al Inicio
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>

</style>