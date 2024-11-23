<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <h1 class="text-h5 font-weight-bold">Users Management</h1>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="usersStore.openDialog('create')"
        >
          Add User
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              variant="outlined"
              density="comfortable"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="roleFilter"
              :items="['All Roles', 'admin', 'student']"
              label="Role"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="statusFilter"
              :items="['All Status', 'active', 'inactive']"
              label="Status"
              variant="outlined"
              density="comfortable"
              hide-details
            ></v-select>
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="filteredUsers"
          :search="search"
          :loading="usersStore.loading"
          hover
          class="mt-4"
        >
          <template v-slot:item.avatar="{ item }">
            <v-avatar size="40">
              <v-img :src="item.avatar" :alt="item.name"></v-img>
            </v-avatar>
          </template>

          <template v-slot:item.role="{ item }">
            <v-chip
              :color="item.roleColor"
              size="small"
              class="text-uppercase"
            >
              {{ item.role }}
            </v-chip>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip
              :color="item.statusColor"
              size="small"
              class="text-uppercase"
            >
              {{ item.status }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon
              variant="text"
              color="primary"
              size="small"
              class="mr-2"
              @click="usersStore.openDialog('edit', item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="error"
              size="small"
              @click="confirmDelete(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- User Form Dialog -->
    <v-dialog
      v-model="usersStore.isDialogOpen"
      max-width="600px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="pa-4">
          <span class="text-h5">{{ dialogTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="handleSubmit" ref="form">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.name"
                  label="Name"
                  required
                  :rules="[v => !!v || 'Name is required']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  type="email"
                  required
                  :rules="[
                    v => !!v || 'Email is required',
                    v => /.+@.+\..+/.test(v) || 'Email must be valid'
                  ]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.role"
                  :items="['admin', 'student']"
                  label="Role"
                  required
                  :rules="[v => !!v || 'Role is required']"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.status"
                  :items="['active', 'inactive']"
                  label="Status"
                  required
                  :rules="[v => !!v || 'Status is required']"
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="usersStore.closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="handleSubmit"
            :loading="usersStore.loading"
          >
            {{ usersStore.dialogMode === 'create' ? 'Create' : 'Update' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5 pa-4">
          Confirm Delete
        </v-card-title>

        <v-card-text>
          Are you sure you want to delete this user? This action cannot be undone.
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            @click="handleDelete"
            :loading="usersStore.loading"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useUsersStore, type User } from '~/stores/users'
definePageMeta({
  middleware: ['auth']
})

const usersStore = useUsersStore()
const form = ref()
const search = ref('')
const roleFilter = ref('All Roles')
const statusFilter = ref('All Status')
const deleteDialog = ref(false)
const userToDelete = ref<User | null>(null)

const headers = [
  { title: 'Avatar', key: 'avatar', sortable: false },
  { title: 'Name', key: 'name', align: 'start' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Status', key: 'status' },
  { title: 'Created At', key: 'formattedDate' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

const formData = ref({
  name: '',
  email: '',
  role: 'student',
  status: 'active'
})

const dialogTitle = computed(() => {
  return usersStore.dialogMode === 'create' ? 'Create User' : 'Edit User'
})

const filteredUsers = computed(() => {
  let users = usersStore.formattedUsers

  if (roleFilter.value !== 'All Roles') {
    users = users.filter(user => user.role === roleFilter.value)
  }

  if (statusFilter.value !== 'All Status') {
    users = users.filter(user => user.status === statusFilter.value)
  }

  return users
})

watch(() => usersStore.selectedUser, (newUser) => {
  if (newUser) {
    formData.value = { ...newUser }
  } else {
    formData.value = {
      name: '',
      email: '',
      role: 'student',
      status: 'active'
    }
  }
})

const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  
  if (!valid) return

  try {
    if (usersStore.dialogMode === 'create') {
      await usersStore.createUser(formData.value)
    } else {
      await usersStore.updateUser(formData.value)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

const confirmDelete = (user: User) => {
  userToDelete.value = user
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!userToDelete.value) return
  
  try {
    await usersStore.deleteUser(userToDelete.value.id)
    deleteDialog.value = false
    userToDelete.value = null
  } catch (error) {
    console.error('Error:', error)
  }
}
</script>