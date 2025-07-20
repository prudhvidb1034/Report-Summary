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
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class CommonStore extends ComponentStore<ProjectsStateModel> {
  constructor(private sharedservice: SharedService) {
    super({ allprojects: [], loading: false, error: null });
  }

  readonly allProjects$ = this.select(state => state.allprojects);
  readonly loading$     = this.select(state => state.loading);
  readonly error$       = this.select(state => state.error);

  readonly setProjectDetails = this.updater(
    (state, projects: CreateProject[]) => ({
      ...state,
      allprojects: projects,
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
              (response:any) => this.setProjectDetails(response.data),
              () => this.setError('Failed to fetch projects')
            )
          )
      )
    )
  );

}
