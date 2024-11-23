// services/auth.service.ts
import api from "~/services/api.axios";
import type AuthOutDto from "~/services/auth/dto/out/auth.out.dto";
import type LoginInDto from "~/services/auth/dto/in/login.in.dto";
import type ChangePasswordInDto from "~/services/auth/dto/in/change-password.in.dto";
import type ForgotPasswordInDto from "~/services/auth/dto/in/forgot-password.in.dto";
import type ResetPasswordInDto from "~/services/auth/dto/in/reset-password.in.dto";
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import {useAuthStore} from "~/stores/auth";

const getAuthToken = () => {
    const authStore = useAuthStore();
    return authStore.token;
};

export const login = async (loginData: LoginInDto): Promise<AuthOutDto> => {
    const toast = useToast();
    try {
        const response = await api.post<AuthOutDto>(`v1/auth/login`, loginData);
        return response.data;
    } catch (error) {
        toast.error('Revisa sus credenciales e intente nuevamente.');
        throw error;
    }
};

export const changePassword = async (changePasswordData: ChangePasswordInDto) => {
    const toast = useToast();
    try {
        const response = await api.post(`v1/auth/change-password`, changePasswordData, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const forgotPassword = async (forgotPasswordData: ForgotPasswordInDto) => {
    const toast = useToast();
    try {
        const response = await api.post(`v1/auth/forgot-password`, forgotPasswordData);
        return response.data;
    } catch (error) {
        toast.error('Revise que el correo proporcionado pertenezca a un usuario.')
        throw error;
    }
};

export const resetPassword = async (resetPasswordData: ResetPasswordInDto) => {
    const toast = useToast();
    try {
        const response = await api.post(`v1/auth/reset-password`, resetPasswordData);
        return response.data;
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

const handleError = (error: any, toast: any) => {
    const router = useRouter();

    if (error.response) {
        const status = error.response.status;

        if (status === 401) {
            router.push('/login');
            toast.error('No autorizado. Por favor, inicia sesión nuevamente.');
        } else if (status === 403) {
            router.push('/403');
            toast.error('Acceso prohibido.');
        } else {
            toast.error('Ocurrió un error. Por favor, inténtalo de nuevo.');
        }
    } else {
        console.error('Unknown Error:', error);
        toast.error('Ocurrió un error desconocido. Por favor, inténtalo más tarde.');
    }
};