import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { LoginService } from '../services/login-service/login.service';
import { LoginCredentials } from '../models/login.model';
import { ToastService } from '../shared/toast.service';

interface LoginState {
  loading: boolean;
  error: string | null;
  user: { role: string } | null;
}

@Injectable({
  providedIn: 'root' 
})
export class LoginStore extends ComponentStore<LoginState> {
  private toast = inject(ToastService);

  constructor(private auth: LoginService, private router: Router) {
    super({ loading: false, error: null,user:null });
  }

  login = this.effect((credentials$: Observable<LoginCredentials>) =>
  credentials$.pipe(
    switchMap(credentials =>
      this.auth.loginCheck(credentials).pipe(
        tap(({ user }) => {
          if (user) {
            
            const role = user.role?.toLowerCase(); 
            localStorage.setItem('userList', role);
            localStorage.setItem('userRole', role);
            if (role === 'manager') {
              this.router.navigate(['/dashboard']);
            } else if (role === 'employee') {
              this.router.navigate(['/employee-dashboard']);
            } else {
              this.toast.show('error', 'Unknown role.');
              return;
            }

            this.toast.show('success', 'Login successfully!');
          } else {
            this.toast.show('error', 'Invalid User name and password.');
          }
        }),
        tap(() => this.patchState({ loading: false }))
      )
    )
  )
);

}
