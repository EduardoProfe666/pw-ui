export interface RankingRow {
  position: number;

  studentId: number;

  avg: number;
}

export default interface RankingTableOutDto {
  ranking: RankingRow[];

}