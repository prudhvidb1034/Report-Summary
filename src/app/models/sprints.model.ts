// TODO: Replace with the actual Dependency interface/type if available
export interface Dependency {
  projectName: string;
  type: string;
  description: string;
  owner: string;
  date: string;
  statusIn: string;
  id: string;
  impact: string;
  actionTaken: string;
}

export interface PiDependencyReport {
  projectId: number;
  teamLead: string;
  assignedSP: number;
  projectName: string
  completedSP: number;
  reportId: string;
  completionPercentage: number;
  snapshotDate:string;
}


export interface DependencyReport {
  content?: PiDependencyReport[];
  last:boolean,
  pageNumber: number,
  pageSize: number,
  totalElements: number,
  totalPages: number

}

export interface QuaterlyReport {
  id?: string;
  projectId: number;
  feature: string;
  selectedSprints: string[];
  piNumber: string;
  completionPercentage: number;
  statusReport: string;
}

export interface weeklySprintRelease {
  projectName: string,
  major: number,
  minor: number,
  incidentCreated: number,
  releaseInformation: string,
  weekId: string,
  sprintId: number,
  releaseId: string,
  projectId: number,

}
export interface WeeklySprintReleaseResponse {

  item: weeklySprintRelease;
}
export interface weeklySprintRelease {

  id?: string,

  weekSprintId: string,
  sprintNumber: string,
  weeekRangeId: number,
  projectId: number,
  projectName: string,
  assignedPoints: number,
  assignedStoriesCount: number,
  inDevPoints: number,
  inDevStoriesCount: number,
  inQaPoints: number,
  inQaStoriesCount: number,
  completePoints: number,
  completeStoriesCount: number,
  blockedPoints: number,
  blockedStoriesCount: number,
  completePercentage: number,
  estimationHealth: string,
  groomingHealth: string,
  difficultCount1: number,
  difficultCount2: number,
  riskPoints: number,
  riskStoryCounts: number,
  comments: string,
  injectionPercentage: number,
  estimationHealthStatus: number,
  groomingHealthStatus: number

}
export interface WeeklySprintcreationResponse {
  weeekRangeId: number;
  item: weeklySprintRelease;
}