import { inject, Injectable } from "@angular/core";
import { Sprint } from "../models/create-sprint.model";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { exhaustMap, Observable, of, tap } from "rxjs";
import { SharedService } from "../services/shared/shared.service";
import { urls } from "../constants/string-constants";





export interface CreateSprint {

    sprint: Sprint[];
    loading: boolean;
    error: string | null;
}
export interface ApiResponse<T> {
    data: T;
}

@Injectable()
export class CreateSprintStore extends ComponentStore<CreateSprint> {

private sharedservice = inject(SharedService);
    constructor() {
        super({ sprint: [], loading: false, error: null });
    }

    readonly sprint$ = this.select(state => state.sprint);
    readonly loading$ = this.select(state => state.loading);
    readonly error$ = this.select(state => state.error);

   readonly createSprint = this.effect((register$: Observable<Sprint>) =>
      register$.pipe(
        exhaustMap(sprint => {
          this.patchState({ loading: true, error: null });
          return this.sharedservice.postData(urls.CREATE_SPRINT, sprint).pipe(
            tap({
              next: (user: any) => {
                this.patchState({ sprint: [user], loading: false });
                // this._accountCreateStatus.set('success');
  
              },
              error: () => {
                this.patchState({ loading: false, error: '' });
                // this._accountCreateStatus.set('error');
              }
            })
          );
        })
      )
    );
}


