import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, Resolve, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { LoginStore } from '../state/login.store';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  private router = inject(Router);
  private loginStore = inject(LoginStore);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    // Read the expectedRoles array (if any) from route data:
    // const expectedRoles = route.data?.['expectedRoles'] as string[] | undefined;

    // // If no expectedRoles were configured on this route, allow navigation:
    // if (!expectedRoles || expectedRoles.length === 0) {
    //   return true;
    // }

  const user = JSON.parse(localStorage.getItem('user') || '{}')

    if (user != null) {
      this.loginStore.patchState({
        user:user});
      return true;
    } else {
      // Redirect to /login (or anywhere you want) when unauthorized
       this.router.navigate(['/login']);
      return false;
    }
    
  }





}
