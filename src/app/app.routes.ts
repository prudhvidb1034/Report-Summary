import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'login',
   loadComponent: () => import('../app/features/login/login.component').then((m) => m.LoginComponent),

  },
  {
    path: 'sign-up',
    loadComponent: () => import('../app/features/sign-up/sign-up.component').then((m) => m.SignUpComponent),
  },
  {
    path: 'dashboard',
   loadComponent: () => import('../app/features/dashboard/dashboard.component').then((m) => m.DashboardComponent),

  },
  {
    path: 'project/:id',
    loadComponent: () => import('../app/features/projects/projects.component').then((m) => m.ProjectsComponent),
  },
  {
    path: 'summary',
    loadComponent: () => import('../app/features/summary/summary.component').then((m) => m.SummaryComponent)
  },
   {
    path: 'employee-update',
    loadComponent: () => import('../app/features/employee-update/employee-update.component').then((m) => m.EmployeeUpdateComponent)
  },
 
 { 
   
  path:'view-reports',
  loadComponent:() => import('../app/shared/view-reports/view-reports.component').then((m)=>m.ViewReportsComponent)

},
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
