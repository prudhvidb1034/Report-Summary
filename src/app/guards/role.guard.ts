import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, } from 'rxjs';
import { LoginStore } from '../state/login.store';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  private router = inject(Router);
  private loginStore = inject(LoginStore);

  canActivate(): Observable<boolean> | boolean {

  const user = JSON.parse(localStorage.getItem('user') || '{}')

    if (user != null) {
      this.loginStore.patchState({
        user:user});
      return true;
    } else {
       this.router.navigate(['/login']);
      return false;
    }
    
  }





}
