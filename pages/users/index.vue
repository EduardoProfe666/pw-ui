<template>
  <div>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <h1 class="text-h5 font-weight-bold">Gestión de Usuarios</h1>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="usersStore.openDialog('create')"
        >
          Agregar
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
                variant="outlined"
                density="comfortable"
            ></v-text-field>
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
            <v-row class="border-t">
              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="formData.name"
                    label="Nombre"
                    required
                    :rules="[v => !!v || 'Nombre es requerido']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="formData.fullName"
                    label="Nombre Completo"
                    required
                    :rules="[v => !!v || 'Nombre Completo es requerido']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="formData.username"
                    label="Nombre de Usuario"
                    required
                    :rules="[v => !!v || 'Nombre de Usuario es requerido']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="formData.email"
                    label="Correo"
                    type="email"
                    required
                    :rules="[
                    v => !!v || 'Correo es requerido',
                    v => /.+@.+\..+/.test(v) || 'Correo debe ser válido'
                  ]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-radio-group
                    v-model="formData.isRepeater"
                    label="Repitente"
                    required
                    inline
                >
                  <v-radio
                      :value="true"
                      label="Sí"
                  ></v-radio>
                  <v-radio
                      :value="false"
                      label="No"
                  ></v-radio>
                </v-radio-group>
              </v-col>

              <v-col cols="12" sm="6">
                <v-radio-group
                    v-model="formData.isCarryForward"
                    label="Arrastre"
                    required
                    inline
                >
                  <v-radio
                      :value="true"
                      label="Sí"
                  ></v-radio>
                  <v-radio
                      :value="false"
                      label="No"
                  ></v-radio>
                </v-radio-group>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                    v-model="formData.listNumber"
                    label="Número de lista"
                    required
                    type="number"
                    :rules="[
                      v => !!v || 'Número de lista es requerido',
                      v => Number.isInteger(Number(v)) || 'Debe ser un número entero',
                      v => Number(v) > 0 || 'Debe ser mayor que 0'
                    ]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 border-t">
          <v-spacer></v-spacer>
          <v-btn
              color="grey-darken-1"
              variant="text"
              @click="usersStore.closeDialog"
          >
            Cancelar
          </v-btn>
          <v-btn
              color="primary"
              @click="handleSubmit"
              :loading="usersStore.loading"
          >
            {{ usersStore.dialogMode === 'create' ? 'Crear' : 'Actualizar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5 pa-4">
          Confirmar Borrado
        </v-card-title>

        <v-card-text>
          Estás seguro que quieres borrar este usuario? Esta acción <strong>NO</strong> puede deshacerse.
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
              color="grey-darken-1"
              variant="text"
              @click="deleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
              color="error"
              @click="handleDelete"
              :loading="usersStore.loading"
          >
            Borrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import {type User, useUsersStore} from '~/stores/users'
import type UserInDto from "~/services/users/dto/in/user.in.dto";

definePageMeta({
  middleware: ['auth']
})

const usersStore = useUsersStore()
const form = ref()
const search = ref('')
const deleteDialog = ref(false)
const userToDelete = ref<User | null>(null)

const headers = [
  {title: 'Avatar', key: 'avatar', sortable: false},
  {title: 'Nombre', key: 'name', align: 'start'},
  {title: 'Nombre de Usuario', key: 'username'},
  {title: 'Correo', key: 'email'},
  {title: 'Nombre Completo', key: 'fullName'},
  {title: 'Acciones', key: 'actions', sortable: false, align: 'end'}
]

const formData = ref({
  name: '',
  email: '',
  username: '',
  fullName: '',
  listNumber: 0,
  isRepeater: false,
  isCarryForward: false,
})

const dialogTitle = computed(() => {
  return usersStore.dialogMode === 'create' ? 'Crear Usuario' : 'Editar Usuario'
})

const filteredUsers = computed(() => {
  return usersStore.formattedUsers
})

watch(() => usersStore.selectedUser, (newUser) => {
  if (newUser) {
    formData.value = {...newUser}
  } else {
    formData.value = {
      name: '',
      email: '',
      username: '',
      fullName: '',
      listNumber: 0,
      isRepeater: false,
      isCarryForward: false,
    }
  }
})

const handleSubmit = async () => {
  const {valid} = await form.value.validate()

  if (!valid) return

  try {
    const data: UserInDto = {
      name: formData.value.name,
      username: formData.value.username,
      email: formData.value.email,
      password: 'Tanqueria2024.',
      fullName: formData.value.fullName,
      isCarryForward: formData.value.isCarryForward,
      isRepeater: formData.value.isRepeater,
      listNumber: parseInt(formData.value.listNumber),
    }
    if (usersStore.dialogMode === 'create') {
      await usersStore.createUser(data)
    } else {
      await usersStore.updateUser(data)
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

onMounted(async () => {
  await usersStore.fetchUsers();
});
</script>