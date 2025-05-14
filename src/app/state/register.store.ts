import { inject, Injectable } from '@angular/core';
import { ComponentStore,tapResponse } from '@ngrx/component-store';
import { Router } from '@angular/router';
import { catchError, exhaustMap, Observable, switchMap, tap } from 'rxjs';
import { LoginService } from '../services/login-service/login.service';
import { LoginCredentials } from '../models/login.model';
import { RegistrationForm } from '../models/register.mode';
import { HttpClient } from '@angular/common/http';
import { SignUpService } from '../services/sign-up/sign-up.service';

// interface Employee {
//   id?: number;
//   firstName: string;
//   lastName: string;
//   empId: string;
//   email: string;
// }

export interface RegistrationState {
    register: RegistrationForm[];
    loading: boolean;
    error: string | null;
}

// interface RegistrationState {
//   form: Omit<Employee, 'id'>;
//   isLoading: boolean;
//   error: string | null;
//   isSuccess: boolean;
//   employees: Employee[];
// }

// const initialState: RegistrationState = {
//   form: {
//     firstName: '',
//     lastName: '',
//     empId: '',
//     email: '',
//   },
//   isLoading: false,
//   error: null,
//   isSuccess: false,
//   employees: [],
// };

@Injectable()
export class RegisterStore extends ComponentStore<RegistrationState> {

    //  private readonly http = inject(HttpClient);
    //  private readonly apiUrl = 'http://localhost:3000/register';

private signup = inject(SignUpService);

    constructor() {
        super({ register: [], loading: false, error: null });
    }

     readonly register$ = this.select(state => state.register);
    readonly loading$ = this.select(state => state.loading);
    readonly error$ = this.select(state => state.error);
 readonly addregister = this.effect((register$: Observable<RegistrationForm>) =>
        register$.pipe(
            exhaustMap(register => {
                debugger
                this.patchState({ loading: true, error: null });
                return this.signup.registerUser(register).pipe(
                    tapResponse(
                        (savedData) => {
                            this.patchState(state => ({
                                register : [...state.register, savedData],
                                loading: false,
                                error: null
                            }));
                        },
                        (error: any) => {
                            this.patchState({
                                loading: false,
                                error: error?.message ?? 'Unknown error'
                            });
                        }
                    )
                );
            })
        )
    );
}

