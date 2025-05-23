import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeUpdateService {

  private readonly http = inject(HttpClient);
 
  private readonly apiUrl = 'http://localhost:3000/projects';
 
   getDates():Observable<any[]>{
     return this.http.get<any[]>(this.apiUrl);
   }


}
