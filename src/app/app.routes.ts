import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('../app/features/home/home.component').then((m) => m.HomeComponent),
    canActivate: [RoleGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('../app/features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'managers',
    loadComponent: () => import('./features/managers/managers.component').then((m) => m.ManagersComponent),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['superadmin'] }
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/project-management/list-info/list-info.component').then((m) => m.ListInfoComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/project-management/projects/projects.component').then((m) => m.ProjectListComponent),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['manager', 'superadmin'], breadcrumb: 'Projects' }
      },
      {
        path: 'employees/:id',
        loadComponent: () => import('./features/project-management/employees/employees.component').then((m) => m.EmployeesComponent),
        canActivate: [RoleGuard],
        data: { breadcrumb: 'EmployeeList' }
      }
    ]
  },
  {
    path: 'summary',
    loadComponent: () => import('./features/project-management/list-info/list-info.component').then((m) => m.ListInfoComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/project-management/summary/summary.component').then((m) => m.SummaryComponent),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['superadmin', 'manager', 'employee'] }
      },
      {
        path: 'task/:id',
        loadComponent: () => import('./features/project-management/task/task/task.component').then((m) => m.TaskComponent),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['manager', 'superadmin'] }
      },
      {
        path: 'project-status/:id',
        loadComponent: () => import('./features/project-management/project-status/project-status.component').then((m) => m.ProjectStatusComponent),
        canActivate: [RoleGuard],
      },
      {
        path: 'employee-dashboard',
        loadComponent: () => import('./pop-ups/employee-update/employee-update.component').then((m) => m.EmployeeUpdateComponent),
        canActivate: [RoleGuard],
        data: { expectedRoles: ['employee'] }
      },
    ]
  },
  {
    path: 'employees',
    loadComponent: () => import('./features/project-management/employees/employees.component').then((m) => m.EmployeesComponent),
    canActivate: [RoleGuard],
    data: { breadcrumb: 'EmployeeList' }
  },
  {
    path: 'accounts',
    loadComponent: () => import('./features/project-management/account/account.component').then((m) => m.AccountCreateComponent),
    canActivate: [RoleGuard],
  },
  {
    path: 'employee-dashboard',
    loadComponent: () => import('./pop-ups/employee-update/employee-update.component').then((m) => m.EmployeeUpdateComponent),
    canActivate: [RoleGuard],
    data: { expectedRoles: ['employee'] }
  },
  {
    path: 'not-authorized',
    loadComponent: () =>
      import('../app/features/not-authorized/not-authorized.component').then(
        (m) => m.NotAuthorizedComponent
      ),
  },
  {
    path: 'view-reports/:id',
    loadComponent: () => import('../app/shared/view-reports/view-reports.component').then((m) => m.ViewReportsComponent),
    canActivate: [RoleGuard],
  },
  {
    path: 'chat-ai',
    loadComponent: () => import('../app/features/ai-chatbot/ai-chatbot.component').then((m) => m.AiChatbotComponent),
    canActivate: [RoleGuard],
  },
   {
    path: 'sprint-report/:id',
    loadComponent: () => import('../app/features/sprint-report/sprint-report.component').then((m) => m.SprintReportComponent),
    canActivate: [RoleGuard],
  },
   {
    path: 'sprints',
    loadComponent: () => import('./features/sprints/sprints.component').then((m) => m.SprintsComponent),
    canActivate: [RoleGuard],
  },
   {
    path: 'sprints/create-weekly-sprint/:id',
    loadComponent: () => import('./features/weekly-report/weekly-report.component').then((m) => m.WeeklyReportComponent),
    canActivate: [RoleGuard],
  },
    {
    path: 'create-weekly-report-sprint/:id',
    loadComponent: () => import('./features/weekly-sprint-update/weekly-sprint-update.component').then((m) => m.WeeklySprintUpdateComponent),
    canActivate: [RoleGuard],
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'chat-ai',
    loadComponent: () => import('../app/features/ai-chatbot/ai-chatbot.component').then((m) => m.AiChatbotComponent)
  },
  // {
  //   path: '**',
  //   redirectTo: 'login',
  //   pathMatch: 'full',
  // },
 
];
