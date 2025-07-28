import { inject, Injectable, signal } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { debounceTime, exhaustMap, Observable, switchMap, tap } from 'rxjs';
import { createAccountForm } from '../models/account.model';
import { SharedService } from '../services/shared/shared.service';
import { urls } from '../constants/string-constants';
import { ToastService } from '../shared/toast.service';

export interface AccountState {
    account: any;
    loading: boolean;
    error: string | null;
}
interface ApiResponse<T> {
    data: T;
}


@Injectable()
export class AccountStore extends ComponentStore<AccountState> {
    private sharedservice = inject(SharedService);
    private _accountCreateStatus = signal<null | 'success' | 'deleted' | 'update' | 'error'>(null);

    readonly accountCreateStatus = this._accountCreateStatus.asReadonly();
    private toast = inject(ToastService);
    constructor() {
        super({ account: [], loading: false, error: null });
    }

    readonly account$ = this.select(state => state.account);
    readonly loading$ = this.select(state => state.loading);
    readonly error$ = this.select(state => state.error);


    readonly createAccount = this.effect((account$: Observable<createAccountForm>) =>
        account$.pipe(
            exhaustMap(account => {
                this.patchState({ loading: true, error: null });
                return this.sharedservice.postData(urls.CREATE_ACCOUNT, account).pipe(
                    tap({
                        next: (user: any) => {
                            this.patchState({ account: [user], loading: false });
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

    readonly getAccounts = this.effect<{ page: number; size: number; sortBy: string }>(
        trigger$ =>
            trigger$.pipe(
                tap(() => this.patchState({ loading: true, error: null })),
                switchMap(({ page, size, sortBy }) =>
                    this.sharedservice.getData<ApiResponse<createAccountForm[]>>(`Account?page=${page}&size=${size}&sortBy=${sortBy}`).pipe(
                        tapResponse(
                            (accounts) => {
                                this.patchState({ account: accounts.data, loading: false });
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





    readonly updateAccount = this.effect(
        (account$: Observable<{ id: string; data: createAccountForm }>) =>
            account$.pipe(
                exhaustMap(({ id, data }) => {
                    this.patchState({ loading: true, error: null });
                    return this.sharedservice.patchData(`${urls.CREATE_ACCOUNT}/${id}`, data).pipe(
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


    readonly deleteAccount = this.effect((accountId$: Observable<string>) =>
        accountId$.pipe(
            exhaustMap(id =>
                this.sharedservice.deleteData(`${urls.CREATE_ACCOUNT}/${id}`).pipe(
                    tapResponse(
                        () => {
                            this._accountCreateStatus.set('deleted');
                            this.getAccounts({ page: 0, size: 5, sortBy: 'accountName' });
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