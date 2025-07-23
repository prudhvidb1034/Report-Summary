import { inject, Injectable, signal } from "@angular/core";
import { Sprint } from "../models/create-sprint.model";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, Observable, of, switchMap, tap } from "rxjs";
import { SharedService } from "../services/shared/shared.service";
import { urls } from "../constants/string-constants";
import { ToastService } from "../shared/toast.service";





export interface CreateSprint {
   
    Sprintrelease: any;
    loading: boolean;
    error: string | null;
}


export interface ApiResponse<T> {
    data: T;
}

@Injectable()
export class SprintReleaseStore extends ComponentStore<CreateSprint> {


    constructor() {
        super({Sprintrelease:[], loading: false, error: null });
    }
    private _sprintCreateStatus = signal<null | 'success' | 'deleted' | 'update' | 'error'>(null);

    readonly sprintCreateStatus = this._sprintCreateStatus.asReadonly();
private sharedservice = inject(SharedService);
  
    readonly Sprintrelease$=this.select(state=>state.Sprintrelease);
    readonly loading$ = this.select(state => state.loading);
    readonly error$ = this.select(state => state.error);
    private toast = inject(ToastService);




     readonly createIncident = this.effect((incidents$: Observable<any>) =>
      incidents$.pipe(
        exhaustMap(incident => {
          this.patchState({ loading: true, error: null });
          return this.sharedservice.postData(urls.CREATE_INCIENT, incident).pipe(
            tap({
              next: (user: any) => {
                  console.log('Incident Created:', user);
                this.patchState({ Sprintrelease: [user], loading: false  });
                this._sprintCreateStatus.set('success');
  
              },
              error: () => {
                this.patchState({ loading: false, error: '' });
                 this._sprintCreateStatus.set('error');
              }
            })
          );
        })
      )
    );





     readonly getReleaseByWeekId = this.effect((WeekId$: Observable<string>) =>
        WeekId$.pipe(
            tap(() => this.patchState({ loading: true, error: null })),
          exhaustMap(weekId =>
            this.sharedservice.getData<ApiResponse<any[]>>(`api/releases/week/${weekId}`).pipe(
              tapResponse(
                (response) => {
                  this.patchState({ Sprintrelease: response.data, loading: false });
                },
                (error) => {
                  this.patchState({ loading: false, error: 'Failed to fetch sprint by ID' });
                  this.toast.show('error', 'Failed to load sprint!');
                }
              )
            )
          )
        )
      );




        readonly updateRelease = this.effect(
              (account$: Observable<{ id: string; data: any }>) =>
                  account$.pipe(
                      exhaustMap(({ id, data }) => {
                          this.patchState({ loading: true, error: null });
                          return this.sharedservice.patchData(`api/releases/update/${id}`, data).pipe(
                              tap({
                                  next: (updatedAccount: any) => {
                                      // this._accountCreateStatus.set('update');
                                      this.patchState({ loading: false });
                                  },
                                  error: () => {
                                      // this._accountCreateStatus.set('error');
                                      this.patchState({ loading: false, error: 'Failed to update account' });
                                      this.toast.show('error', 'Update failed!');
                                  }
                              })
                          );
                      })
                  )
          );
      
      
          readonly deleteRelease = this.effect((releaseId$: Observable<string>) =>
              releaseId$.pipe(
                  exhaustMap(id =>
                      this.sharedservice.deleteData(`api/releases/delete/${id}`).pipe(
                          tapResponse(
                              () => {
                                  // this._accountCreateStatus.set('deleted');
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