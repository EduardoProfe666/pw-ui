<template>
  <div>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-text class="text-center">
            <v-avatar size="150" class="mb-4">
              <v-img :src="authStore.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'" alt="Avatar"></v-img>
            </v-avatar>
            <h2 class="text-h5 mb-1">{{ authStore.user?.student?.name || "Administrador" }}</h2>
            <p class="text-subtitle-1 text-medium-emphasis">{{ authStore.user?.role }}</p>
            <v-divider class="my-4"></v-divider>
            <v-row dense>
              <v-col cols="6">
                <div class="text-subtitle-1 font-weight-bold">Correo</div>
                <div class="text-body-2 text-medium-emphasis">{{ authStore.user?.email || 'admin@admin.admin' }}</div>
              </v-col>
              <v-col cols="6">
                <div class="text-subtitle-1 font-weight-bold">Fecha Random</div>
                <div class="text-body-2 text-medium-emphasis">{{getRandomDate()}}</div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn block color="primary" to="/profile/settings">
              Editar Perfil
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card>
          <v-list>
            <v-list-subheader>Opciones de la Cuenta</v-list-subheader>
            <v-list-item to="/profile/settings" prepend-icon="mdi-account-cog" title="Ajustes"></v-list-item>
            <v-list-item to="/profile/security" prepend-icon="mdi-shield-lock" title="Seguridad (De Bonito)"></v-list-item>
            <v-list-item to="/profile/notifications" prepend-icon="mdi-bell" title="Notificaciones (De Bonito)"></v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card>
          <v-tabs v-model="activeTab">
            <v-tab value="overview">Un Por Arribita</v-tab>
            <v-tab value="activity">Actividad (De Bonito)</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="activeTab">
              <v-window-item value="overview">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-card variant="outlined">
                      <v-card-text>
                        <div class="text-h6 mb-2">Información Personal</div>
                        <v-list density="compact">
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-account</v-icon>
                            </template>
                            <v-list-item-title>{{ authStore.user?.student?.fullName || "El Admin" }}</v-list-item-title>
                            <v-list-item-subtitle>Nombre Completo</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-email</v-icon>
                            </template>
                            <v-list-item-title>{{ authStore.user?.email || 'admin@admin.admin' }}</v-list-item-title>
                            <v-list-item-subtitle>Dirección de Correo</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-account</v-icon>
                            </template>
                            <v-list-item-title>{{ authStore.username }}</v-list-item-title>
                            <v-list-item-subtitle>Nombre de Usuario</v-list-item-subtitle>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-card variant="outlined">
                      <v-card-text>
                        <div class="text-h6 mb-2">Cosas del Estudiante</div>
                        <v-list density="compact">
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-check-circle</v-icon>
                            </template>
                            <v-list-item-title>{{ isRecognized }}</v-list-item-title>
                            <v-list-item-subtitle>Convalidado</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-arrow-right</v-icon>
                            </template>
                            <v-list-item-title>{{ isCarryForward }}</v-list-item-title>
                            <v-list-item-subtitle>Arrastre</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-refresh</v-icon>
                            </template>
                            <v-list-item-title>{{ isRepeater }}</v-list-item-title>
                            <v-list-item-subtitle>Repitente</v-list-item-subtitle>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-window-item>

              <v-window-item value="activity">
                <v-timeline density="compact" align="start">
                  <v-timeline-item
                    v-for="activity in recentActivity"
                    :key="activity.id"
                    :dot-color="activity.color"
                    size="small"
                  >
                    <div class="mb-4">
                      <div class="font-weight-normal">
                        <strong>{{ activity.title }}</strong>
                      </div>
                      <div class="text-caption">{{ activity.time }}</div>
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import {getRandomDate} from "~/services/utils/dates.service";
definePageMeta({
  middleware: ['auth']
})

const authStore = useAuthStore()
const activeTab = ref('overview')

let isCarryForward = '---';
let isRepeater = '---';
let isRecognized = '---';

if(authStore.user?.student){
  isCarryForward = authStore.user.student.isCarryForward ? 'Yep' : 'Nop';
  isRepeater = authStore.user.student.isRepeater ? 'Yep' : 'Nop';
  isRecognized = authStore.user.student.isRecognized ? 'Yep' : 'Nop';
}

const recentActivity = [
  {
    id: 1,
    title: 'Actividad 1',
    time: 'Hace 2 horas',
    color: 'primary'
  },
  {
    id: 2,
    title: 'Actividad 2',
    time: 'Hace 1 día',
    color: 'success'
  },
  {
    id: 3,
    title: 'Actividad 3',
    time: 'Hace 2 días',
    color: 'warning'
  },
  {
    id: 4,
    title: 'Actividad 4',
    time: 'Hace 3 días',
    color: 'info'
  }
]
</script>