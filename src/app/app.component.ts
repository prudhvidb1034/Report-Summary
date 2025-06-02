import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { tap } from 'rxjs';
import { HeaderComponent } from './features/header/header.component';
import { LoginService } from './services/login-service/login.service';
import { ToastComponent } from './shared/toast/toast.component';
import { LoginStore } from './state/login.store';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, IonicModule, CommonModule, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {
  title = 'report-summary';
  showSideNav: boolean = false;
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/register';
  private readonly login = inject(LoginService);
  roles: any = ''
  private router = inject(Router)
  public loginService = inject(LoginService);
   private menuCtrl = inject(MenuController)
   userRole: string |undefined;
  isLoggedIn = true;
  private  loginStore = inject(LoginStore)
  
  // ngOnInit() {
    
  //   // this.userRole = localStorage.getItem('userRole') || '';

  //   this.loginStore.user$.pipe(
  //     tap(res => {
  //       console.log(res)
  //       this.userRole =res?.role.toLocaleLowerCase()
  //     }).subscribe()

  // }

  ngOnInit() {
    this.loginStore.user$.pipe(
      tap(res => {
        console.log(res);
        this.userRole = res?.role.toLocaleLowerCase();
      })
    ).subscribe();
  }
  


  navigateToWkSmry() {
    this.router.navigate(['/summary']).then(() => {
      this.menuCtrl.close();
    
      // this.menuCtrl.close();
    });
  }
  
//    toggleMenu() {
//   this.menuCtrl.toggle();
// }

navigatetoregister(){
  this.router.navigate(['/sign-up'])
}

}

