import { inject, Injectable, signal } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { debounceTime, exhaustMap, map, Observable, switchMap, tap } from 'rxjs';
import { createAccountForm } from '../models/account.model';
import { SharedService } from '../services/shared/shared.service';
import { urls } from '../constants/string-constants';
import { ToastService } from '../shared/toast.service';

export interface QuaterlyReport {
    quaterlyReport: any;
    loading: boolean;
    error: string | null;
}
interface ApiResponse<T> {
    data: T;
}


@Injectable()
export class QuaterlyReportStore extends ComponentStore<QuaterlyReport> {
    private sharedservice = inject(SharedService);
    private _accountCreateStatus = signal<null | 'success' | 'deleted' | 'update' | 'error'>(null);

    readonly accountCreateStatus = this._accountCreateStatus.asReadonly();
    private toast = inject(ToastService);
    constructor() {
        super({ quaterlyReport: [], loading: false, error: null });
    }

    readonly quaterlyReport$ = this.select(state => state.quaterlyReport);
    readonly loading$ = this.select(state => state.loading);
    readonly error$ = this.select(state => state.error);


    readonly createQuaterlyReport = this.effect((quaterlyReport$: Observable<createAccountForm>) =>
        quaterlyReport$.pipe(
            exhaustMap(account => {
                console.log(account);

                this.patchState({ loading: true, error: null });
                return this.sharedservice.postData(`api/pi-standing`, account).pipe(
                    tap({
                        next: (user: any) => {
                            console.log(user);
                            
                            this.patchState({ quaterlyReport: user, loading: false });
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

    // readonly getQuaterlyReports = this.effect<({ page?: number; size?: number})>( trigger$ =>
    //         trigger$.pipe(
    //             tap(() => this.patchState({ loading: true, error: null })),
    //             switchMap(({ page, size}) =>
    //                 this.sharedservice.getData<ApiResponse<any[]>>(`api/pi-standing`).pipe(
    //                     tapResponse(
    //                         (quaterlyReport) => {
    //                             this.patchState({ quaterlyReport: quaterlyReport.data, loading: false });
    //                         },
    //                         (error) => {
    //                             this.patchState({ loading: false, error: 'Failed to fetch accounts' });
    //                             this.toast.show('error', 'Failed to load reports!');
    //                         }
    //                     )
    //                 )
    //             )
    //         )
    // );



readonly getQuaterlyReports = this.effect<{
  page?: number;
  size?: number;
}>(trigger$ =>
  trigger$.pipe(
    tap(() => this.patchState({ loading: true, error: null })),
    switchMap(({ page, size }) =>
      this.sharedservice.getData<ApiResponse<any[]>>(`api/pi-standing`).pipe(
        map((response:any) => {
          const transformedContent = Array.isArray(response.data?.content)
            ? response.data.content.map((res: any) => {
                const updatedRes = { ...res };
                for (let i = 0; i <= 4; i++) {
                  const key = `sprint${i}`;
                  updatedRes[key] = res[key] ? 'X' : '-';
                }
                return updatedRes;
              })
            : [];

          return { ...response.data, content: transformedContent };
        }),
        tapResponse(
          (quaterlyReport) => {
            this.patchState({ quaterlyReport, loading: false });
          },
          (error) => {
            this.patchState({ loading: false, error: 'Failed to fetch accounts' });
            this.toast.show('error', 'Failed to load reports!');
          }
        )
      )
    )
  )
);


    readonly updateQuaterlyReport = this.effect(
        (account$: Observable<{ id: string; data: createAccountForm }>) =>
            account$.pipe(
                exhaustMap(({ id, data }) => {
                    this.patchState({ loading: true, error: null });
                    return this.sharedservice.patchData(`api/pi-standing/${id}`, data).pipe(
                        tap({
                            next: (updatedAccount: any) => {
                                this._accountCreateStatus.set('update');
                                this.getQuaterlyReports({})
                                this.patchState({ loading: false });
                            },
                            error: () => {
                                this._accountCreateStatus.set('error');
                                this.patchState({ loading: false, error: 'Failed to update' });
                                this.toast.show('error', 'Update failed!');
                            }
                        })
                    );
                })
            )
    );


    readonly deleteQuaterlyReport = this.effect((accountId$: Observable<string>) =>
        accountId$.pipe(
            exhaustMap(id =>
                this.sharedservice.deleteData(`api/pi-standing/${id}`).pipe(
                    tapResponse(
                        () => {
                            this._accountCreateStatus.set('deleted');
                            this.getQuaterlyReports({ page: 0, size: 5});
                            this.toast.show('success', 'Report deleted successfully!');
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