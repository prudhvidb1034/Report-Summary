import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { tapResponse } from '@ngrx/component-store';
import { SharedService } from '../services/shared/shared.service';
import { ToastService } from '../shared/toast.service';

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
  list: any;
  allprojects:any;
  allAccounts:any;
  allEmployees:any;
  allTechnologies:any;
  loading: boolean;
  error: string | null;
  flag:boolean;
  weeklyRange:any;
}

@Injectable({ providedIn: 'root' })
export class CommonStore extends ComponentStore<ProjectsStateModel> {
  constructor(private sharedservice: SharedService) {
    super({ allprojects: [],flag:false,list:[],allAccounts:[],allTechnologies:[],allEmployees:[],weeklyRange:[], loading: false, error: null });
  }

    readonly allProjects$ = this.select(state => state.allprojects);
    readonly allAccounts$ = this.select(state => state.allAccounts);
    readonly employeeList$=this.select(state=>state.allEmployees);
     readonly allTechnologies$=this.select(state=>state.allTechnologies);
    private toast = inject(ToastService);
    readonly list$ = this.select(state => state.list);
    readonly flag$=this.select(state=>state.flag)

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

    readonly setFlag = this.updater((state, flag: boolean) => ({
    ...state,
    flag: flag
  }));

     readonly setEmployees = this.updater(
    (state, employees:any) => ({
      ...state,
      allEmployees: employees,
      loading: false,
      error: null
    })
  );

  
     readonly setTechnolgoies = this.updater(
    (state, technologies:any) => ({
      ...state,
      allTechnologies: technologies,
      loading: false,
      error: null
    })
  );
  //   readonly setWeeklyRange = this.updater(
  //   (state, weeklyRange:any) => ({
  //     ...state,
  //     weeklyRange: weeklyRange,
  //     loading: false,
  //     error: null
  //   })
  // );


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

  readonly getTechnologies = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(() =>
        this.sharedservice
          .getData<ApiResponse<any>>('techStack')
          .pipe(
            tapResponse(
              (response:any) => {
                this.setTechnolgoies(response.data)
                           //   this.getAllAccounts();
},
              (error: any) => {
                this.setError('Failed to fetch Technologies');
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
              (response:any) => {
                this.setAccountDetails(response.data)
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
                                 this.getTechnologies();

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

  //  readonly getWeeklyRange = this.effect<void>(trigger$ =>
  //   trigger$.pipe(
  //     tap(() => this.setLoading(true)),
  //     switchMap(() =>
  //       this.sharedservice
  //         .getData<ApiResponse<any>>('api/view-report/all')
  //         .pipe(
  //           tapResponse(
  //             (response:any) => 
  //           {
  //                this.setWeeklyRange(response.content);
  //             //     const mapped = response.data.map(person => ({
  //             //   email: person.email,
  //             //   id: person.personId,
  //             //   name: `${person.firstName} ${person.lastName}`
              
  //             // }));
             
  //           },
  //             () => this.setError('Failed to fetch projects')
  //           )
  //         )
  //     )
  //   )
  // );


        readonly getSearch = this.effect<{type:string,searchName:string, page: number; size: number; sortBy: string }>(
          trigger$ =>
              trigger$.pipe(
                  debounceTime(300),
                  tap(() => this.patchState({ loading: true, error: null })),
                  switchMap(({type,searchName, page, size, sortBy }) =>
                      this.sharedservice.getData<ApiResponse<any  >>(`${type}/search?name=${searchName}&page=${page}&size=${size}&sortBy=${sortBy}`).pipe(
                          tapResponse(
                              (list) => {
                                  this.patchState({ list: list.data, loading: false });
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

}
