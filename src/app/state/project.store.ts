import { inject, Injectable, signal } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, Observable, switchMap, tap } from "rxjs";
import { createProject } from "../models/project.model";
import { TeamListService } from "../services/team-list/team-list.service";
import { SharedService } from "../services/shared/shared.service";
import { urls } from "../constants/string-constants";
import { ToastService } from "../shared/toast.service";

interface TeamState {
  teamDetails: any;
  loading: boolean;
  error: string | null;
}
interface ApiResponse<T> {
  data: T;
}


@Injectable()

export class ProjectStore extends ComponentStore<TeamState> {
  constructor() {
    super({
      teamDetails: [],
      loading: false,
      error: ''
    })
  }
  private _accountCreateStatus = signal<null | 'success' | 'deleted' | 'update' | 'error'>(null);
  private toast = inject(ToastService)
  readonly accountCreateStatus = this._accountCreateStatus.asReadonly();
  private readonly teamListService = inject(TeamListService);
  private sharedservice = inject(SharedService);
  readonly team$ = this.select(state => state.teamDetails)

  readonly addTeam = this.effect((projects$: Observable<createProject>) =>
    projects$.pipe(
      exhaustMap(projects => {
        this.patchState({ loading: true, error: null });
        return this.sharedservice.postData(urls.CREATE_PROJECT, projects).pipe(
          tap({
            next: (user: any) => {
              this.patchState({
                teamDetails: [user], loading: false


              });
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


  readonly getTeam = this.effect<{ page: number; size: number; sortBy: string }>(
    trigger$ =>
      trigger$.pipe(
        tap(() => this.patchState({ loading: true, error: null })),
        switchMap(({ page, size, sortBy }) =>
          this.sharedservice.getData<ApiResponse<createProject[]>>(`projects?page=${page}&size=${size}&sortBy=${sortBy}`).pipe(
            tapResponse(
              (projects) => {
                this.patchState({ teamDetails: projects.data, loading: false });
              },
              (error) => {
                this.patchState({ loading: false, error: 'Failed to fetch accounts' });

              }
            )
          )
        )
      )
  );



  readonly updateProject = this.effect(
    (account$: Observable<{ id: string; data: createProject }>) =>
      account$.pipe(
        exhaustMap(({ id, data }) => {
          this.patchState({ loading: true, error: null });
          return this.sharedservice.patchData(`${urls.CREATE_PROJECT}/${id}`, data).pipe(
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

  readonly deleteProject = this.effect((accountId$: Observable<string>) =>
    accountId$.pipe(
      exhaustMap(id => {
        this.patchState({ loading: true, error: null });
        return this.sharedservice.deleteData(`${urls.CREATE_PROJECT}/${id}`).pipe(
          tapResponse(
            () => {
              this.patchState({ loading: false });
              this._accountCreateStatus.set('deleted');
              this.getTeam({ page: 0, size: 5, sortBy: 'accountName' });
              this.toast.show('success', 'Account deleted successfully!');
            },
            (error) => {
              this.patchState({ loading: false, error: '' });
              this._accountCreateStatus.set('error');
            }
          )
        );
      })
    )
  );


}

