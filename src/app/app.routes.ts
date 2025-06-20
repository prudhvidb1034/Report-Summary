import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('../app/features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('../app/features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'managers',
    loadComponent: () => import('./features/managers/managers.component').then((m) => m.ManagersComponent),
    canActivate: [RoleGuard],
    data: { expectedRoles: 'superadmin' }
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
        path: 'employees',
        loadComponent: () => import('./features/project-management/employees/employees.component').then((m) => m.EmployeesComponent),
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
        data: { expectedRole: 'superadmin' }
      },
      {
        path: 'task/:id',
        loadComponent: () => import('./features/project-management/task/task/task.component').then((m) => m.TaskComponent),
        canActivate: [RoleGuard],
        data: { expectedRole: ['manager', 'superadmin'] }
      },
      {
        path: 'project-status/:id',
        loadComponent: () => import('./features/project-management/project-status/project-status.component').then((m) => m.ProjectStatusComponent)
      },
    ]
  },
  {
    path: 'employees',
    loadComponent: () => import('./features/project-management/employees/employees.component').then((m) => m.EmployeesComponent),
    data: { breadcrumb: 'EmployeeList' }
  },
  {
    path: 'employee-dashboard',
    loadComponent: () => import('./pop-ups/employee-update/employee-update.component').then((m) => m.EmployeeUpdateComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: 'employee' }
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
    loadComponent: () => import('../app/shared/view-reports/view-reports.component').then((m) => m.ViewReportsComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'view-reports/:id',
    loadComponent: () => import('../app/shared/view-reports/view-reports.component').then((m) => m.ViewReportsComponent)
  },
  // {
  //   path: '**',
  //   redirectTo: 'login',
  //   pathMatch: 'full',
  // },
];
