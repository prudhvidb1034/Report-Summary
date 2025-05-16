import { inject, Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, Observable } from 'rxjs';
import { RegistrationForm } from '../models/register.mode';
import { SignUpService } from '../services/sign-up/sign-up.service';


export interface RegistrationState {
    register: RegistrationForm[];
    loading: boolean;
    error: string | null;
}


@Injectable()
export class RegisterStore extends ComponentStore<RegistrationState> {


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
                this.patchState({ loading: true, error: null });
                return this.signup.registerUser(register).pipe(
                    tapResponse(
                        (savedData) => {
                            this.patchState(state => ({
                                register: [...state.register, savedData],
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

