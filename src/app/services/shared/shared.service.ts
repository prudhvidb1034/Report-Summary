import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

 private http = inject(HttpClient);
 private url = environment.apiUrls;
 private localUrl='http://localhost:4200'
 
 sprintId:any;
  sharedValue: any;

  getData<T>(url: string): Observable<T> {
    return this.http.get<T>(this.url+url);
  }
  postData<T>(path: string, data: any): Observable<T> {
    return this.http.post<T>(this.url+path, data);
  }

  patchData<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(this.url+url, data);
  }

  // patchVal(url: string): Observable<ArrayBuffer> {
  //   return this.http.put(this.url+url, null, { responseType: 'arraybuffer' });
  // }


  deleteData<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.url+url);
  }
   getLocalData<T>(url: string): Observable<T> {
    return this.http.get<T>(this.localUrl+url);
  }
   postLocalData<T>(path: string, data: any): Observable<T> {
    return this.http.post<T>(this.localUrl+path, data);
  }

  patchLocalData<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(this.localUrl+url, data);
  }

  deleteLocalData<T>(url: string): Observable<T> {
    return this.http.delete<T>(this.localUrl+url);
  }
}
