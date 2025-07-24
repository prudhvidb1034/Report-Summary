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

export interface WeeklyEntry {
  weekId: number;
  weekStartDate: string; // ISO format date, e.g., "2025-07-14"
  weekEndDate: string;   // ISO format date
  upcomingTasks: string[];
  projectNames: string[];
  weekRange: string;     // Formatted date range string
}

