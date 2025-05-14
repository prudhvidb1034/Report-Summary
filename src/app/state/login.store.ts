import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { LoginService } from '../services/login-service/login.service';
import { LoginCredentials } from '../models/login.model';

interface LoginState {
  loading: boolean;
  error: string | null;
}

@Injectable()
export class LoginStore extends ComponentStore<LoginState> {
  constructor(private auth: LoginService, private router: Router) {
    super({ loading: false, error: null });
  }

  login = this.effect((credentials$: Observable<LoginCredentials>) =>
  credentials$.pipe(
    switchMap(credentials =>
      this.auth.loginCheck(credentials).pipe(
        tap(({user})=>{
            if(user){
                if(user.userEntry==='existingUser'){
                    this.router.navigate(['/dashboard']);
                }else{
                    this.router.navigate(['/reset-password']);
                }
            }
            else{
                 this.patchState({ error: 'Invalid username or password' });
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
}
