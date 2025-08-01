import { inject, Injectable, signal } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { debounceTime, exhaustMap, Observable, switchMap, tap } from 'rxjs';
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
                return this.sharedservice.postLocalData(urls.CREATE_QUATERLY_REPORT, account).pipe(
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

    readonly getQuaterlyReports = this.effect(
        trigger$ =>
            trigger$.pipe(
                tap(() => this.patchState({ loading: true, error: null })),
                switchMap((val:any) =>
                    this.sharedservice.getLocalData<ApiResponse<any[]>>(urls.GET_QUATERLY_REPORT).pipe(
                        tapResponse(
                            (quaterlyReport) => {
                                this.patchState({ quaterlyReport: quaterlyReport.data, loading: false });
                            },
                            (error) => {
                                this.patchState({ loading: false, error: 'Failed to fetch accounts' });
                                this.toast.show('error', 'Failed to load accounts!');
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
                    console.log(data);
                    
                    this.patchState({ loading: true, error: null });
                    return this.sharedservice.patchLocalData(`${urls.UPDATE_QUATERLY_REPORT}/${id}`, data).pipe(
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


    readonly deleteQuaterlyReport = this.effect((accountId$: Observable<string>) =>
        accountId$.pipe(
            exhaustMap(id =>
                this.sharedservice.deleteLocalData(`${urls.REMOVE_QUATERLY_REPORT}/${id}`).pipe(
                    tapResponse(
                        () => {
                            this._accountCreateStatus.set('deleted');
                            // this.getAccounts({ page: 0, size: 5, sortBy: 'accountName' });
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