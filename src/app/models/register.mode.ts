export interface RegistrationForm {
  confirmPassword: string;
  username: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  projectId?: number;
  projectName?:string;
  techstack?:string;
  personId: string;
}


 export interface CreatePersonResponse {
  code: string;          
  statusType: string;     
  message: string;
  data: Person;     
  timestamp: string;     
}

 export interface Person {
  personId: string;
  firstName: string;
  lastName: string;
  username: string;
  employeeId: string;
  email: string;
  employeeCode: string;
  password: string;       
  confirmPassword: string; 
  role: string;            
  techStack: string;
  projectIds: number[];
  projectNames: string[];
}
