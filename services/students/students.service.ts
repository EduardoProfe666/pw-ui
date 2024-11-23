import api from "~/services/api.axios";
import type StudentOutDto from "~/services/students/dto/out/student.out.dto";
import type StudentInDto from "~/services/students/dto/in/student.in.dto";
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const getAuthToken = () => {
    const authStore = useAuthStore();
    return authStore.token;
};

export const getAllStudents = async (): Promise<StudentOutDto[]> => {
    const toast = useToast();
    try {
        const response = await api.get<StudentOutDto[]>(`/v1/students`, {
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

export const getStudentById = async (id: number): Promise<StudentOutDto> => {
    const toast = useToast();
    try {
        const response = await api.get<StudentOutDto>(`/v1/students/${id}`, {
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

export const updateStudent = async (id: number, studentData: StudentInDto) => {
    const toast = useToast();
    try {
        await api.put(`/v1/students/${id}`, studentData, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        toast.success('Estudiante actualizado exitosamente.');
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const deleteStudent = async (id: number) => {
    const toast = useToast();
    try {
        await api.delete(`/v1/students/${id}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        toast.success('Estudiante eliminado exitosamente.');
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
            toast.error('Estudiante no encontrado.');
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