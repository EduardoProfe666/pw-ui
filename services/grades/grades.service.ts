import api from "~/services/api.axios";
import type GradeOutDto from "~/services/grades/dto/out/grade.out.dto";
import type GradeWithAssessmentOutDto from "~/services/grades/dto/out/grade-with-assessment.out.dto";
import type GradeInDto from "~/services/grades/dto/in/grade.in.dto";
import type AvgGradeOutDto from "~/services/grades/dto/out/avg-grade.out.dto";
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const getAuthToken = () => {
    const authStore = useAuthStore();
    return authStore.token;
};

export const getAllGrades = async (): Promise<GradeOutDto[]> => {
    const toast = useToast();
    try {
        const response = await api.get<GradeOutDto[]>(`v1/grades`, {
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

export const getGradeById = async (id: number): Promise<GradeWithAssessmentOutDto> => {
    const toast = useToast();
    try {
        const response = await api.get<GradeWithAssessmentOutDto>(`v1/grades/${id}`, {
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

export const getMissingGradesById = async (id: number): Promise<string[]> => {
    const toast = useToast();
    try {
        const response = await api.get<string[]>(`v1/grades/missing/${id}`, {
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

export const getAvgById = async (id: number): Promise<AvgGradeOutDto> => {
    const toast = useToast();
    try {
        const response = await api.get<AvgGradeOutDto>(`v1/grades/avg/${id}`, {
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

export const getAvgForCurrentUser = async (): Promise<AvgGradeOutDto> => {
    const toast = useToast();
    try {
        const response = await api.post<AvgGradeOutDto>(`v1/grades/avg/me`, {}, {
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

export const getGradesByStudentId = async (id: number): Promise<GradeWithAssessmentOutDto[]> => {
    const toast = useToast();
    try {
        const response = await api.get<GradeWithAssessmentOutDto[]>(`v1/grades/student/${id}`, {
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

export const createGrade = async (gradeData: GradeInDto): Promise<GradeWithAssessmentOutDto> => {
    const toast = useToast();
    try {
        const response = await api.post<GradeWithAssessmentOutDto>(`v1/grades`, gradeData, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        toast.success('Calificación creada exitosamente.');
        return response.data;
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const updateGrade = async (id: number, gradeData: GradeInDto) => {
    const toast = useToast();
    try {
        await api.put(`v1/grades/${id}`, gradeData, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        toast.success('Calificación actualizada exitosamente.');
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const deleteGrade = async (id: number) => {
    const toast = useToast();
    try {
        await api.delete(`v1/grades/${id}`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            }
        });
        toast.success('Calificación eliminada exitosamente.');
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
            toast.error('Calificación no encontrada.');
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