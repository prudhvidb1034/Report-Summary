import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { map } from 'rxjs';
import { HeaderComponent } from './shared/header/header.component';
import { ToastComponent } from './shared/toast/toast.component';
import { LoginStore } from './state/login.store';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';
import { CommonStore } from './state/common.store';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, IonicModule, CommonModule, ToastComponent, SideMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {
  title = 'report-summary';
  showSideNav: boolean = false;
  isLoggedIn = true;
  private  loginStore = inject(LoginStore);
  private commonStore=inject(CommonStore);


  ngOnInit(){
       this.commonStore.getAllProjects();
  }
  fullName$ = this.loginStore.user$.pipe(
    map(res =>  `${res?.['firstName']}`+' '+`${res?.['lastName']}`)
  );

  userRole$ = this.loginStore.user$.pipe(
    map(res => res?.role?.toLocaleLowerCase())
  );

  isUserLoggedIn$ = this.loginStore.user$.pipe(
    map(res => !!(res?.role))
  );

}   

