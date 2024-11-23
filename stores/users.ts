import { defineStore } from 'pinia'
import { format } from 'date-fns'
import {
  createAssessment,
  deleteAssessment,
  getAllAssessments,
  updateAssessment
} from "~/services/assessments/assessments.service";
import {getAllStudents} from "~/services/students/students.service";
import {createUser, deleteUser, getAllUsers, updateUser} from "~/services/users/users.service";
import type AssessmentInDto from "~/services/assessments/dto/in/assessment.in.dto";
import type UserInDto from "~/services/users/dto/in/user.in.dto";

export interface User {
  id: number
  name: string
  email: string
  username: string
  fullName: string
  avatar?: string
  listNumber: number
  isRepeater: boolean
  isCarryForward: boolean
}

interface UsersState {
  users: User[]
  loading: boolean
  error: string | null
  selectedUser: User | null
  isDialogOpen: boolean
  dialogMode: 'create' | 'edit'
}

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: [],
    loading: false,
    error: null,
    selectedUser: null,
    isDialogOpen: false,
    dialogMode: 'create'
  }),

  getters: {
    formattedUsers: (state) => state.users.map(user => ({
      ...user,
    }))
  },

  actions: {
    async fetchUsers() {
      this.loading = true;
      try {
        const u = await getAllUsers();
        const est = await getAllStudents();
        this.users = u.map(x => ({
          id: x.id,
          username: x.username,
          email: x.email,
          listNumber: est.find(y => y.username === x.username)?.listNumber || 0,
          isRepeater: est.find(y => y.username === x.username)?.isRepeater || false,
          isCarryForward: est.find(y => y.username === x.username)?.isCarryForward || false,
          name: est.find(y => y.username === x.username)?.name || "Nombre",
          fullName: est.find(y => y.username === x.username)?.fullName || "Nombre Completo",
          avatar: est.find(y => y.username === x.username)?.avatar || "https://cdn.vuetifyjs.com/images/john.jpg",
        }));
      } catch (error) {
        this.error = 'Error al cargar los usuarios';
      } finally {
        this.loading = false;
      }
    },

    setSelectedUser(user: User | null) {
      this.selectedUser = user
    },

    openDialog(mode: 'create' | 'edit', user?: User) {
      this.dialogMode = mode
      this.selectedUser = user || null
      this.isDialogOpen = true
    },

    closeDialog() {
      this.isDialogOpen = false
      this.selectedUser = null
    },

    async createUser(data: UserInDto) {
      try {
        this.loading = true;
        await createUser(data);
        await this.fetchUsers();
        this.closeDialog();
      } catch (error) {
        this.error = 'Error al crear el usuario';
      } finally {
        this.loading = false;
      }
    },

    async updateUser(data: UserInDto) {
      if (!this.selectedUser) return;

      try {
        this.loading = true;
        await updateUser(this.selectedUser.id, data);

        await this.fetchUsers();

        this.closeDialog();
      } catch (error) {
        this.error = 'Error al actualizar el usuario';
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id: number) {
      try {
        this.loading = true;
        await deleteUser(id);

        const index = this.users.findIndex(e => e.id === id);
        if (index !== -1) {
          this.users.splice(index, 1);
        }
      } catch (error) {
        this.error = 'Error al eliminar el usuario';
      } finally {
        this.loading = false;
      }
    }
  }
})