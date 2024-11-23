import api from "~/services/api.axios";
import type UserOutDto from "~/services/users/dto/out/user.out.dto";
import type UserWithStudentOutDto from "~/services/users/dto/out/user-with-student.out.dto";
import type UserInDto from "~/services/users/dto/in/user.in.dto";
import type UserUpdateInDto from "~/services/users/dto/in/user-update.in.dto";
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const getAuthToken = () => {
    const authStore = useAuthStore();
    return authStore.token;
};

export const getAllUsers = async (): Promise<UserOutDto[]> => {
    const toast = useToast();
    try {
        const response = await api.get<UserOutDto[]>(`/v1/users`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const getUserById = async (id: number): Promise<UserWithStudentOutDto> => {
    const toast = useToast();
    try {
        const response = await api.get<UserWithStudentOutDto>(`/v1/users/${id}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const createUser = async (userData: UserInDto): Promise<UserOutDto> => {
    const toast = useToast();
    try {
        const response = await api.post<UserOutDto>(`/v1/users`, userData, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        toast.success('Usuario creado exitosamente.');
        return response.data;
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const updateUser = async (id: number, userData: UserUpdateInDto) => {
    const toast = useToast();
    try {
        await api.put(`/v1/users/${id}`, userData, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        toast.success('Usuario actualizado exitosamente.');
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const deleteUser = async (id: number) => {
    const toast = useToast();
    try {
        await api.delete(`/v1/users/${id}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        toast.success('Usuario eliminado exitosamente.');
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const getCurrentUser = async (): Promise<UserWithStudentOutDto> => {
    const toast = useToast();
    try {
        const response = await api.post<UserWithStudentOutDto>(`/v1/users/me`, {}, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
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
        } else if (status === 404) {
            toast.error('Usuario no encontrado.');
        } else if (status === 400) {
            toast.error('Solicitud incorrecta.');
        } else if (status === 409) {
            toast.error('Conflicto al procesar la solicitud.');
        } else {
            toast.error('Ocurrió un error. Por favor, inténtalo de nuevo.');
        }
    } else {
        console.error('Unknown Error:', error);
        toast.error('Ocurrió un error desconocido.');
    }
};