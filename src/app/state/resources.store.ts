import { inject, Injectable, signal } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { debounceTime, exhaustMap, Observable, switchMap, tap } from 'rxjs';
import { createAccountForm } from '../models/account.model';
import { SharedService } from '../services/shared/shared.service';
import { urls } from '../constants/string-constants';
import { ToastService } from '../shared/toast.service';

export interface resourcesState {
    resources: any;
    loading: boolean;
    error: string | null;
}
interface ApiResponse<T> {
    data: T;
}


@Injectable()
export class ResourcesStore extends ComponentStore<resourcesState> {
    private sharedservice = inject(SharedService);
    private _dependencyCreateStatus = signal<null | 'success' | 'deleted' | 'update' | 'error'>(null);

    readonly accountCreateStatus = this._dependencyCreateStatus.asReadonly();
    private toast = inject(ToastService);
    constructor() {
        super({ resources: [], loading: false, error: null });
    }

    readonly resources$ = this.select(state => state.resources);
    readonly loading$ = this.select(state => state.loading);
    readonly error$ = this.select(state => state.error);


    readonly createDepencency = this.effect((account$: Observable<any>) =>
        account$.pipe(
            exhaustMap(account => {
                this.patchState({ loading: true, error: null });
                return this.sharedservice.postData(urls.CREATE_ACCOUNT, account).pipe(
                    tap({
                        next: (user: any) => {
                            this.patchState({ resources: [user], loading: false });
                            this._dependencyCreateStatus.set('success');
                        },
                        error: () => {
                            this.patchState({ loading: false, error: '' });
                            this._dependencyCreateStatus.set('error');
                        }
                    })
                );
            })
        )
    );

      readonly getResources = this.effect<{ page: number; size: number;}>(
          trigger$ =>
              trigger$.pipe(
                  tap(() => this.patchState({ loading: true, error: null })),
                  switchMap(({ page, size }) =>
                      this.sharedservice.getLocalData<any>(urls.GET_RESOURCES_DETAILS).pipe(
                          tapResponse(
                              (resources) => {
                                setTimeout(()=>{
                                this.patchState({ resources: resources.data, loading: false });
                                },600)
                              },
                              (error) => {
                                  this.patchState({ loading: false, error: 'Failed to fetch resources' });
                                  this.toast.show('error', 'Failed to fetch resources!');
                              }
                          )
                      )
                  )
              )
      );





    readonly updateDependencies = this.effect(
        (account$: Observable<{ id: string; data: any }>) =>
            account$.pipe(
                exhaustMap(({ id, data }) => {
                    this.patchState({ loading: true, error: null });
                    return this.sharedservice.patchData(`${urls.CREATE_ACCOUNT}/${id}`, data).pipe(
                        tap({
                            next: (updatedAccount: any) => {
                                this._dependencyCreateStatus.set('update');
                                this.patchState({ loading: false });
                            },
                            error: () => {
                                this._dependencyCreateStatus.set('error');
                                this.patchState({ loading: false, error: 'Failed to update account' });
                                this.toast.show('error', 'Update failed!');
                            }
                        })
                    );
                })
            )
    );


    readonly deleteDepedency = this.effect((accountId$: Observable<string>) =>
        accountId$.pipe(
            exhaustMap(id =>
                this.sharedservice.deleteData(`${urls.CREATE_ACCOUNT}/${id}`).pipe(
                    tapResponse(
                        () => {
                            this._dependencyCreateStatus.set('deleted');
                            // this.getDependencies({ page: 0, size: 5, sortBy: 'accountName' });
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