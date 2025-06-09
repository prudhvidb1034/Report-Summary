import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, SimpleChanges } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { catchError, of, tap } from 'rxjs';
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
  fullName: any = ''
  private router = inject(Router)
  public loginService = inject(LoginService);
  private menuCtrl = inject(MenuController)
  userRole: string | undefined;
  isLoggedIn = true;
  private loginStore = inject(LoginStore);
  showIcons: any = '';

  // ngOnInit() {

  //   // this.userRole = localStorage.getItem('userRole') || '';

  //   this.loginStore.user$.pipe(
  //     tap(res => {
  //       console.log(res)
  //       this.userRole =res?.role.toLocaleLowerCase()
  //     }).subscribe()

  // }
  //  ngOnChnages(res:SimpleChanges){
  //     console.log(res)
  //   }
  ngOnInit() {
    this.loginStore.user$.pipe(
      tap(res => {
        console.log(res);
        this.fullName = `${res?.['firstName']} ${res?.['lastName']}`.trim(); // Added trim() to handle empty names
        this.userRole = res?.role?.toLowerCase();
        console.log('User Role:', this.userRole);
        console.log('fullName:', this.fullName);
        // Check if at least one exists (OR condition)
        if (!!this.fullName && !!this.userRole) {
          this.showIcons = true;
        }
        // console.log('showIcons', this.showIcons);

        // this.showIcons = hasAnyUserData; // true if either exists

        // Only navigate if BOTH are missing (AND condition)
        if ((!this.fullName && !this.userRole) || !res) {
          this.router.navigate(['/login']).then(() => {
            this.menuCtrl.close();
            console.log('User Role:', this.userRole);
            console.log('fullName:', this.fullName);
            console.log('Show Icons:', this.showIcons);
          }).catch(err => {
            console.error('Navigation error:', err);
          });
        }


      }),
      catchError(err => {
        console.error('Error in user stream:', err);
        this.showIcons = false;
        return of(null); // Continue the stream
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
    this.router.navigate(['/dashboard']).then(() => {
      this.menuCtrl.close();
    });
  }

  navigateToManagerList() {
    this.router.navigate(['/sign-up']).then(() => {
      this.menuCtrl.close();
    });
  }


  navigateViewAllProjects() {
    this.router.navigate(['/view-all-projects'])
  }
  navigatetoregister() {
    this.router.navigate(['/sign-up'])
  }
}

