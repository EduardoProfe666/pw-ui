<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-card-title class="text-center py-4">
            <h1 class="text-h5 font-weight-medium">Bienvenido Nuevamente</h1>
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                  v-model="email"
                  label="Nombre de Usuario"
                  prepend-inner-icon="mdi-account"
                  type="text"
                  required
              ></v-text-field>

              <v-text-field
                  v-model="password"
                  label="Contraseña"
                  prepend-inner-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  required
              ></v-text-field>

              <div class="d-flex justify-space-between align-center mt-2">
                <v-checkbox label="Recuérdame" hide-details></v-checkbox>
                <NuxtLink to="/forgot-password" class="text-decoration-none font-weight-medium">
                  Olvidó su contraseña?
                </NuxtLink>
              </div>

              <v-btn
                  color="primary"
                  block
                  size="large"
                  type="submit"
                  class="mt-6"
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
const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  if (email.value && password.value) {
    try {
      await authStore.login(email.value, password.value)
      router.push('/')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
}
</script>