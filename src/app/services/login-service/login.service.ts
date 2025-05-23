import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Constants } from '../../constants/string-constants';
import { LoginCredentials, LoginResponse, User } from '../../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly baseUrl = environment.apiUrl + Constants.GET_LOGIN_DETAILS;
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/register';
  userList: any;


  loginCheck(credentials: LoginCredentials) {
    return this.http.get<any>(this.apiUrl).pipe(
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

  // loginCheck(credentials?: LoginCredentials) {
  //   return this.http.get<any[]>(this.apiUrl).pipe(
  //     map(response => {
  //       console.log(response, credentials);
  //       const user = response.find(
  //         (u: any) => u.username === credentials?.username && u.password === credentials?.password
  //       );
  //       this.userList = user || null;
  //       console.log('Matched User:', user);

  //       // Call getRoles and include roles in the response
  //       const roles = this.getRoles();
  //       return { user: user || null, roles };
  //     })
  //   );
  // }

  // getRoles(): string[] {
  //   if (!this.userList) {
  //     return [this.userList.roles];
  //   }
  //   // Return the roles if they exist, otherwise return empty array
  //   console.log(this.userList?.roles);

  //   return this.userList.roles || [];
  // }

}
