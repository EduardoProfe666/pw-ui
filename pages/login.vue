<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-card-title class="text-center py-4">
            <h1 class="text-h5 font-weight-medium">Bienvenido Nuevamente</h1>
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="handleLogin" ref="form">
              <v-text-field
                  v-model="email"
                  label="Nombre de Usuario"
                  prepend-inner-icon="mdi-account"
                  type="text"
                  required
                  :rules="[v => !!v || 'El nombre de usuario es requerido']"
              ></v-text-field>

              <v-text-field
                  v-model="password"
                  label="Contraseña"
                  prepend-inner-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  required
                  :rules="[v => !!v || 'La contraseña es requerida']"
              ></v-text-field>

              <div class="d-flex justify-space-between align-center mt-2">
                <v-checkbox label="Recuérdame" hide-details></v-checkbox>
                <NuxtLink to="/forgot-password" class="text-decoration-none font-weight-medium">
                  Olvidó su contraseña?
                </NuxtLink>
              </div>

              <v-alert
                  v-if="error"
                  type="error"
                  variant="tonal"
                  class="mt-4"
              >
                {{ error }}
              </v-alert>

              <v-alert
                  v-if="success"
                  type="success"
                  variant="tonal"
                  class="mt-4"
              >
                Inicio de sesión exitoso.
              </v-alert>

              <v-btn
                  color="primary"
                  block
                  size="large"
                  type="submit"
                  class="mt-6"
                  :loading="loading"
              >
              Ingresar
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleLogin = async () => {
  error.value = ''
  success.value = ''

  if (email.value && password.value) {
    try {
      loading.value = true
      await authStore.login(email.value, password.value)
      success.value = true
      router.push('/')
    } catch (err) {
      error.value = 'Falló el inicio de sesión. Por favor, revisa tus credenciales.'
      console.error('Login failed:', err)
    } finally {
      loading.value = false
    }
  } else {
    error.value = 'Por favor, completa todos los campos requeridos.'
  }
}
</script>