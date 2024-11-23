<template>
  <div>
    <AppNavbar v-if="shouldShowNavbar" />
    <v-main fluid>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute();
const router = useRouter();
const hiddenRoutes = ['/login', '/forgot-password', '/reset-password', '/403'];

const shouldShowNavbar = computed(() => {
  return authStore.isAuthenticated && !hiddenRoutes.includes(route.path);
});
</script>