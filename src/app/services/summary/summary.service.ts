import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants, urls } from '../../constants/string-constants';
import { createProject } from '../../models/project.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  private readonly http = inject(HttpClient);
 
  private readonly apiUrl = urls.TEAMS_DETAILS;
  private readonly projectdetails = urls.PROJect_DETAILS
 
   getProjectTitles():Observable<createProject[]>{
     return this.http.get<createProject[]>(this.apiUrl);
   }

   getWeeklyRange(pageProperties:string){
     return this.http.get(environment.apiUrls+Constants.GET_WEEKLY_SUMMARY+pageProperties);
   }

   postWeeklySummary(summary:any):Observable<any>{
     return this.http.post<any>(this.projectdetails, summary);
   }

   postWeeklyReport(projectId:any, newTask:any){
    return this.http.patch<any>(this.projectdetails+projectId+'/', {
      employees: [newTask]});
   }
}
