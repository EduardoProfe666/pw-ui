import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'student'
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  resetPasswordEmail: string | null
  resetPasswordToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    resetPasswordEmail: null,
    resetPasswordToken: null
  }),

  persist: true,

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isStudent: (state) => state.user?.role === 'student'
  },

  actions: {
    async login(email: string, password: string) {
      // TODO: Implement actual login logic with API
      this.user = {
        id: 1,
        name: 'John Doe',
        email,
        role: 'admin',
        avatar: 'https://cdn.vuetifyjs.com/images/john.jpg'
      }
      this.token = 'dummy-token'
      this.isAuthenticated = true
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      navigateTo('/login')
    },

    async updateProfile(profileData: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...profileData }
      }
    },

    async forgotPassword(email: string) {
      try {
        // TODO: Implement actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.resetPasswordEmail = email
        // In a real app, this would send an email with a reset link
        return true
      } catch (error) {
        console.error('Failed to process forgot password:', error)
        throw error
      }
    },

    async resetPassword(token: string, newPassword: string) {
      try {
        // TODO: Implement actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.resetPasswordToken = token
        // In a real app, this would validate the token and update the password
        return true
      } catch (error) {
        console.error('Failed to reset password:', error)
        throw error
      }
    },

    async validateResetToken(token: string) {
      try {
        // TODO: Implement actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        return true
      } catch (error) {
        console.error('Invalid or expired reset token:', error)
        throw error
      }
    }
  }
})