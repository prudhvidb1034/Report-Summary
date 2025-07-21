import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, Observable, switchMap, take } from "rxjs";
import { Project, WeeklyDataResponse } from "../models/summary.model";
import { SummaryService } from "../services/summary/summary.service";
import { SharedService } from "../services/shared/shared.service";


interface ProjectsData {
  projects: Project[];
  loading: boolean;
  error: string | null;
  weeklyRange:WeeklyDataResponse;
}

interface ApiResponse<T> {
    data: T;
}


@Injectable()

export class SummaryStore extends ComponentStore<ProjectsData>{
      private sharedservice = inject(SharedService);
  constructor(){
    super({
      projects: [],
      loading: false,
      error: null,
      weeklyRange: {} as WeeklyDataResponse
    })
  }
  readonly projects$ = this.select(state => state.projects);
  readonly loading$ = this.select(state => state.loading);
  readonly error$ = this.select(state => state.error);
  private summeryService = inject(SummaryService);
  readonly weeklyRange$ = this.select(state => state.weeklyRange);


  private http=inject(HttpClient)

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



readonly getDetails = this.effect<{ page: number; size: number }>((trigger$) =>
  trigger$.pipe(
    switchMap(({ page, size }) =>
      this.sharedservice.getData(`api/view-report/AllReports?page=${page}&size=${size}`).pipe(
        tapResponse(
          (weekRanges:any) => {
          this.patchState({ weeklyRange: weekRanges?.data, loading: false });
          },
          (error) => {
            // Handle error
            this.patchState({ error: 'Failed to load project details' });
          }
        )
      )
    )
  )
);


readonly addEmployeeTask = this.effect<any>((employee$) =>
  employee$.pipe(
    switchMap(( employeeInfo) => {
           return this.summeryService
        .postWeeklyReport (employeeInfo.project_id, employeeInfo )
        .pipe(
          tapResponse(
            () => {
              this.patchState((state) => {
                const updatedProjects = state.projects.map((project: any) =>
                  project.project_name ===employeeInfo. projectName
                    ? {
                        ...project,
                        employees: project.employees.some(
                          (emp: any) => emp.employee_id === employeeInfo.employeeId
                        )
                          ? project.employees.map((emp: any) =>
                              emp.employee_id === employeeInfo.employeeId
                                ? {
                                    ...emp,
                                    daily_updates: [
                                      ...emp.daily_updates,
                                      employeeInfo.daily_updates,
                                    ],
                                  }
                                : emp
                            )
                          : [
                              ...project.employees,
                              {
                                employee_id: employeeInfo.employeeId,
                                employee_name: 'New Employee', // Customize as needed
                                daily_updates: [employeeInfo.daily_updates],
                              },
                            ],
                      }
                    : project
                );
                return { projects: updatedProjects };
              });
            },
            (error) => {
              // this.patchState({
              //   error: error?.message ?? 'Failed to add task',
              // });
            }
          )
        );
    })
  )
);

;
  

}