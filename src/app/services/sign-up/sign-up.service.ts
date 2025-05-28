import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Constants, urls } from '../../constants/string-constants';
import { LoginCredentials, LoginResponse, User } from '../../models/login.model';
import { RegistrationForm } from '../../models/register.mode';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = urls.REGISTRATION_DETAILS;;
  registerUser(reg: RegistrationForm): Observable<RegistrationForm> {
    console.log(reg)
    return this.http.post<RegistrationForm>(this.apiUrl, reg);
  }

  getUsers(): Observable<RegistrationForm[]> {
    return this.http.get<RegistrationForm[]>(this.apiUrl);
  }

}
