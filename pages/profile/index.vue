<template>
  <div>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-text class="text-center">
            <v-avatar size="150" class="mb-4">
              <v-img :src="authStore.user?.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'" alt="Avatar"></v-img>
            </v-avatar>
            <h2 class="text-h5 mb-1">{{ authStore.user?.name }}</h2>
            <p class="text-subtitle-1 text-medium-emphasis">{{ authStore.user?.role }}</p>
            <v-divider class="my-4"></v-divider>
            <v-row dense>
              <v-col cols="6">
                <div class="text-subtitle-1 font-weight-bold">Email</div>
                <div class="text-body-2 text-medium-emphasis">{{ authStore.user?.email }}</div>
              </v-col>
              <v-col cols="6">
                <div class="text-subtitle-1 font-weight-bold">Join Date</div>
                <div class="text-body-2 text-medium-emphasis">March 15, 2024</div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn block color="primary" to="/profile/settings">
              Edit Profile
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card>
          <v-list>
            <v-list-subheader>Account Settings</v-list-subheader>
            <v-list-item to="/profile/settings" prepend-icon="mdi-account-cog" title="Profile Settings"></v-list-item>
            <v-list-item to="/profile/security" prepend-icon="mdi-shield-lock" title="Security"></v-list-item>
            <v-list-item to="/profile/notifications" prepend-icon="mdi-bell" title="Notifications"></v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card>
          <v-tabs v-model="activeTab">
            <v-tab value="overview">Overview</v-tab>
            <v-tab value="activity">Activity</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="activeTab">
              <v-window-item value="overview">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-card variant="outlined">
                      <v-card-text>
                        <div class="text-h6 mb-2">Personal Information</div>
                        <v-list density="compact">
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-account</v-icon>
                            </template>
                            <v-list-item-title>{{ authStore.user?.name }}</v-list-item-title>
                            <v-list-item-subtitle>Full Name</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-email</v-icon>
                            </template>
                            <v-list-item-title>{{ authStore.user?.email }}</v-list-item-title>
                            <v-list-item-subtitle>Email Address</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-phone</v-icon>
                            </template>
                            <v-list-item-title>+1 234 567 890</v-list-item-title>
                            <v-list-item-subtitle>Phone Number</v-list-item-subtitle>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-card variant="outlined">
                      <v-card-text>
                        <div class="text-h6 mb-2">Account Statistics</div>
                        <v-list density="compact">
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-calendar</v-icon>
                            </template>
                            <v-list-item-title>March 15, 2024</v-list-item-title>
                            <v-list-item-subtitle>Member Since</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-clock</v-icon>
                            </template>
                            <v-list-item-title>2 hours ago</v-list-item-title>
                            <v-list-item-subtitle>Last Login</v-list-item-subtitle>
                          </v-list-item>
                          <v-list-item>
                            <template v-slot:prepend>
                              <v-icon color="primary">mdi-shield-check</v-icon>
                            </template>
                            <v-list-item-title>Enabled</v-list-item-title>
                            <v-list-item-subtitle>Two-Factor Auth</v-list-item-subtitle>
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
const authStore = useAuthStore()
const activeTab = ref('overview')

const recentActivity = [
  {
    id: 1,
    title: 'Profile updated',
    time: '2 hours ago',
    color: 'primary'
  },
  {
    id: 2,
    title: 'Changed password',
    time: '1 day ago',
    color: 'success'
  },
  {
    id: 3,
    title: 'Logged in from new device',
    time: '2 days ago',
    color: 'warning'
  },
  {
    id: 4,
    title: 'Completed evaluation',
    time: '3 days ago',
    color: 'info'
  }
]
</script>