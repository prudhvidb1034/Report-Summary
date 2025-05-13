export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface User {
    role: string;
    empId: string;
    userEntry: 'existingUser' | 'new';
    userName: string;
    password: string;
  }
  
  export interface LoginResponse {
    userList: User[];
  }
 
   