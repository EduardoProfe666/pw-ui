<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-card-title class="text-center py-4">
            <h1 class="text-h5">Reset Password</h1>
          </v-card-title>
          
          <v-card-text class="text-center">
            <p v-if="!isValidToken" class="text-body-1 text-medium-emphasis mb-4">
              Token de restablecimiento Inválido o Expirado. Por favor acceda nuevamente al apartado Olvido de Contraseña.
            </p>

            <template v-else>
              <p class="text-body-1 text-medium-emphasis mb-4">
                Ingrese su nueva contraseña a continuación.
              </p>

              <v-form @submit.prevent="handleSubmit" ref="form">
                <v-text-field
                  v-model="password"
                  label="Nueva Contraseña"
                  prepend-inner-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  required
                  :rules="[
                    v => !!v || 'La contraseña es requerida',
                    v => v.length >= 8 || 'Debe contener al menos 8 caracteres',
                    v => /[A-Z]/.test(v) || 'Debe contener al menos una letra mayúscula',
                    v => /(?=.*\W)/.test(v) || 'Debe contener al menos un caracter especial',
                    v => /[0-9]/.test(v) || 'Debe contener al menos un número'
                  ]"
                  :loading="loading"
                  :disabled="loading"
                ></v-text-field>

                <v-text-field
                  v-model="confirmPassword"
                  label="Confirmar Contraseña"
                  prepend-inner-icon="mdi-lock-check"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  required
                  :rules="[
                    v => !!v || 'Por favor, confirme su contraseña',
                    v => v === password || 'Contraseñas deben coincidir'
                  ]"
                  :loading="loading"
                  :disabled="loading"
                ></v-text-field>

                <v-alert
                  v-if="error"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                >
                  {{ error }}
                </v-alert>

                <v-alert
                  v-if="success"
                  type="success"
                  variant="tonal"
                  class="mb-4"
                >
                  Su contraseña ha sido restablecida con éxito.
                </v-alert>

                <v-btn
                  color="primary"
                  block
                  size="large"
                  type="submit"
                  :loading="loading"
                  class="mt-2"
                >
                  Restablecer Contraseña
                </v-btn>
              </v-form>
            </template>

            <div class="mt-4">
              <NuxtLink to="/login" class="text-decoration-none">
                <v-btn variant="text" block>
                  Regresar al login
                </v-btn>
              </NuxtLink>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const form = ref()
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isValidToken = ref(false)

const token = computed(() => route.query.token as string)

onMounted(async () => {
  if (!token.value) {
    router.push('/forgot-password')
    return
  }

  try {
    loading.value = true
    await authStore.validateResetToken(token.value)
    isValidToken.value = true
  } catch (err) {
    isValidToken.value = false
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  try {
    loading.value = true
    error.value = ''
    await authStore.resetPassword(token.value, password.value)
    success.value = true
  } catch (err) {
    error.value = 'Falló el restablecimiento. Por favor, intente más tarde.'
  } finally {
    loading.value = false
  }
}
</script>