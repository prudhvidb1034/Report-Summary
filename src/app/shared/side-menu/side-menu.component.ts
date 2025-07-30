import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { LoginStore } from '../../state/login.store';
import { tap } from 'rxjs';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SideMenuComponent {
  private router = inject(Router);
  private menuCtrl = inject(MenuController);
  userRole: string | undefined;
  private loginStore = inject(LoginStore);

  menuItems = [
    {
      label: 'Home',
      icon: 'home',
      path: '/home',
      roles: ['superadmin', 'manager', 'employee'],
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
    },
    {
      label: 'Managers',
      icon: 'briefcase',
      path: '/managers',
      roles: ['superadmin'],
    },
    {
      label: 'Employees',
      icon: 'people',
      path: '/employees',
      roles: ['superadmin', 'manager'],
    },
    {
      label: 'Weekly Summary',
      icon: 'document-text',
      path: '/summary',
      roles: ['superadmin', 'manager', 'employee'],
    },
    {
      label: 'Sprints',
      icon: 'bookmark-outline',
      roles: ['superadmin', 'manager', 'employee'],
      isExpanded: false,
      children: [
        { label: 'Sprint', path: '/sprints' },
        { label: 'PI Outline', path: '/quaterly-standing' },
      ]
    },
    {
      label: 'AI',
      icon: 'document-text',
      path: '/chat-ai',
      roles: ['superadmin', 'manager', 'employee'],
    },
    {
      label: 'Settings',
      icon: 'settings',
      path: '/settings',
      roles: ['superadmin', 'manager'],
    },
  ];

  ngOnInit() {
    this.loginStore.user$.pipe(
      tap(res => {
        this.userRole = res?.role?.toLowerCase();
      })
    ).subscribe();
  }

onItemClick(item: any) {
  if (item.children) {
    this.toggleSubMenu(item); 
  } else {
    this.router.navigate([item.path]);
  }
}

toggleSubMenu(item: any) {
  this.menuItems.forEach(menu => {
    if (menu !== item && menu.children) {
      menu.isExpanded = false;
    }
  });
  item.isExpanded = !item.isExpanded;
}


  onChildItemClick(path: string) {
    this.router.navigate([path]).then(() => {
      this.menuCtrl.close(); // Close on child click
    });
  }
}
