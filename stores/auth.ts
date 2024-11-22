import { defineStore } from "pinia";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "student";
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === "admin",
    isStudent: (state) => state.user?.role === "student",
  },

  actions: {
    async login(email: string, password: string) {
      // TODO: Implement actual login logic with API
      this.user = {
        id: 1,
        name: "John Doe",
        email,
        role: "admin",
        avatar: "https://cdn.vuetifyjs.com/images/john.jpg",
      };
      this.token = "dummy-token";
      this.isAuthenticated = true;
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      navigateTo("/login");
    },

    async updateProfile(profileData: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...profileData };
      }
    },
  },
});
