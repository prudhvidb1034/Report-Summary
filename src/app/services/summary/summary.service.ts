import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urls } from '../../constants/string-constants';
import { createTeam } from '../../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  private readonly http = inject(HttpClient);
 
  private readonly apiUrl = urls.TEAMS_DETAILS;
  private readonly projectdetails = urls.PROJect_DETAILS
 
   getProjectTitles():Observable<createTeam[]>{
     return this.http.get<createTeam[]>(this.apiUrl);
   }

   getProjectDetails(){
     return this.http.get(this.projectdetails);
   }

   postWeeklySummary(summary:any):Observable<any>{
     return this.http.post<any>(this.projectdetails, summary);
   }

   postWeeklyReport(projectId:any, newTask:any){
    return this.http.patch<any>(this.projectdetails+projectId+'/', {
      employees: [newTask]});
   }
}
