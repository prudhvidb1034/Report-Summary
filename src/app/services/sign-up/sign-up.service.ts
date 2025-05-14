import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Constants } from '../../constants/string-constants';
import { LoginCredentials, LoginResponse, User } from '../../models/login.model';
import { RegisterUser } from '../../models/register.mode';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
private readonly baseUrl=environment.apiUrl+Constants.GET_REGISTER_DETAILS;
  private readonly http = inject(HttpClient);
  constructor() { }

    //   registerUser(credentials: RegisterUser) {
    //   return this.http.get<RegisterUser>(Constants.GET_LOGIN_DETAILS).pipe(
    //     map(response => {
    //       const user = response.userList.find(
    //         u => u.userName === credentials.username && u.password === credentials.password
    //       );
    //       console.log('Matched User:', user);
  
    //       return { user: user || null };
    //     })
    //   );
    // }
  
}
