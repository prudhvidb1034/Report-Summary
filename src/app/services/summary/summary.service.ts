import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createTeam } from '../../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  private readonly http = inject(HttpClient);
 
  private readonly apiUrl = 'http://localhost:3000/teamslist';
 
   getProjectTitles():Observable<createTeam[]>{
     return this.http.get<createTeam[]>(this.apiUrl);
   }

   postWeeklySummary(summary:any):Observable<any>{
     return this.http.post<any>('http://localhost:3000/weeklySummary', summary);
   }
}
