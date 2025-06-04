import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';



export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../app/features/login/login.component').then((m) => m.LoginComponent),

  },
  {
    path: 'sign-up',
    loadComponent: () => import('../app/features/sign-up/sign-up.component').then((m) => m.SignUpComponent),
     canActivate: [RoleGuard],
    data: { expectedRole: 'superadmin' }
  },
  {
    path: 'dashboard',
    loadComponent: () => import('../app/features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [RoleGuard],
     data: { expectedRoles: ['manager', 'superadmin'] }

  },
  {
    path: 'project/:id',
    loadComponent: () => import('../app/features/projects/projects.component').then((m) => m.ProjectsComponent),
  },
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
    path: 'view-all-projects',
    loadComponent: () => import('../app/features/view-all-projects/view-all-projects.component').then((m) => m.ViewAllProjectsComponent)
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
