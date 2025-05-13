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
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },


];
