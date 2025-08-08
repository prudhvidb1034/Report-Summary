import { inject, Injectable, signal } from "@angular/core";
import { Sprint } from "../models/create-sprint.model";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, Observable, of, switchMap, tap } from "rxjs";
import { SharedService } from "../services/shared/shared.service";
import { urls } from "../constants/string-constants";
import { ToastService } from "../shared/toast.service";





export interface CreateSprint {

  sprint: Sprint[];
  resources: any;
  weeklySprint: any;
  sprintReport: any;
  incidentReport: any;
  loading: boolean;
  createweekSprint: any;
  error: string | null;
  piStandingReport: any;
  getdependencies:any
}

export interface ApiResponse<T> {
  data: T;
}

@Injectable()
export class SprintStore extends ComponentStore<CreateSprint> {

  private sharedservice = inject(SharedService);
  constructor() {
    super({ sprint: [], resources: [], weeklySprint: [], sprintReport: [], incidentReport: [], createweekSprint: [], piStandingReport: [], getdependencies:[] ,loading: false, error: null });
  }
  private _sprintCreateStatus = signal<null | 'success' | 'deleted' | 'update' | 'error'>(null);

  readonly sprintCreateStatus = this._sprintCreateStatus.asReadonly();

  readonly sprint$ = this.select(state => state.sprint);
  readonly weeklySprint$ = this.select(state => state.weeklySprint);
  readonly sprintReport$ = this.select(state => state.sprintReport);
  readonly resourcesList$ = this.select(state => state.resources);
 readonly getdependencies$ = this.select(state => state.getdependencies);

  readonly incidentReport$ = this.select(state => state.incidentReport);
  readonly piStandingReport$ = this.select(state => state.piStandingReport)
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


  readonly getSprintDetails = this.effect<{ page: number; size: number; }>(
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
              this.getSprintDetails({ page: 0, size: 5 });
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

  readonly createWeeklyUpdateSprint = this.effect((sprintUpdate$: Observable<any>) =>
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
        this.sharedservice.getData<ApiResponse<any[]>>(`weekly-sprint-update/by-week-id?weekId=${weekNumber}`).pipe(
          tapResponse(
            (response) => {
              this.patchState({ weeklySprint: response.data, loading: false });
            },
            (error) => {
              this.patchState({ loading: false, error: 'Failed to fetch sprint by ID' });
              this.toast.show('error', 'Failed to fetch sprint by ID');
            }
          )
        )
      )
    )
  );


  readonly updateWeeklySprintById = this.effect(
    (account$: Observable<{ id: string; data: any }>) =>
      account$.pipe(
        exhaustMap(({ id, data }) => {
          this.patchState({ loading: true, error: null });
          return this.sharedservice.patchData(`weekly-sprint-update/${id}`, data).pipe(
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

  readonly deleteWeeklySprintById = this.effect((accountId$: Observable<string>) =>
    accountId$.pipe(
      exhaustMap(id =>
        this.sharedservice.deleteData(`weekly-sprint-update/${id}`).pipe(
          tapResponse(
            () => {
              this._sprintCreateStatus.set('deleted');
              this.getSprintDetails({ page: 0, size: 5 });
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










  readonly getReportById = this.effect((sprintId$: Observable<string>) =>
    sprintId$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      exhaustMap(sprintId =>
        this.sharedservice.getData<ApiResponse<any[]>>(`weekly-sprint-update/by-sprint-id?sprintId=${sprintId}`).pipe(
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




  readonly getIndicentById = this.effect((sprintId$: Observable<string>) =>
    sprintId$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      exhaustMap(sprintId =>
        this.sharedservice.getData<ApiResponse<any[]>>(`api/releases/sprint/${sprintId}`).pipe(
          tapResponse(
            (response) => {
              this.patchState({ incidentReport: response.data, loading: false });
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



  readonly disableWeekId = this.effect(
    (account$: Observable<{ id: string; data: any }>) =>
      account$.pipe(
        exhaustMap(({ id, data }) => {
          this.patchState({ loading: true, error: null });
          return this.sharedservice.patchData(`api/week-ranges/inActive/${id}`, data).pipe(
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


  readonly getResources = this.effect<{ page: number; size: number; }>(
    trigger$ =>
      trigger$.pipe(
        tap(() => this.patchState({ loading: true, error: null })),
        switchMap(({ page, size }) =>
          this.sharedservice.getLocalData<any>(urls.GET_RESOURCES_DETAILS).pipe(
            tapResponse(
              (resources) => {
                this.patchState({ resources: resources.data, loading: false });
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



  readonly getPIStandingData = this.effect(
    trigger$ =>
      trigger$.pipe(
        tap(() => this.patchState({ loading: true, error: null })),
        switchMap(() =>
          this.sharedservice.getData<any>(`api/pi-standing/all`).pipe(
            tapResponse(
              (resources) => {
                this.patchState({ piStandingReport: resources.data, loading: false });
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









  readonly getDependencybySprintID = this.effect((sprintId$: Observable<string>) =>
    sprintId$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      exhaustMap(sprintId =>
        this.sharedservice.getData<ApiResponse<any>>(`${urls.GET_DEPENDECY_SPRINT_ID}/${sprintId}`).pipe(
          tapResponse(
            (response) => {
              this.patchState({ getdependencies: response.data, loading: false });
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


