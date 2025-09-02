// TODO: Replace with the actual Dependency interface/type if available
export interface Dependency {
  projectName: string;
  type: string;
  description: string;
  owner: string;
  date: string;
  statusIn: string;
  id: number;
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
}


export interface DependencyReport {
  content?: PiDependencyReport[];
}