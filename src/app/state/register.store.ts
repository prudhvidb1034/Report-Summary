import { inject, Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, Observable, switchMap } from 'rxjs';
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

    readonly getRegisterData = this.effect((gettrigger$) =>
    gettrigger$.pipe(
      switchMap(() =>
        this.signup.getUsers().pipe(
          tapResponse(
            (data) => {
              const selectedTeamId = localStorage.getItem('selectedTeamId'); 
  
              const filtered = data.filter((item: any) =>
                item.role === 'Employee' &&
                item.teamId === selectedTeamId 
              );
  
              this.patchState({
                register: filtered.map((item: any) => ({
                  id: item.id,
                  employeeId: item.employeeId,
                  firstName: item.firstName,
                  lastName: item.lastName,
                  username: item.username,
                  password: item.password,
                  confirmPassword: item.confirmPassword,
                  role: item.role,
                  projectName: item.projectName?.projectname ?? '',
                })),
              });
            },
            (error) => this.patchState({ error: 'Failed to load team data' })
          )
        )
      )
    )
  );
  
  



}

