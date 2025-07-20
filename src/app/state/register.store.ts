import { inject, Injectable, signal } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, Observable, switchMap, tap } from 'rxjs';
import { RegistrationForm } from '../models/register.mode';
import { RegisterService } from '../services/register-service/register.service';
import { SharedService } from '../services/shared/shared.service';
import { urls } from '../constants/string-constants';
import { NavParams } from '@ionic/angular';
import { ToastService } from '../shared/toast.service';


export interface RegistrationState {
  register: RegistrationForm[];
  loading: boolean;
  error: string | null;
}

interface ApiResponse<T> {
  data: T;
}
@Injectable()
export class RegisterStore extends ComponentStore<RegistrationState> {
  role: string | undefined;
  private _accountCreateStatus = signal<null | 'success' | 'deleted' | 'update' | 'error'>(null);

  readonly accountCreateStatus = this._accountCreateStatus.asReadonly();
  private register = inject(RegisterService);
  private sharedservice = inject(SharedService)

  constructor() {
    super({ register: [], loading: false, error: null });


  }
  private toast = inject(ToastService);
  readonly register$ = this.select(state => state.register);
  readonly loading$ = this.select(state => state.loading);
  readonly error$ = this.select(state => state.error);
  readonly addregister = this.effect((register$: Observable<RegistrationForm>) =>
    register$.pipe(
      exhaustMap(register => {
        this.patchState({ loading: true, error: null });
        return this.sharedservice.postData(urls.CREATE_PERSON, register).pipe(
          tap({
            next: (user: any) => {
              this.patchState({ register: [user], loading: false });
              this._accountCreateStatus.set('success');

            },
            error: () => {
              this.patchState({ loading: false, error: '' });
              this._accountCreateStatus.set('error');
            }
          })
        );
      })
    )
  );




  readonly getRegisterData = this.effect<{ page: number; size: number; sortBy: string }>( // Accepts 'manager' or 'employee' directly
    trigger$ =>
      trigger$.pipe(
        tap(() => this.patchState({ loading: true, error: null })),
        switchMap(({ page, size, sortBy }) =>
          this.sharedservice.getData<ApiResponse<RegistrationForm[]>>(`Person/role/MANAGER?page=${page}&size=${size}&sortBy=${sortBy}`).pipe( // Append to URL
            tapResponse(
              (manager) => {
                this.patchState({ register: manager.data, loading: false });
              },
              (error) => {
                this.patchState({ loading: false, error: 'Failed to fetch accounts' });
              }
            )
          )
        )
      )
  );



  readonly updateperson = this.effect(
    (account$: Observable<{ id: string; data: RegistrationForm }>) =>
      account$.pipe(
        exhaustMap(({ id, data }) => {
          this.patchState({ loading: true, error: null });
          return this.sharedservice.patchData(`${urls.CREATE_PERSON}/${id}`, data).pipe(
            tap({
              next: (updatedAccount: any) => {
                this._accountCreateStatus.set('update');
                this.patchState({ loading: false });
              },
              error: () => {
                this._accountCreateStatus.set('error');
                this.patchState({ loading: false, error: 'Failed to update account' });
                this.toast.show('error', 'Update failed!');
              }
            })
          );
        })
      )
  );

  readonly deleteProject = this.effect((projectId$: Observable<string>) =>
    projectId$.pipe(
      exhaustMap(id =>
        this.sharedservice.deleteData(`${urls.CREATE_PERSON}/${id}`).pipe(
          tapResponse(
            () => {
              this._accountCreateStatus.set('deleted');
              if (this.role === 'manager') {
                this.getRegisterData({ page: 0, size: 5, sortBy: 'firstName' });
              } else if (this.role === 'employee') {
                this.getRegisterData({ page: 0, size: 5, sortBy: 'firstName' });
              }
              this.toast.show('success', 'Account deleted successfully!');
            },
            (error) => {
              this.toast.show('error', 'Failed to delete account!');
            }
          )
        )
      )
    )
  );




}

