import { inject, Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap } from "rxjs";
import { createTeam } from "../models/project.model";
import { TeamListService } from "../services/team-list/team-list.service";

interface TeamState{
    teamDetails:createTeam[];
    error:string
}

@Injectable()

export class TeamStore extends ComponentStore<TeamState>{
    constructor() {
        super({
            teamDetails:[]  ,error:''      })
    }
    private readonly teamListService = inject(TeamListService);



    readonly team$ = this.select(state =>state.teamDetails)


    readonly addTeam = this.effect((updatedVal$:any) =>
    updatedVal$.pipe(
      exhaustMap(updatedVal =>
        this.teamListService.PostData('http://localhost:3000/teamslist',updatedVal).pipe(
          tapResponse(
            (dval) => {
              this.patchState(state => ({
                teamDetails: [...state.teamDetails,dval],
              }));
            },
            error => this.patchState({ error: '' })
          )
        )
      )
    )
  );

//   readonly getTeamDetails=this.updater((state,details:teamDetails[])=>({
//     teamDetails:[...state.teamDetails,details]
//   })

// readonly getTeamDetails =this.updater((state,details:any[])=>({
//     teamDetails:[...state.teamDetails,details]
// })

// readonly getTeam = this.effect((getvalue$:any) =>
// getvalue$.pipe(
// this.teamListService.GetData('http://localhost:3000/teamslist').pipe(
//     tapResponse((getval)=>{
//         this.getTeamDetails(getval);
//     //  this.updater(state=>{
//     //     team
//     //  })
        
//     },
//     error => this.patchState({ error: '' })
//   )
// )
// )
// )
// );

}