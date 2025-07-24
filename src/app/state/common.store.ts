import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { switchMap, tap } from 'rxjs/operators';
import { tapResponse } from '@ngrx/component-store';
import { SharedService } from '../services/shared/shared.service';

export interface CreateProject {
  // Define according to API
  id: string;
  name: string;
  // …other fields
}

export interface ApiResponse<T> {
  data: T;
  // …other metadata if present
}

export interface ProjectsStateModel {
  allprojects:any;
  allAccounts:any;
  allEmployees:any;
  loading: boolean;
  error: string | null;
  weeklyRange:any;
}

@Injectable({ providedIn: 'root' })
export class CommonStore extends ComponentStore<ProjectsStateModel> {
  constructor(private sharedservice: SharedService) {
    super({ allprojects: [],allAccounts:[],allEmployees:[],weeklyRange:[], loading: false, error: null });
  }

  readonly allProjects$ = this.select(state => state.allprojects);
    readonly allAccounts$ = this.select(state => state.allAccounts);
    readonly employeeList$=this.select(state=>state.allEmployees);

  readonly loading$     = this.select(state => state.loading);
  readonly error$       = this.select(state => state.error);
  readonly weeklyRangeList$=this.select(state=>state.weeklyRange)

  readonly setProjectDetails = this.updater(
    (state, projects: CreateProject[]) => ({
      ...state,
      allprojects: projects,
      loading: false,
      error: null
    })
  );

    readonly setAccountDetails = this.updater(
    (state, accounts:any) => ({
      ...state,
      allAccounts: accounts,
      loading: false,
      error: null
    })
  );

     readonly setEmployees = this.updater(
    (state, employees:any) => ({
      ...state,
      allEmployees: employees,
      loading: false,
      error: null
    })
  );

    readonly setWeeklyRange = this.updater(
    (state, weeklyRange:any) => ({
      ...state,
      weeklyRange: weeklyRange,
      loading: false,
      error: null
    })
  );


  readonly setLoading = this.updater(
    (state, loading: boolean) => ({ ...state, loading })
  );

  readonly setError = this.updater(
    (state, error: string | null) => ({ ...state, loading: false, error })
  );

  readonly getAllProjects = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(() =>
        this.sharedservice
          .getData<ApiResponse<any>>('projects/all')
          .pipe(
            tapResponse(
              (response:any) => {
                this.setProjectDetails(response.data)
                              this.getAllAccounts();
},
              (error: any) => {
                this.setError('Failed to fetch projects');
              }
            )
          )
      )
    )
  );

  
  readonly getAllAccounts = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(() =>
        this.sharedservice
          .getData<ApiResponse<any>>('Account/all')
          .pipe(
            tapResponse(
              (response:any) => {this.setAccountDetails(response.data)
                this.getEmployees();
              },
            
              () => this.setError('Failed to fetch projects')
            )
          )
      )
    )
  );

    readonly getEmployees = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(() =>
        this.sharedservice
          .getData<ApiResponse<any>>('Person')
          .pipe(
            tapResponse(
              (response:any) => 
            {
                 this.setEmployees(response.data);
                                 this.getWeeklyRange();

              //     const mapped = response.data.map(person => ({
              //   email: person.email,
              //   id: person.personId,
              //   name: `${person.firstName} ${person.lastName}`
              
              // }));
             
            },
              () => this.setError('Failed to fetch projects')
            )
          )
      )
    )
  );

   readonly getWeeklyRange = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(() =>
        this.sharedservice
          .getData<ApiResponse<any>>('api/view-report/all')
          .pipe(
            tapResponse(
              (response:any) => 
            {
                 this.setWeeklyRange(response.content);
              //     const mapped = response.data.map(person => ({
              //   email: person.email,
              //   id: person.personId,
              //   name: `${person.firstName} ${person.lastName}`
              
              // }));
             
            },
              () => this.setError('Failed to fetch projects')
            )
          )
      )
    )
  );

}
