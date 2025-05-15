import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Constants } from '../../constants/string-constants';
import { createTeam } from '../../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class TeamListService {
  private readonly http = inject(HttpClient);


  PostData(url:string,data:any):Observable<createTeam>{
    return this.http.post<createTeam>(url,data);
  }
  GetData(url:string):Observable<createTeam[]>{
    return this.http.get<createTeam[]>(url);
  }
  deleteData(url:string):Observable<createTeam[]>{
    return this.http.delete<createTeam[]>(url);
  }
}
