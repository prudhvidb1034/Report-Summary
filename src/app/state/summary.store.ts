import { inject, Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, Observable } from "rxjs";
import { Project } from "../models/summary.model";
import { SummaryService } from "../services/summary/summary.service";


interface ProjectsData {
  projects: Project[];
  loading: boolean;
  error: string | null;
}


@Injectable()

export class SummaryStore extends ComponentStore<ProjectsData>{
  
  constructor(){
    super({projects:[],loading:false,error:null})
  }
  readonly projects$ = this.select(state => state.projects);
  readonly loading$ = this.select(state => state.loading);
  readonly error$ = this.select(state => state.error);
  private summeryService = inject(SummaryService);


  readonly setProjects = this.updater((state, projects: any) => ({
    ...state,
    projects
  }));

  readonly weeklyReport = this.effect((projects$: any) =>
  projects$.pipe(
      exhaustMap(projectInfo => {
          this.patchState({ loading: true, error: null });
          return this.summeryService.postWeeklySummary(projectInfo).pipe(
              tapResponse(
                  (savedData) => {
                    this.setProjects(savedData)
                  },
                  (error: any) => {
                      this.patchState({
                          loading: false,
                          error: error?.message ?? 'Unknown error'
                      });
                  }
              )
          );
      })
  )
);

  

}