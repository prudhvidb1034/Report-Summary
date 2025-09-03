export interface DailyUpdate {
  date: string;
  status: string;
  comments: string;
}

export interface Employee {
  employee_id: string;
  employee_name: string;
  daily_updates: DailyUpdate[];
}

export interface Project {
  project_id: string;
  project_name: string;
  start_date: string;
  end_date: string;
  employees: Employee[];
}

export interface WeeklyDataResponse {
  data: WeeklyData;
}

export interface WeeklyData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  content: WeeklyEntry[];
}

// export interface WeeklyEntry {
//   weekId: number;
//   weekNo: number
//   weekStartDate: string; // ISO format date, e.g., "2025-07-14"
//   weekEndDate: string;   // ISO format date
//   upcomingTasks: string[];
//   projectNames: string[];
//   weekRange: string; 
//   status: string;    // Formatted date range string
// }

// export interface WeeklyEntry {
//   weekId: string;
//   weekNo: number;
//   status: string;
//   viewTask: string;
//   viewReport: string;
//   weekStartDate?: string;
//   weekEndDate?: string;
//   upcomingTasks?: string[];
//   projectNames?: string[];
//   weekRange?: string;
// }

export interface WeeklyEntry {
  weekId: string;
  weekNo: number;
  status: string;
  viewTask: string;
  viewReport: string;
  weekStartDate?: string;
  weekEndDate?: string;
  upcomingTasks?: string[];
  projectNames?: string[];
  weekRange: { weekFromDate: string; weekToDate: string };
}



