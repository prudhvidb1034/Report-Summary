import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { LoginService } from '../services/login-service/login.service';
import { LoginCredentials, User } from '../models/login.model';
import { ToastService } from '../shared/toast.service';

interface LoginState {
  loading: boolean;
  error: string | null;
  user: User | null;
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
            this.patchState({
              user
            })
            const role = user.role?.toLowerCase(); 
            
            // localStorage.setItem('userList', role);
            // localStorage.setItem('', role);
            if (role === 'manager' || role === 'superadmin') {
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

  //   readonly login = this.effect((credentials$) =>
  //     credentials$.pipe(
  //       tap(() => this.setState({ loading: true, error: null })),
  //       switchMap(credentials =>
  //         this.auth.loginCheck(credentials).pipe(
  //           tap(({ user }) => {
  //             if (user) {
  //               if (user.userEntry === 'existingUser') {
  //                 this.router.navigate(['/dashboard']);
  //               } else {
  //                 this.router.navigate(['/reset-password']);
  //               }
  //             } else {
  //               this.patchState({ error: 'Invalid username or password' });
  //             }
  //           }),
  //           tap(() => this.patchState({ loading: false }))
  //         )
  //       )
  //     )
  //   );

  readonly user$ = this.select(state => state.user);
}
