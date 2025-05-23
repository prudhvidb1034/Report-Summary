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
  title = 'report-summary';

  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/register';
  private readonly login = inject(LoginService);
  roles: any = ''
  private router = inject(Router)
  public loginService = inject(LoginService);
   private menuCtrl = inject(MenuController)

  isLoggedIn = true;
  ngOnInit() {
    // this.loginService.loginCheck().subscribe((s) => {
    //   console.log(s);
    // })
  }


  navigateToWkSmry() {
    this.router.navigate(['/summary'])
    
  }
  navigateToEmployeeUpdate() {
    this.router.navigate(['/employee-update'])
  
  }

  toggleMenu() {
  this.menuCtrl.toggle();
}
}
