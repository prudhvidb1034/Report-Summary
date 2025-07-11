import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { LoginStore } from '../../state/login.store';
import { tap } from 'rxjs';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, IonicModule,],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  private router = inject(Router)
  private menuCtrl = inject(MenuController)
   userRole: string | undefined;
  private  loginStore = inject(LoginStore)

  constructor(){
 
  }


  menuItems = [
  {
    label: 'Home',
    icon: 'home',
    path: '/home',
    roles: ['superadmin', 'manager', 'employee'],
    isBottom: false
  },
     {
    label: 'Accounts',
    icon: 'key',
    path: '/accounts',
    roles: ['superadmin'],
    
  },
  {
    label: 'Projects',
    icon: 'book',
    path: '/projects',
    roles: ['superadmin', 'manager'],
    isBottom: false
  },
    {
    label: 'Managers',
    icon: 'briefcase',
    path: '/managers',
    roles: ['superadmin'],
    isBottom: false
  },
   {
    label: 'Employees',
    icon: 'people',
    path: '/employees',
    roles: ['superadmin','manager'],
    isBottom: false
  },
  {
    label: 'Weekly Summary',
    icon: 'document-text',
    path: '/summary',
    roles: ['superadmin', 'manager','employee'],
    isBottom: false
  },
   {
    label: 'Spring Report',
    icon: 'bookmark-outline',
    path: '/sprint-report',
    roles: ['superadmin', 'manager','employee'],
    isBottom: false
  },

  // {
  //   label: 'View Reports',
  //   icon: 'documents',
  //   path: '/project-status',
  //   roles: ['superadmin', 'manager'],
  //   isBottom: false
  // },
  {
    label: 'AI',
    icon: 'document-text',
    path: '/chat-ai',
    roles: ['superadmin', 'manager','employee'],
    isBottom: false
  },

  {
    label: 'Settings',
    icon: 'settings',
    path: '/settings',
    roles: ['superadmin', 'manager'],
    isBottom: true
  },
   {
    label: 'SprintHealth',
    icon: 'document-text',
    path: '/sprint-health',
    roles: ['superadmin', 'manager','employee'],
    isBottom: false
  },
];

  ngOnInit(){
         this.loginStore.user$.pipe(
          tap(res => {
            console.log(res)
            this.userRole = res?.role?.toLowerCase();
            console.log(this.userRole);
          })
        ).subscribe();

  }

  navigate(path: string) {
  this.router.navigate([path]).then(() => {
    this.menuCtrl.close();
  });
}

  navigateToWkSmry() {
    this.router.navigate(['/summary']).then(() => {
      this.menuCtrl.close();
    });
  }

  navigateToHome() {
    this.router.navigate(['/home']).then(() => {
      this.menuCtrl.close();
    });
  }


  navigateToDashboard() {
    this.router.navigate(['/projects']).then(() => {
      this.menuCtrl.close();
    });
  }

  navigateToManagerList() {
    this.router.navigate(['/register']).then(() => {
      this.menuCtrl.close();
    });
  }


  navigateViewAllProjects() {
    this.router.navigate(['/project-status'])
  }
  
  navigatetoregister() {
    this.router.navigate(['/managers'])
  }
  
  navigateViewAllSummary(){
    this.router.navigate(['/view-all-projects'])
  }
}
