import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginStore } from '../state/login.store';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  userRole: string | undefined;
  constructor(private router: Router) {}

  private  loginStore = inject(LoginStore)
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.routeConfig?.data?.['expectedRole'];
    console.log(route)

    // const userRole = localStorage.getItem('userRole')?.toLowerCase(); 
    this.loginStore.user$.pipe(
      tap(res => {
        console.log(res)
        this.userRole =res?.role.toLocaleLowerCase()

       },() => {})
    ).subscribe()

    console.log('Expected:', expectedRole);
    console.log('From Storage:',this.userRole);

    if (this.userRole === expectedRole) {
      return true;
    } else {
      this.router.navigate(['/not-authorized']);
      alert('You dont have an access')
      return false;
    }
  }
}
