import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { HeaderComponent } from './features/header/header.component';
import { LoginService } from './services/login-service/login.service';
import { ToastComponent } from './shared/toast/toast.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, IonicModule, CommonModule,ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {
   private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/register';
  private readonly login = inject(LoginService);
  roles: any = ''
  private router = inject(Router)
  public loginService = inject(LoginService);
   private menuCtrl = inject(MenuController)
   userRole: string = '';
  isLoggedIn = true;
 
  
  ngOnInit() {
    
    this.userRole = localStorage.getItem('userRole') || '';

  }


  navigateToWkSmry() {
    this.router.navigate(['/summary']).then(() => {
    
      // this.menuCtrl.close();
    });
  }
  
//    toggleMenu() {
//   this.menuCtrl.toggle();
// }
}


