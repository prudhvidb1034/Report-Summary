import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Constants, urls } from '../../constants/string-constants';
import { LoginCredentials, LoginResponse, User } from '../../models/login.model';
import { RegistrationForm } from '../../models/register.mode';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  // private readonly baseUrl = environment.apiUrl + Constants.GET_LOGIN_DETAILS;
  private readonly http = inject(HttpClient);
  // private readonly apiUrl = 'this./register';
  userList: RegistrationForm[]=[];

  loginCheck(credentials: LoginCredentials) {
    return this.http.get<any>(urls.REGISTRATION_DETAILS).pipe(
      map(response => {
        console.log(response, credentials);
        const user = response.find(
          (u: any) => u.username === credentials.username && u.password === credentials.password
        );
        this.userList = user;
        console.log('Matched User:', user);

        return { user: user || null };
      })
    );
  }

  
}
