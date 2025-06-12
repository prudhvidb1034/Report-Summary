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
        data: { expectedRoles: ['manager', 'superadmin'], breadcrumb: 'Projects'}
      },
      {
        path: 'employees',
        loadComponent: () => import('./features/project-management/employees/employees.component').then((m) => m.EmployeesComponent),
        data: { breadcrumb: 'EmployeeList' }
      }
    ]
  },
  // {
  //   path: 'project/:id',
  //   loadComponent: () => import('../app/features/projects/projects.component').then((m) => m.ProjectsComponent),
  //   data: { breadcrumb: 'EmployeeList' }
  // },
  {
    path: 'summary',
    loadComponent: () => import('../app/features/summary/summary.component').then((m) => m.SummaryComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: 'manager' }
  },
  {
    path: 'employee-dashboard',
    loadComponent: () => import('../app/features/employee-update/employee-update.component').then((m) => m.EmployeeUpdateComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: 'employee' }

  },

  {
    path: 'not-authorized',
    loadComponent: () =>
      import('../app/features/not-authorized/not-authorized.component').then(
        (m) => m.NotAuthorizedComponent
      ),
  }
  ,

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
  {
    path: 'project-status',
    loadComponent: () => import('../app/features/project-status/project-status.component').then((m) => m.ProjectStatusComponent)
  },
  // {
  //   path: '**',
  //   redirectTo: 'login',
  //   pathMatch: 'full',
  // },
];
