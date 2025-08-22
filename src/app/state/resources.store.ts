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
    private _resourcesCreateStatus = signal<null | 'success' | 'deleted' | 'update' | 'error'>(null);

    readonly accountCreateStatus = this._resourcesCreateStatus.asReadonly();
    private toast = inject(ToastService);
    constructor() {
        super({ resources: [], loading: false, error: null });
    }

    readonly resources$ = this.select(state => state.resources);
    readonly loading$ = this.select(state => state.loading);
    readonly error$ = this.select(state => state.error);


    readonly createResource = this.effect((account$: Observable<any>) =>
        account$.pipe(
            exhaustMap(resources => {
                this.patchState({ loading: true, error: null });
                return this.sharedservice.postData(urls.CREATE_RESOURCES, resources).pipe(
                    tap({
                        next: (user: any) => {
                            this.patchState({ resources: [user], loading: false });
                            this._resourcesCreateStatus.set('success');
                        },
                        error: () => {
                            this.patchState({ loading: false, error: '' });
                            this._resourcesCreateStatus.set('error');
                        }
                    })
                );
            })
        )
    );

      readonly getResourcesWithType = this.effect<{ apiPath:string}>(
          trigger$ =>
              trigger$.pipe(
                  tap(() => this.patchState({ loading: true, error: null })),
                  switchMap(({apiPath }) =>
                      this.sharedservice.getData<any>(`${apiPath}`).pipe(
                          tapResponse(
                              (response) => 
                                 {
            const modifiedContent = response.data?.content?.map((res: any) => ({
              ...res,
              name:
                res.resourceType?.toLowerCase() === 'project'
                  ? res.projectName
                  : res.resourceType?.toLowerCase() === 'techstack'
                  ? res.techStack
                  : null
            })) || [];

            const updatedData = {
              ...response.data,
              content: modifiedContent
            };

            setTimeout(() => {
              this.patchState({ resources: updatedData, loading: false });
            }, 600);
          },


                                
                            //     {
                            //     setTimeout(()=>{
                            //     this.patchState({ resources: resources.data, loading: false });
                            //     },600)
                            //   },
                              (error) => {
                                  this.patchState({ loading: false, error: 'Failed to fetch resources' });
                                  this.toast.show('error', 'Failed to fetch resources!');
                              }
                          )
                      )
                  )
              )
      );


       readonly getResourcesByProjectOrTeckStack = this.effect<{ apiPath:string}>(
          trigger$ =>
              trigger$.pipe(
                  tap(() => this.patchState({ loading: true, error: null })),
                  switchMap(({apiPath }) =>
                      this.sharedservice.getData<any>(`${apiPath}`).pipe(
                          tapResponse(
                              (response) => 
 {
            const modifiedContent = response.data?.content?.map((res: any) => ({
              ...res,
              name:
                res.resourceType?.toLowerCase() === 'project'
                  ? res.projectName
                  : res.resourceType?.toLowerCase() === 'techstack'
                  ? res.techStack
                  : null
            })) || [];

            const updatedData = {
              ...response.data,
              content: modifiedContent
            };

            setTimeout(() => {
              this.patchState({ resources: updatedData, loading: false });
            }, 600);
          },



                            //     {
                            //     setTimeout(()=>{
                            //     this.patchState({ resources: resources.data, loading: false });
                            //     },600)
                            //   },
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
                                this._resourcesCreateStatus.set('update');
                                this.patchState({ loading: false });
                            },
                            error: () => {
                                this._resourcesCreateStatus.set('error');
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
                            this._resourcesCreateStatus.set('deleted');
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


    
readonly getAllResources = this.effect<{ apiPath: string }>(trigger$ =>
  trigger$.pipe(
    tap(() => this.patchState({ loading: true, error: null })),
    switchMap(({ apiPath }) =>
      this.sharedservice.getData<any>(`${apiPath}`).pipe(
        tapResponse(
          (response) => {
            const modifiedContent = response.data?.content?.map((res: any) => ({
              ...res,
              name:
                res.resourceType?.toLowerCase() === 'project'
                  ? res.projectName
                  : res.resourceType?.toLowerCase() === 'techstack'
                  ? res.techStack
                  : null
            })) || [];

            const updatedData = {
              ...response.data,
              content: modifiedContent
            };

            setTimeout(() => {
              this.patchState({ resources: updatedData, loading: false });
            }, 600);
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


    readonly updateResource = this.effect(
        (account$: Observable<{ id: string; data: any }>) =>
            account$.pipe(
                exhaustMap(({ id, data }) => {
                    this.patchState({ loading: true, error: null });
                    return this.sharedservice.patchData(`${urls.UPDATE_RESOURCE}/${id}`, data).pipe(
                        tap({
                            next: (updatedAccount: any) => {
                                this._resourcesCreateStatus.set('update');
                                this.patchState({ loading: false });
                            },
                            error: () => {
                                this._resourcesCreateStatus.set('error');
                                this.patchState({ loading: false, error: 'Failed to update account' });
                                this.toast.show('error', 'Update failed!');
                            }
                        })
                    );
                })
            )
    );


    readonly deleteResource = this.effect((accountId$: Observable<string>) =>
        accountId$.pipe(
            exhaustMap(id =>
                this.sharedservice.deleteData(`${urls.DELETE_RESOURCE}/${id}`).pipe(
                    tapResponse(
                        () => {
                            this._resourcesCreateStatus.set('deleted');
                            this.toast.show('success', 'Resource deleted successfully!');
                            // this.getAllResources({ apiPath: urls.GET_ALL_RESOURCES });

                        },
                        (error) => {
                            this.toast.show('error', 'Failed to delete resource!');
                        }
                    )
                )
            )
        )
    );

}