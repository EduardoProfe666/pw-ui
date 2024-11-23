import { defineStore } from 'pinia';
import {
    exportStudentList,
    getRankingTable,
    exportRankingTable,
    getGradesTableById,
    exportGradesTableById,
    getGradesTableForCurrentUser,
    exportGradesTableForCurrentUser
} from '~/services/reports/reports.service';
import { useToast } from 'vue-toastification';
import type RankingTableOutDto from "~/services/reports/dto/out/ranking-table.out.dto";
import type GradesTableOutDto from "~/services/reports/dto/out/grades-table.out.dto";
import {getAllStudents} from "~/services/students/students.service";

interface RankingTable{
    position: number;

    studentId: number;

    avg: number;

    studentFullName: string;

    studentName: string;

    username: string;
}

interface ReportsState {
    rankingTable: RankingTable[] | null;
    gradesTable: GradesTableOutDto | null;
}

export const useReportsStore = defineStore('reports', {
    state: (): ReportsState => ({
        rankingTable: null,
        gradesTable: null,
    }),

    actions: {
        async exportStudentList() {
            const toast = useToast();
            try {
                await exportStudentList();
            } catch (error) {
                toast.error('Error al exportar la lista de estudiantes.');
            }
        },

        async fetchRankingTable() {
            const toast = useToast();
            try {
                const rt = await getRankingTable();
                const students = await getAllStudents();
                const ranking: RankingTable[] = [];
                rt.ranking.forEach(x => {
                    const student = students.find(y => y.id === x.studentId);
                    ranking.push({
                        avg: x.avg,
                        studentId: x.studentId,
                        position: x.position,
                        studentFullName: student?.fullName || '',
                        studentName: student?.name || '',
                        username: student?.username || '',
                    })
                })
                this.rankingTable = ranking;
            } catch (error) {
                toast.error('Error al obtener la tabla de clasificación.');
            }
        },

        async exportRankingTable() {
            const toast = useToast();
            try {
                await exportRankingTable();
            } catch (error) {
                toast.error('Error al exportar la tabla de clasificación.');
            }
        },

        async fetchGradesTableById(id: number) {
            const toast = useToast();
            try {
                this.gradesTable = await getGradesTableById(id);
            } catch (error) {
                toast.error('Error al obtener la tabla de calificaciones por ID.');
            }
        },

        async exportGradesTableById(id: number) {
            const toast = useToast();
            try {
                await exportGradesTableById(id);
            } catch (error) {
                toast.error('Error al exportar la tabla de calificaciones por ID.');
            }
        },
    },
});