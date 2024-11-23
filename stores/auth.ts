import {defineStore} from 'pinia';
import {changePassword, forgotPassword, login, resetPassword} from '~/services/auth/auth.service';
import {getCurrentUser} from '~/services/users/users.service';
import type LoginInDto from '~/services/auth/dto/in/login.in.dto';
import type UserWithStudentOutDto from '~/services/users/dto/out/user-with-student.out.dto';
import {extractClaimsFromToken} from "~/services/utils/jwt.service";
import type ChangePasswordInDto from "~/services/auth/dto/in/change-password.in.dto";
import {getStudentById} from "~/services/students/students.service";

interface AuthState {
  user: UserWithStudentOutDto | null;
  role: string | null;
  username: string | null,
  token: string | null;
  avatar: string | null;
  isAuthenticated: boolean;
  resetPasswordEmail: string | null;
  resetPasswordToken: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    role: null,
    username: null,
    avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
    token: null,
    isAuthenticated: false,
    resetPasswordEmail: null,
    resetPasswordToken: null,
  }),

  persist: true,

  getters: {
    isAdmin: (state) => state.role === 'admin',
    isStudent: (state) => state.role === 'student',
  },

  actions: {
    async login(username: string, password: string) {
      const loginData: LoginInDto = { username, password };
      try {
        const token = await login(loginData);
        this.token = token.token;
        this.isAuthenticated = true;

        const claims = extractClaimsFromToken(this.token);
        if (claims) {
          this.role = claims.role;
          this.username = claims.username;
        }

        if(this.role !== 'admin'){
          this.user = await getCurrentUser();
          this.avatar = (await getStudentById(this.user.student.id)).avatar;
        }
      } catch (error) {
        console.error('Error during login:', error);
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.username = null;
      this.avatar = null;
      this.isAuthenticated = false;
      this.role = null;
      navigateTo('/login');
    },

    async forgotPassword(email: string) {
      const forgotPasswordData = { email };
      try {
        await forgotPassword(forgotPasswordData);
        this.resetPasswordEmail = email;
        return true;
      } catch (error) {
        console.error('Failed to process forgot password:', error);
        throw error;
      }
    },

    async changePassword(oldPassword: string, newPassword: string) {
      const changePasswordData: ChangePasswordInDto = { oldPassword, newPassword };
      try {
        await changePassword(changePasswordData);
        return true;
      } catch (error) {
        console.error('Failed to change password:', error);
        throw error;
      }
    },

    async resetPassword(token: string, newPassword: string) {
      const resetPasswordData = { resetToken: token, newPassword };
      try {
        await resetPassword(resetPasswordData);
        this.resetPasswordToken = token;
        return true;
      } catch (error) {
        console.error('Failed to reset password:', error);
        throw error;
      }
    },

    async validateResetToken(token: string) {
      try {
        return true;
      } catch (error) {
        console.error('Invalid or expired reset token:', error);
        throw error;
      }
    },
  },
});