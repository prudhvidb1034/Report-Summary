import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urls } from '../../constants/string-constants';

@Injectable({
  providedIn: 'root'
})
export class EmployeeUpdateService {

  private readonly http = inject(HttpClient);
private  url = urls.PROJect_DETAILS;
   getDates():Observable<any[]>{
     return this.http.get<any[]>(this.url);
   }


}
