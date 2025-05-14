import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Constants } from '../../constants/string-constants';
import { LoginCredentials, LoginResponse, User } from '../../models/login.model';
import { RegistrationForm } from '../../models/register.mode';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private readonly http = inject(HttpClient);
  // constructor() { }

   private readonly apiUrl = 'http://localhost:3000/register';

  // constructor(private http: HttpClient) {}

    registerUser(reg: RegistrationForm): Observable<RegistrationForm> {
    console.log(reg)
    // this.getUsers();
    return this.http.post<RegistrationForm>(this.apiUrl, reg);
  }
  getUsers(){
    return this.http.get<RegistrationForm>(this.apiUrl);
  }
}
