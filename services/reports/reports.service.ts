import api from "~/services/api.axios";
import type RankingTableOutDto from "~/services/reports/dto/out/ranking-table.out.dto";
import type GradesTableOutDto from "~/services/reports/dto/out/grades-table.out.dto";
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export const exportStudentList = async () => {
    const toast = useToast();
    const authStore = useAuthStore();

    try {
        const response = await api.post(`/v1/reports/studentList/export`, {}, {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'lista_estudiantes.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast.success('Lista de estudiantes exportada exitosamente.');
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const getRankingTable = async (): Promise<RankingTableOutDto> => {
    const toast = useToast();
    const authStore = useAuthStore();

    try {
        const response = await api.post<RankingTableOutDto>(`/v1/reports/rankingTable`, {}, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        });
        return response.data;
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const exportRankingTable = async () => {
    const toast = useToast();
    const authStore = useAuthStore();

    try {
        const response = await api.post(`/v1/reports/rankingTable/export`, {}, {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${authStore.token}` // Usar el token del store
            }
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ranking_table.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast.success('Tabla de clasificación exportada exitosamente.');
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const getGradesTableById = async (id: number): Promise<GradesTableOutDto> => {
    const toast = useToast();
    const authStore = useAuthStore();

    try {
        const response = await api.get<GradesTableOutDto>(`/v1/reports/gradesTable/${id}`, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        });
        return response.data;
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const exportGradesTableById = async (id: number) => {
    const toast = useToast();
    const authStore = useAuthStore();

    try {
        const response = await api.get(`/v1/reports/gradesTable/${id}/export`, {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'grades_table.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast.success('Tabla de calificaciones exportada exitosamente.');
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const getGradesTableForCurrentUser = async (): Promise<GradesTableOutDto> => {
    const toast = useToast();
    const authStore = useAuthStore();

    try {
        const response = await api.post<GradesTableOutDto>(`/v1/reports/gradesTable/me`, {}, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        });

        return response.data;
    } catch (error) {
        handleError(error, toast);
        throw error;
    }
};

export const exportGradesTableForCurrentUser = async () => {
    const toast = useToast();
    const authStore = useAuthStore();

    try {
        const response = await api.post(`/v1/reports/gradesTable/me/export`, {}, {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'grades_table_me.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast.success('Tu tabla de calificaciones ha sido exportada exitosamente.');
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
            toast.error('Informe no encontrado.');
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