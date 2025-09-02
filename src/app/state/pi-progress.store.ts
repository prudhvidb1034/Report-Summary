import { inject, Injectable, signal } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, Observable, switchMap, tap } from 'rxjs';
import { createAccountForm } from '../models/account.model';
import { SharedService } from '../services/shared/shared.service';
import { urls } from '../constants/string-constants';
import { ToastService } from '../shared/toast.service';
import { PiDependencyReport } from '../models/sprints.model';
import { HttpErrorResponse } from '@angular/common/http';

export interface piproggressReport {
    piprogressReport: PiDependencyReport[];
    loading: boolean;
    error: string | null;
}
interface ApiResponse<T> {
    data: T;
}


@Injectable()
export class PiPgrogressStore extends ComponentStore<piproggressReport> {
    private sharedservice = inject(SharedService);
    private _accountCreateStatus = signal<null | 'success' | 'deleted' | 'update' | 'error'>(null);

    readonly accountCreateStatus = this._accountCreateStatus.asReadonly();
    private toast = inject(ToastService);
    constructor() {
        super({ piprogressReport: [], loading: false, error: null });
    }

    readonly piprogressReport$ = this.select(state => state.piprogressReport);
    readonly loading$ = this.select(state => state.loading);
    readonly error$ = this.select(state => state.error);


    readonly createPipgrogressReports = this.effect((piReport$: Observable<piproggressReport>) =>
        piReport$.pipe(
            exhaustMap(progress => {
                console.log(progress);

                this.patchState({ loading: true, error: null });
                return this.sharedservice.postData<PiDependencyReport>(urls.CREATE_PI_PROGRESS, progress).pipe(
                    tap({
                        next: (user: PiDependencyReport) => {
                            this.patchState({ piprogressReport: [user], loading: false });
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

    readonly getPipgrogressReports = this.effect(
        trigger$ =>
            trigger$.pipe(
                tap(() => this.patchState({ loading: true, error: null })),
                switchMap(() =>
                    this.sharedservice.getData<ApiResponse<PiDependencyReport[]>>(urls.CREATE_PI_PROGRESS).pipe(
                        tapResponse(
                            (piprogressReport) => {
                                this.patchState({
                                    piprogressReport: piprogressReport.data,
                                    loading: false
                                });
                            },
                            (error: HttpErrorResponse) => {
                                const errMsg = error.error?.message ?? 'failed to fetch pi-progress reports';
                                this.patchState({ loading: false, error: errMsg });
                                this.toast.show('error', errMsg);
                            }
                        )
                    )
                )
            )
    );

    readonly updatepiprogressReport = this.effect(
        (account$: Observable<{ id: string; data: createAccountForm }>) =>
            account$.pipe(
                exhaustMap(({ id, data }) => {
                    this.patchState({ loading: true, error: null });
                    return this.sharedservice.patchData(`${urls.CREATE_PI_PROGRESS}/${id}`, data).pipe(
                        tap({
                            next: () => {
                                this._accountCreateStatus.set('update');
                                this.patchState({ loading: false });
                            },
                            error: () => {
                                this._accountCreateStatus.set('error');
                                this.patchState({ loading: false, error: 'Failed to update pi-progress' });
                                this.toast.show('error', 'Update failed!');
                            }
                        })
                    );
                })
            )
    );


    readonly deletepiprogressReport = this.effect((accountId$: Observable<string>) =>
        accountId$.pipe(
            exhaustMap(id =>
                this.sharedservice.deleteData(`${urls.CREATE_PI_PROGRESS}/${id}`).pipe(
                    tapResponse(
                        () => {
                            this._accountCreateStatus.set('deleted');
                            // this.getAccounts({ page: 0, size: 5, sortBy: 'accountName' });
                            this.toast.show('success', 'Account deleted successfully!');
                        },
                        (error: HttpErrorResponse) => {
                            const errMsg = error.error?.message ?? 'failed to delete pi-progress report';
                            this.patchState({ loading: false, error: errMsg });
                            this.toast.show('error', errMsg);
                        }
                    )
                )
            )
        )
    );

}