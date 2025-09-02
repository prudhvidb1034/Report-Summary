import { inject, Injectable, signal } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, Observable, switchMap, tap } from 'rxjs';
import { CreatePersonResponse, Person } from '../models/register.mode';
import { SharedService } from '../services/shared/shared.service';
import { Constants, urls } from '../constants/string-constants';
import { ToastService } from '../shared/toast.service';


export interface RegistrationState {
  register: Person[];
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
  private sharedservice = inject(SharedService)

  constructor() {
    super({ register: [], loading: false, error: null });


  }
  private toast = inject(ToastService);
  public register$ = this.select(state => state.register);
  public loading$ = this.select(state => state.loading);
  readonly error$ = this.select(state => state.error);
  readonly addregister = this.effect((register$: Observable<Person>) =>
    register$.pipe(
      exhaustMap(register => {
        this.patchState({ loading: true, error: null });
        return this.sharedservice.postData<CreatePersonResponse>(urls.CREATE_PERSON, register).pipe(
          tapResponse(
            (user: CreatePersonResponse) => {
              const Person: Person = {
                ...register,
                ...user.data
              };
              this.patchState({ register: [Person], loading: false });
              this._accountCreateStatus.set('success');
            },
            () => {
              this.patchState({ loading: false, error: '' });
              this._accountCreateStatus.set('error');
            }
          )
        );
      })
    )
  );




  readonly getRegisterData = this.effect<{ page: number; size: number; sortBy: string,url:string}>( // Accepts 'manager' or 'employee' directly
    trigger$ =>
      trigger$.pipe(
        tap(() => this.patchState({ loading: true, error: null })),
        switchMap(({ page, size, sortBy,url }) =>
          this.sharedservice.getData<ApiResponse<Person[]>>(`${url}?page=${page}&size=${size}&sortBy=${sortBy}`).pipe( // Append to URL
            tapResponse(
              (manager) => {
                this.patchState({ register: manager.data, loading: false });
              },
              () => {
                this.patchState({ loading: false, error: 'Failed to fetch accounts' });
              }
            )
          )
        )
      )
  );



  readonly updateperson = this.effect(
    (account$: Observable<{ id: string; data: Person }>) =>
      account$.pipe(
        exhaustMap(({ id, data }) => {
          this.patchState({ loading: true, error: null });
          return this.sharedservice.patchData(`${urls.CREATE_PERSON}/${id}`, data).pipe(
            tap({
              next: () => {
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
                this.getRegisterData({ page: 0, size: 5, sortBy: 'firstName', url:Constants.ROLE_MANAGER});
              } else if (this.role === 'employee') {
                this.getRegisterData({ page: 0, size: 5, sortBy: 'firstName',url:Constants.ROLE_EMPLOYEE});
              }
              this.toast.show('success', 'Account deleted successfully!');
            },
            () => {
              this.toast.show('error', 'Failed to delete account!');
            }
          )
        )
      )
    )
  );




}

