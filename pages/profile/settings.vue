<template>
  <div>
    <v-card>
      <v-card-title class="text-h5 font-weight-bold pa-4">
        Ajustes de la Cuenta (Cambiar Contraseña)
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="saveSettings" ref="form">
          <v-row>
            <v-col cols="12" class="text-center">
              <v-avatar size="150" class="mb-4">
                <v-img :src="form.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'" alt="Avatar"></v-img>
              </v-avatar>
              <div>
                <v-btn
                    color="primary"
                    prepend-icon="mdi-camera"
                    variant="outlined"
                    class="mb-4"
                >
                  Cambiar Avatar
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                  v-model="form.fullName"
                  label="Nombre Completo"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                  v-model="form.email"
                  label="Correo"
                  prepend-inner-icon="mdi-email"
                  variant="outlined"
                  type="email"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                  v-model="form.username"
                  label="Nombre de Usuario"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                  v-model="form.language"
                  :items="languages"
                  label="Idioma"
                  prepend-inner-icon="mdi-translate"
                  variant="outlined"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-textarea
                  v-model="form.bio"
                  label="Bio"
                  prepend-inner-icon="mdi-text"
                  variant="outlined"
                  rows="3"
              ></v-textarea>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <v-row>
            <v-col cols="12">
              <h3 class="text-h6 mb-4">Cambiar Contraseña</h3>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                  v-model="form.oldPassword"
                  label="Contraseña Actual"
                  prepend-inner-icon="mdi-lock"
                  variant="outlined"
                  :type="showOldPassword ? 'text' : 'password'"
                  :append-inner-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showOldPassword = !showOldPassword"
                  :rules="[
                  v => !!v || 'La Contraseña Actual es Requerida']"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                  v-model="form.newPassword"
                  label="Nueva Contraseña"
                  prepend-inner-icon="mdi-lock-plus"
                  variant="outlined"
                  :type="showNewPassword ? 'text' : 'password'"
                  :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showNewPassword = !showNewPassword"
                  :rules="[
                  v => !!v || 'La contraseña es requerida',
                  v => v.length >= 8 || 'Debe contener al menos 8 caracteres',
                  v => /[A-Z]/.test(v) || 'Debe contener al menos una letra mayúscula',
                  v => /(?=.*\W)/.test(v) || 'Debe contener al menos un caracter especial',
                  v => /[0-9]/.test(v) || 'Debe contener al menos un número'
                 ]"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                  v-model="form.confirmPassword"
                  label="Confirmar Nueva Contraseña"
                  prepend-inner-icon="mdi-lock-check"
                  variant="outlined"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  :rules="[
                  v => !!v || 'Por favor, confirme su contraseña',
                  v => v === form.newPassword || 'Las contraseñas deben coincidir'
                 ]"
              ></v-text-field>
            </v-col>

          </v-row>

          <div class="mt-4">
            <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mb-4"
            >
              Revise los credenciales proporcionados y vuelva a intentarlo más tarde.
            </v-alert>

            <v-alert
                v-if="success"
                type="success"
                variant="tonal"
                class="mb-4">
              Su contraseña ha sido cambiada con éxito.
            </v-alert>
          </div>

        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
            color="error"
            variant="outlined"
            class="mr-2"
            @click="resetForm"
        >
          Restablecer
        </v-btn>
        <v-btn
            color="primary"
            @click="saveSettings"
            :loading="loading"
        >
          Guardar Cambios
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useAuthStore} from '~/stores/auth';
import type {VForm} from "vuetify/components";

const authStore = useAuthStore();

const languages = ['Español', 'Inglés', 'Francés', 'Latín', 'Esperanto'];

const form = ref<VForm>({
  avatar: authStore.avatar,
  fullName: authStore.user?.student?.fullName || "El Admin",
  email: authStore.user?.email || "admin@admin.admin",
  username: authStore.username,
  language: 'Español',
  bio: 'BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const loading = ref(false);
const error = ref('');
const success = ref(false);
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const resetForm = () => {
  form.value = {
    avatar: authStore.avatar,
    fullName: authStore.user?.student?.fullName || "El Admin",
    email: authStore.user?.email || "admin@admin.admin",
    username: authStore.username,
    language: 'Español',
    bio: 'BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  error.value = '';
  loading.value = false;
};

watchEffect(() => {
  form.value.avatar = authStore.avatar;
  form.value.fullName = authStore.user?.student?.fullName || "El Admin";
  form.value.email = authStore.user?.email || "admin@admin.admin";
  form.value.username = authStore.username;
  form.value.language = 'Español';
  form.value.bio = 'BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA BLA';
  resetForm();
});

const saveSettings = async () => {
  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = "Las nuevas contraseñas no coinciden.";
    return;
  }

  try {
    loading.value = true;
    error.value = '';
    success.value = false;

    const successChange = await authStore.changePassword(form.value.oldPassword, form.value.newPassword);

    if (successChange) {
      success.value = true;
      resetForm();
    }
  } catch (err) {
    error.value = "Error al cambiar la contraseña. Intente nuevamente.";
  } finally {
    loading.value = false;
  }
};
</script>
