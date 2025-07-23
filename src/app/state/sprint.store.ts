import { inject, Injectable, signal } from "@angular/core";
import { Sprint } from "../models/create-sprint.model";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, Observable, of, switchMap, tap } from "rxjs";
import { SharedService } from "../services/shared/shared.service";
import { urls } from "../constants/string-constants";
import { ToastService } from "../shared/toast.service";





export interface CreateSprint {

    sprint: Sprint[];
    weeklySprint: any[];
     sprintReport: any[];  
    loading: boolean;
    error: string | null;
}

export interface Sprintweek{
  createweekSprint:any;

   loading: boolean;
    error: string | null;
}


export interface ApiResponse<T> {
    data: T;
}

@Injectable()
export class SprintStore extends ComponentStore<CreateSprint> {

private sharedservice = inject(SharedService);
    constructor() {
        super({ sprint: [],weeklySprint:[],sprintReport:[], loading: false, error: null });
    }
    private _sprintCreateStatus = signal<null | 'success' | 'deleted' | 'update' | 'error'>(null);

    readonly sprintCreateStatus = this._sprintCreateStatus.asReadonly();

    readonly sprint$ = this.select(state => state.sprint);
    readonly weeklySprint$=this.select(state=>state.weeklySprint);
    readonly loading$ = this.select(state => state.loading);
    readonly error$ = this.select(state => state.error);
    private toast = inject(ToastService);
    

   readonly createSprint = this.effect((register$: Observable<Sprint>) =>
      register$.pipe(
        exhaustMap(sprint => {
          this.patchState({ loading: true, error: null });
          return this.sharedservice.postData(urls.CREATE_SPRINT, sprint).pipe(
            tap({
              next: (user: any) => {
                this.patchState({ sprint: [user], loading: false  });
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

  
      readonly getSprintDetails = this.effect<{ page: number; size: number;}>(
          trigger$ =>
              trigger$.pipe(
                  tap(() => this.patchState({ loading: true, error: null })),
                  switchMap(({ page, size }) =>
                      this.sharedservice.getData<any>(`api/sprints/getAllSprints?page=${page}&size=${size}`).pipe(
                          tapResponse(
                              (accounts) => {
                                  this.patchState({ sprint: accounts.data, loading: false });
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

  readonly getSprintById = this.effect((sprintId$: Observable<string>) =>
    sprintId$.pipe(
        tap(() => this.patchState({ loading: true, error: null })),
      exhaustMap(sprintId =>
        this.sharedservice.getData<ApiResponse<Sprint>>(`api/sprints/${sprintId}`).pipe(
          tapResponse(
            (response) => {
              this.patchState({ weeklySprint: [response.data], loading: false });
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

  readonly updateSprint = this.effect(
          (account$: Observable<{ id: string; data: any }>) =>
              account$.pipe(
                  exhaustMap(({ id, data }) => {
                      this.patchState({ loading: true, error: null });
                      return this.sharedservice.patchData(`api/sprints/${id}`, data).pipe(
                          tap({
                              next: (updatedAccount: any) => {
                                  this._sprintCreateStatus.set('update');
                                  this.patchState({ loading: false });
                              },
                              error: () => {
                                  this._sprintCreateStatus.set('error');
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
                this.sharedservice.deleteData(`api/sprints/${id}`).pipe(
                    tapResponse(
                        () => {
                            this._sprintCreateStatus.set('deleted');
                            this.getSprintDetails({ page: 0, size: 5});
                            this.toast.show('success', 'Sprint deleted successfully!');
                        },
                        (error) => {
                            this.toast.show('error', 'Failed to delete sprint!');
                        }
                    )
                )
            )
        )
    );

  readonly updateWeeklyUpdateSprint = this.effect((sprintUpdate$: Observable<any>) =>
        sprintUpdate$.pipe(
          exhaustMap(updateBody => {
            this.patchState({ loading: true, error: null });
            return this.sharedservice.postData('weekly-sprint-update', updateBody).pipe(
              tap({
                next: (user: any) => {
                  this.patchState({ sprint: [user], loading: false });
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


  readonly getWeeklyReportById = this.effect((sprintId$: Observable<string>) =>
    sprintId$.pipe(
        tap(() => this.patchState({ loading: true, error: null })),
      exhaustMap(weekNumber =>
        this.sharedservice.getData<ApiResponse<Sprint>>(`weekly-sprint-update/active/week/${weekNumber}`).pipe(
          tapResponse(
            (response) => {
              this.patchState({ weeklySprint: [response.data], loading: false });
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













        readonly getReportById = this.effect((sprintId$: Observable<string>) =>
    sprintId$.pipe(
        tap(() => this.patchState({ loading: true, error: null })),
      exhaustMap(sprintNumber =>
        this.sharedservice.getData<ApiResponse<any[]>>(`weekly-sprint-update/by-sprint-id?sprintId=${sprintNumber}`).pipe(
          tapResponse(
            (response) => {
              this.patchState({ sprintReport: response.data, loading: false });
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






      
  
}


