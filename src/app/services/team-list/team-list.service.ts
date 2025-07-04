import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Constants } from '../../constants/string-constants';
import { createProject } from '../../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class TeamListService {
  private readonly http = inject(HttpClient);


  PostData(url:string,data:any):Observable<createProject>{
    return this.http.post<createProject>(url,data);
  }
  GetData(url:string):Observable<createProject[]>{
    return this.http.get<createProject[]>(url);
  }
  deleteData(url:string):Observable<createProject[]>{
    return this.http.delete<createProject[]>(url);
  }
}
