import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Router } from '@angular/router';
import { exhaustMap, finalize, Observable, switchMap, tap } from 'rxjs';
import { LoginService } from '../services/login-service/login.service';
import { LoginCredentials, User } from '../models/login.model';
import { ToastService } from '../shared/toast.service';
import { SharedService } from '../services/shared/shared.service';
import { urls } from '../constants/string-constants';
// Import or define LOGIN_DETAILS


interface LoginState {
  loading: boolean;
  error: string | null;
  user: User | null;
}

const initialState: LoginState={
   loading: false, error: null, user: null 
}

@Injectable({
  providedIn: 'root'
})
export class LoginStore extends ComponentStore<LoginState> {
  private toast = inject(ToastService);
  private sharedservice = inject(SharedService)
  constructor(private auth: LoginService, private router: Router) {
    super(initialState);
  }

login = this.effect((credentials$: Observable<LoginCredentials>) =>
  credentials$.pipe(
    exhaustMap(credentials => {
      this.patchState({ loading: true, error: null }); 

      return this.sharedservice.postData(urls.LOGIN_DETAILS, credentials).pipe(
        tap({
          next: (user: any) => {
            if (user) {
              this.patchState({ user }); // Save user state
              localStorage.setItem('user', JSON.stringify(user.data));
              localStorage.setItem('token', user.data.acessToken); 
              this.router.navigate(['/home']);
              this.toast.show('success', 'Login successfully!');
            } else {
              this.toast.show('error', 'Invalid username or password.');
            }
          },
          error: () => {
            this.toast.show('error', 'Login failed. Please try again.');
            this.patchState({ error: 'Login failed.' }); // Optionally add error msg
          }
        }),
        finalize(() => this.patchState({ loading: false })) // 🔁 Always stop loading
      );
    })
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
    readonly clearAll = this.updater(() => initialState);
 readonly loading$ = this.select(state => state.loading);
}
