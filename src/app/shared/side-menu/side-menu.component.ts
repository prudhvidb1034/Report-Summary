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


  ngOnInit(){
         this.loginStore.user$.pipe(
          tap(res => {
            console.log(res)
            // this.fullName = `${res?.['firstName']}`+' '+`${res?.['lastName']}`;
            // console.log(this.fullName);
            this.userRole = res?.role.toLowerCase();
            console.log(this.userRole);
          })
        ).subscribe();

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
    this.router.navigate(['/register'])
  }
}
