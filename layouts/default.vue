<template>
  <div>
    <AppNavbar v-if="isAuthenticated" />
    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>