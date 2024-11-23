<template>
  <v-app-bar color="primary" elevation="3">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

    <v-app-bar-title class="font-weight-bold">
      <a href="/">
      <v-icon icon="mdi-school" class="mr-2"></v-icon>
      PW-UI
      </a>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <v-menu location="bottom end" transition="scale-transition">
      <template v-slot:activator="{ props }">
        <v-btn class="mr-4" v-bind="props">
          <v-avatar size="32" class="mr-2">
            <v-img :src="authStore.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'" alt="Avatar"></v-img>
          </v-avatar>
          <span class="hidden-sm-and-down">{{ authStore.user?.student?.name || "Administrador" }}</span>
          <v-icon right>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list width="300" elevation="3">
        <v-list-item>
          <template v-slot:prepend>
            <v-avatar size="40">
              <v-img :src="authStore.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'" alt="Avatar"></v-img>
            </v-avatar>
          </template>
          <v-list-item-title class="font-weight-bold">{{ authStore.user?.student?.name || "Administrador" }}</v-list-item-title>
          <v-list-item-subtitle>{{ authStore.user?.email || 'admin' }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item to="/profile" prepend-icon="mdi-account-circle" title="Mi Perfil"></v-list-item>
        <v-list-item to="/profile/settings" prepend-icon="mdi-cog" title="Ajustes"></v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="authStore.logout" prepend-icon="mdi-logout" title="Cerrar Sesión" color="error"></v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" elevation="3">
    <v-list-item>
      <template v-slot:prepend>
        <v-avatar size="40">
          <v-img :src="authStore.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'" alt="Avatar"></v-img>
        </v-avatar>
      </template>
      <v-list-item-title class="text-h6">{{ authStore.user?.student?.name || "Administrador" }}</v-list-item-title>
      <v-list-item-subtitle>{{ authStore.role === 'student' ? 'estudiante' : 'administrador' }}</v-list-item-subtitle>
    </v-list-item>

    <v-divider class="my-2"></v-divider>

    <v-list density="compact" nav>
      <v-list-item to="/" prepend-icon="mdi-view-dashboard" title="Inicio" rounded="lg" />
      
      <template v-if="isAdmin">
        <v-list-item to="/users" prepend-icon="mdi-account-group" title="Usuarios" rounded="lg" />
        <v-list-item to="/students" prepend-icon="mdi-school" title="Estudiantes" rounded="lg" />
        <v-list-item to="/assessments" prepend-icon="mdi-clipboard-text" title="Evaluaciones" rounded="lg" />
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const drawer = ref(false)
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)
</script>