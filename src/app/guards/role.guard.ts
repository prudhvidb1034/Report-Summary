import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.routeConfig?.data?.['expectedRole'];
    console.log(route)

    const userRole = localStorage.getItem('userRole')?.toLowerCase(); 

    console.log('Expected:', expectedRole);
    console.log('From Storage:', userRole);

    if (userRole === expectedRole) {
      return true;
    } else {
      this.router.navigate(['/not-authorized']);
      alert('You dont have an access')
      return false;
    }
  }
}
