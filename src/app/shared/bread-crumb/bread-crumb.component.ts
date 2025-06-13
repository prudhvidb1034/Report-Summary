import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterLink } from '@angular/router';
import { filter, map, distinctUntilChanged } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { Injectable } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

interface BreadcrumbItem {
  label: string;
  url: string;
}

interface BreadcrumbState {
  breadcrumbs: BreadcrumbItem[];
}

@Injectable()
class BreadcrumbStore extends ComponentStore<BreadcrumbState> {
  constructor() {
    super({ breadcrumbs: [] });
  }

  readonly breadcrumbs$ = this.select((state) => state.breadcrumbs);

  readonly updateBreadcrumbs = this.updater((state, breadcrumbs: BreadcrumbItem[]) => ({
    ...state,
    breadcrumbs: breadcrumbs,
  }));
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './bread-crumb.component.html',
  styleUrl: './bread-crumb.component.scss',
  imports: [IonicModule, RouterLink, CommonModule],
  providers: [BreadcrumbStore],
  standalone: true
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs$: Observable<BreadcrumbItem[]>;
  // Define your breadcrumb configuration here
  breadcrumbConfig: { label: string; url: string }[] = [
    { label: 'Home', url: '/home' },
    {label:'Login',url:'/login'},
    { label: 'Projects', url: '/projects' },
    { label: 'Employees', url: '/projects/employees' },
    {label:'View Report',url:'/project-status'}
  ];
  updatedBreadCrumb: BreadcrumbItem[]=[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbStore: BreadcrumbStore
  ) {
    this.breadcrumbs$ = this.breadcrumbStore.breadcrumbs$;
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.buildBreadcrumbs(this.router.url);
      });
  }

  buildBreadcrumbs(url: string): void {
    const urlSegments = url.split('/').filter(segment => segment !== '');
    const breadcrumbs: BreadcrumbItem[] = [];

    let currentUrl = '';
    urlSegments.forEach(segment => {
      currentUrl += `/${segment}`;
      const breadcrumbConfig = this.breadcrumbConfig.find(config => config.url === currentUrl);

      if (breadcrumbConfig) {
        breadcrumbs.push({
          label: breadcrumbConfig.label,
          url: currentUrl
        });
      }
      this.updatedBreadCrumb=breadcrumbs;
    });

    this.breadcrumbStore.updateBreadcrumbs(breadcrumbs);
  }
}
