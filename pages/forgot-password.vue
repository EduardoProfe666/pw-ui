<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-card-title class="text-center py-4">
            <h1 class="text-h5">Olvido de Contraseña</h1>
          </v-card-title>
          
          <v-card-text class="text-center">
            <p class="text-body-1 text-medium-emphasis mb-4">
              Ingresa tu correo a continuación. El sistema te enviará instrucciones para restablecer tu contraseña.
            </p>

            <v-form @submit.prevent="handleSubmit" ref="form">
              <v-text-field
                v-model="email"
                label="Correo"
                prepend-inner-icon="mdi-email"
                type="email"
                required
                :rules="[
                  v => !!v || 'El correo es requerido',
                  v => /.+@.+\..+/.test(v) || 'El correo debe ser válido'
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
                Revisa tu correo para restablecer tu contraseña.
              </v-alert>

              <v-btn
                color="primary"
                block
                size="large"
                type="submit"
                :loading="loading"
                class="mt-2"
              >
                Enviar Correo
              </v-btn>

              <div class="mt-4">
                <NuxtLink to="/login" class="text-decoration-none">
                  <v-btn variant="text" block>
                    Regresar al Login
                  </v-btn>
                </NuxtLink>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const form = ref()
const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  try {
    loading.value = true
    error.value = ''
    await authStore.forgotPassword(email.value)
    success.value = true
  } catch (err) {
    error.value = 'Falló la solicitud. Por favor, revisa tu correo e inténtalo más tarde.'
  } finally {
    loading.value = false
  }
}
</script>