import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { LoginService } from '../services/login-service/login.service';
import { LoginCredentials } from '../models/login.model';
import { ToastService } from '../shared/toast.service';

interface LoginState {
  userList: any[] | null;
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class LoginStore extends ComponentStore<LoginState> {
  private toast = inject(ToastService);

  constructor(private auth: LoginService, private router: Router) {
    super({ loading: false, error: null, userList: null });
  }
  readonly userList$ = this.select((state) => state.userList); // <--- ADD THIS LINE

  // Updater to set the user list
  readonly setUserList = (userList: any) => {
    this.patchState({
      userList
    })
  }

  // Updater to set the loading state
  readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading,
  }));

  // Updater to set the error state
  readonly setError = this.updater((state, error: string | null) => ({
    ...state,
    error,
  }));

  // Effect to handle login
  readonly login = this.effect((credentials$: Observable<LoginCredentials>) =>
    credentials$.pipe(
      tap(() => this.setLoading(true)), // Set loading to true before login attempt
      switchMap((credentials) =>
        this.auth.loginCheck(credentials).pipe(
          tap({
            next: ({ user }) => {
              if (user) {
                this.setUserList([user]);

                // Update user list on successful login
               // console.log(this.get()); // Logs the current state

                this.router.navigate(['/dashboard']);
                this.toast.show('success', 'Login successfully!');
              } else {
                this.setError('Invalid username or password');
                this.toast.show('error', 'Invalid username or password');
              }
            },
            error: (err) => {
              this.setError('An error occurred during login');
              this.toast.show('error', 'An error occurred during login');
            },
            complete: () => this.setLoading(false), // Set loading to false after login attempt
          })
        )
      )
    )
  );
}
