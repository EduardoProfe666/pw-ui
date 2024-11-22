import { defineStore } from 'pinia'
import { format } from 'date-fns'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'student'
  status: 'active' | 'inactive'
  avatar?: string
  createdAt: string
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
    users: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
        createdAt: '2024-03-15T10:00:00Z'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'student',
        status: 'active',
        avatar: 'https://cdn.vuetifyjs.com/images/jane.jpg',
        createdAt: '2024-03-14T15:30:00Z'
      }
    ],
    loading: false,
    error: null,
    selectedUser: null,
    isDialogOpen: false,
    dialogMode: 'create'
  }),

  getters: {
    formattedUsers: (state) => state.users.map(user => ({
      ...user,
      formattedDate: format(new Date(user.createdAt), 'PPP'),
      statusColor: user.status === 'active' ? 'success' : 'error',
      roleColor: user.role === 'admin' ? 'primary' : 'info'
    }))
  },

  actions: {
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

    async createUser(userData: Partial<User>) {
      try {
        this.loading = true
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newUser: User = {
          id: this.users.length + 1,
          name: userData.name!,
          email: userData.email!,
          role: userData.role!,
          status: 'active',
          createdAt: new Date().toISOString(),
          avatar: `https://cdn.vuetifyjs.com/images/avatar/${Math.floor(Math.random() * 6) + 1}.jpg`
        }
        
        this.users.push(newUser)
        this.closeDialog()
      } catch (error) {
        this.error = 'Failed to create user'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUser(userData: Partial<User>) {
      try {
        this.loading = true
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const index = this.users.findIndex(u => u.id === this.selectedUser?.id)
        if (index !== -1) {
          this.users[index] = {
            ...this.users[index],
            ...userData
          }
        }
        
        this.closeDialog()
      } catch (error) {
        this.error = 'Failed to update user'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id: number) {
      try {
        this.loading = true
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) {
          this.users.splice(index, 1)
        }
      } catch (error) {
        this.error = 'Failed to delete user'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})