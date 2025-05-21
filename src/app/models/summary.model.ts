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
  
