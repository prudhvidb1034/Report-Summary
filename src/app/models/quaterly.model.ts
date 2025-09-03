export type SprintKeys = `sprint${0 | 1 | 2 | 3 | 4}`;


export interface SprintDataResponse {
  content: SprintData[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface SprintData {
  id: number;
  piNumber: number;
  projectId: number;
  projectName: string;
  feature: string;
  sprint0: string;
  sprint1: string;
  sprint2: string;
  sprint3: string;
  sprint4: string;
  completionPercentage: number;
  statusReport: string;
  selectedSprints: string[],
  [key: `sprint${number}`]: string;  // ✅ allows sprint0, sprint1, sprintN

}
