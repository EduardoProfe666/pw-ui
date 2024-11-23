import api from "~/services/api.axios";
import type AssessmentOutDto from "~/services/assessments/dto/out/assessment.out.dto";
import type AssessmentInDto from "~/services/assessments/dto/in/assessment.in.dto";
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const getAuthToken = () => {
    const authStore = useAuthStore();
    return authStore.token;
};

export const getAllAssessments = async (): Promise<AssessmentOutDto[]> => {
    const toast = useToast();
    try {
        const response = await api.get<AssessmentOutDto[]>(`v1/assessments`, {
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

export const getAssessmentById = async (id: number): Promise<AssessmentOutDto> => {
    const toast = useToast();
    try {
        const response = await api.get<AssessmentOutDto>(`v1/assessments/${id}`, {
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

export const createAssessment = async (assessmentData: AssessmentInDto): Promise<AssessmentOutDto> => {
    const toast = useToast();
    try {
        const response = await api.post<AssessmentOutDto>(`v1/assessments`, assessmentData, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        toast.success('Evaluación creada exitosamente.');
        return response.data;
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const updateAssessment = async (id: number, assessmentData: AssessmentInDto) => {
    const toast = useToast();
    try {
        await api.put(`v1/assessments/${id}`, assessmentData, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        toast.success('Evaluación actualizada exitosamente.');
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const deleteAssessment = async (id: number) => {
    const toast = useToast();
    try {
        await api.delete(`v1/assessments/${id}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        toast.success('Evaluación eliminada exitosamente.');
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
            toast.error('Evaluación no encontrada.');
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