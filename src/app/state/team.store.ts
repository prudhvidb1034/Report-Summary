import { inject, Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, switchMap } from "rxjs";
import { createTeam } from "../models/project.model";
import { TeamListService } from "../services/team-list/team-list.service";

interface TeamState {
  teamDetails: createTeam[];
  error: string
}

@Injectable()

export class TeamStore extends ComponentStore<TeamState> {
  constructor() {
    super({
      teamDetails: [],
       error: ''
    })
  }
  private readonly teamListService = inject(TeamListService);
  readonly team$ = this.select(state => state.teamDetails)
  readonly addTeam = this.effect((updatedVal$: any) =>
    updatedVal$.pipe(
      exhaustMap(updatedVal =>
        this.teamListService.PostData('http://localhost:3000/teamslist', updatedVal).pipe(
          tapResponse(
            (dval) => {
              this.patchState(state => ({
                teamDetails: [...state.teamDetails, dval],
              }));
            },
            error => this.patchState({ error: '' })
          )
        )
      )
    )
  );


  readonly getTeam = this.effect((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this.teamListService.GetData('http://localhost:3000/teamslist').pipe(
          tapResponse(
            (data) =>
              this.patchState({
                teamDetails: data.map((item: any) => ({
                  id: item.id,
                  projectname: item.projectname,
                  projectLocation: item.projectlocation,
                  startDate: item.startDate,
                  endDate: item.endDate,
                })),
              }),
            (error) => this.patchState({ error: 'Failed to load team data' })
          )
        )
      )
    )
  );


}