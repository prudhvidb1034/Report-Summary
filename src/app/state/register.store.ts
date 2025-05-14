import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, tap } from 'rxjs';
import { LoginService } from '../services/login-service/login.service';
import { LoginCredentials } from '../models/login.model';
import { RegistrationForm } from '../models/register.mode';
import { HttpClient } from '@angular/common/http';

interface RegistrationState {
  form: RegistrationForm;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}
 const initialState: RegistrationState  = {
  form: {
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    confirmPassword:'',
    password:'',
    role:'Manager',
    id:''
  },
  isLoading: false,
  error: null,
  isSuccess: false,
};

@Injectable()
export class RegisterStore extends ComponentStore<RegistrationState> {

     private readonly http = inject(HttpClient);

  constructor() {
    super(initialState);
  }
//   constructor(private auth: LoginService, private router: Router) {
//     super({ loading: false, error: null });
//   }


  // Selectors
  readonly form$ = this.select((state) => state.form);
  readonly isLoading$ = this.select((state) => state.isLoading);
  readonly error$ = this.select((state) => state.error);
  readonly isSuccess$ = this.select((state) => state.isSuccess);

 // Updaters
  readonly updateForm = this.updater((state, form: Partial<RegistrationForm>) => ({
    ...state,
    form: { ...state.form, ...form },
  }));

    readonly setLoading = this.updater((state, isLoading: boolean) => ({
    ...state,
    isLoading,
  }));

  readonly setError = this.updater((state, error: string | null) => ({
    ...state,
    error,
  }));

  readonly setSuccess = this.updater((state, isSuccess: boolean) => ({
    ...state,
    isSuccess,
  }));

   // Effects

  // Effects
  readonly submitForm = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.setLoading(true);
        this.setError(null);
        this.setSuccess(false);
      }),
      switchMap(() => {
        const form = this.get().form;
        console.log(form)
        return this.http.post('https://jsonplaceholder.typicode.com/posts', form).pipe(
          tap({
            next: () => {
              this.setLoading(false);
              this.setSuccess(true);
            },
            error: (error) => {
              this.setLoading(false);
              this.setError(error.message || 'Failed to submit form');
            },
          }),
        );
      })
    )
  );
}
