import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, Observable, switchMap, take, tap } from "rxjs";
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
      private _weeklySummary = signal<null | 'success' | 'deleted' | 'update' | 'error'>(null);
  
      readonly weeklySummary = this._weeklySummary.asReadonly();
  
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
          return this.sharedservice.postData('api/week-ranges/save',projectInfo).pipe(
              tapResponse(
                  (savedData) => {
                  this.setProjects(savedData);
                  this.patchState({ loading: false});
                  this._weeklySummary.set('success');
                  },
                  (error: any) => {
                      this.patchState({
                          loading: false,
                          error: error?.message ?? 'Unknown error'
                      });
                    this._weeklySummary.set('error');

                  }
              )
          );
      })
  )
);



readonly getDetails = this.effect<{ page: number; size: number }>((trigger$) =>
  trigger$.pipe(
    switchMap(({ page, size }) => {
      this.patchState({ loading: true, error: null });
      return this.sharedservice.getData(`api/view-report/AllReports?page=${page}&size=${size}`).pipe(
        tapResponse(
          (weekRanges: any) => {
            this.patchState({ weeklyRange: weekRanges?.data, loading: false });
            this._weeklySummary.set('success');

          },
          (error) => {
            this.patchState({ loading: false, error: '' });
            this.patchState({ error: 'Failed to load project details' });
        this._weeklySummary.set('error');

          }
        )
      );
    })
  )
);


// readonly addEmployeeTask = this.effect<any>((employee$) =>
//   employee$.pipe(
//     switchMap(( employeeInfo) => {
//            return this.summeryService
//         .postWeeklyReport (employeeInfo.project_id, employeeInfo )
//         .pipe(
//           tapResponse(
//             () => {
//               this.patchState((state) => {
//                 const updatedProjects = state.projects.map((project: any) =>
//                   project.project_name ===employeeInfo. projectName
//                     ? {
//                         ...project,
//                         employees: project.employees.some(
//                           (emp: any) => emp.employee_id === employeeInfo.employeeId
//                         )
//                           ? project.employees.map((emp: any) =>
//                               emp.employee_id === employeeInfo.employeeId
//                                 ? {
//                                     ...emp,
//                                     daily_updates: [
//                                       ...emp.daily_updates,
//                                       employeeInfo.daily_updates,
//                                     ],
//                                   }
//                                 : emp
//                             )
//                           : [
//                               ...project.employees,
//                               {
//                                 employee_id: employeeInfo.employeeId,
//                                 employee_name: 'New Employee', // Customize as needed
//                                 daily_updates: [employeeInfo.daily_updates],
//                               },
//                             ],
//                       }
//                     : project
//                 );
//                 return { projects: updatedProjects };
//               });
//             },
//             (error) => {
//               // this.patchState({
//               //   error: error?.message ?? 'Failed to add task',
//               // });
//             }
//           )
//         );
//     })
//   )
// );

 readonly addEmployeeTask = this.effect((addTask$: Observable<any>) =>
        addTask$.pipe(
          exhaustMap(req => {
            this.patchState({ loading: true, error: null });
            return this.sharedservice.postData('api/view-report/createStatus', req).pipe(
              tap({
                next: (user: any) => {
                  this.patchState({ weeklyRange: user, loading: false });
                  // this._sprintCreateStatus.set('success');
    
                },
                error: () => {
                  this.patchState({ loading: false, error: '' });
                  // this._sprintCreateStatus.set('error');
                }
              })
            );
          })
        )
      );
  

}