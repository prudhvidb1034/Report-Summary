import { inject, Injectable, signal } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, Observable, switchMap, tap } from "rxjs";
import { createProject } from "../models/project.model";
import { TeamListService } from "../services/team-list/team-list.service";
import { SharedService } from "../services/shared/shared.service";
import { urls } from "../constants/string-constants";

interface TeamState {
  teamDetails: createProject[];
  loading: boolean;
  error: string | null;
}
interface ApiResponse<T> {
    data: T;
}


@Injectable()

export class TeamStore extends ComponentStore<TeamState> {
  constructor() {
    super({
      teamDetails: [],
      loading: false,
      error: ''
    })
  }
  private _accountCreateStatus = signal<null | 'success' | 'deleted' | 'update' | 'error'>(null);

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



  // readonly getTeam = this.effect((trigger$) =>
  //   trigger$.pipe(
  //     switchMap(() =>
  //       this.teamListService.GetData('http://localhost:3000/teamslist').pipe(
  //         tapResponse(
  //           (data) =>
  //             this.patchState({
  //               teamDetails: data.map((item: any) => ({
  //                 id: item.id,
  //                 projectname: item.projectname,
  //                 accountId: item.accountId,
  //                 projectLocation: item.projectLocation,
  //                 startDate: item.startDate,
  //                 endDate: item.endDate,
  //               })),
  //             }),
  //           (error) => this.patchState({ error: 'Failed to load team data' })
  //         )
  //       )
  //     )
  //   )
  // );


   readonly getTeam = this.effect(
          trigger$ =>
              trigger$.pipe(
                  tap(() => this.patchState({ loading: true, error: null })),
                  switchMap(() =>
                      this.sharedservice.getData<ApiResponse<createProject[]>>(urls.CREATE_PROJECT).pipe(
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


}