<template>
  <div>
    <v-card>
      <v-card-title class="text-h5 font-weight-bold pa-4">
        Profile Settings
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="saveSettings">
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
                  Change Avatar
                </v-btn>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.name"
                label="Full Name"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.email"
                label="Email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                required
                type="email"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.phone"
                label="Phone"
                prepend-inner-icon="mdi-phone"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="form.language"
                :items="languages"
                label="Language"
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
              <h3 class="text-h6 mb-4">Change Password</h3>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.currentPassword"
                label="Current Password"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                type="password"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.newPassword"
                label="New Password"
                prepend-inner-icon="mdi-lock-plus"
                variant="outlined"
                type="password"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="form.confirmPassword"
                label="Confirm New Password"
                prepend-inner-icon="mdi-lock-check"
                variant="outlined"
                type="password"
              ></v-text-field>
            </v-col>
          </v-row>
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
          Reset
        </v-btn>
        <v-btn
          color="primary"
          @click="saveSettings"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

const languages = ['English', 'Spanish', 'French', 'German']

const form = ref({
  avatar: authStore.user?.avatar,
  name: authStore.user?.name,
  email: authStore.user?.email,
  phone: '',
  language: 'English',
  bio: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const resetForm = () => {
  form.value = {
    avatar: authStore.user?.avatar,
    name: authStore.user?.name,
    email: authStore.user?.email,
    phone: '',
    language: 'English',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const saveSettings = () => {
  // TODO: Implement save settings logic
  console.log('Saving settings:', form.value)
}
</script>