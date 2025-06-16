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
 
  updatedBreadCrumb: BreadcrumbItem[] = [];
  extendedRoute:any;

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
          this.extendedRoute=route.snapshot.paramMap.get('id');
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.buildBreadcrumbs(this.router.url);
      });
  }

  breadcrumbConfig: { label: any; url: string }[] = [
    { label: 'Home', url: '/home' },
    { label: 'Projects', url: '/projects' },
    { label: 'Weekly Summary', url: '/summary' },
    { label: 'Managers', url: '/managers' },
    { label: 'Weekly Status Update', url: '/employee-dashboard' },
    { label: 'Employees', url: '/projects/employees' },
    { label: 'Employees', url: '/employees' },
    { label: 'View Individual Project Status', url: '/summary/task/:id' },
    { label: 'View Reports', url: '/summary/project-status/:id' }
  ];
     breadcrumbLabel():any {
      this.activatedRoute.paramMap.subscribe(params => {
        return  params.get('id');
});

  //return this.activatedRoute.snapshot.paramMap.get('id') || 'Unknown';
  }

  // buildBreadcrumbs(url: string): void {
  //   const urlSegments = url.split('/').filter(segment => segment !== '');
  //   const breadcrumbs: BreadcrumbItem[] = [];

  //   let currentUrl = '';
  //   urlSegments.forEach(segment => {
  //     currentUrl += `/${segment}`;
  //     const breadcrumbConfig = this.breadcrumbConfig.find(config => config.url === currentUrl);
  //     console.log(breadcrumbConfig)
  //     if (breadcrumbConfig) {
  //       breadcrumbs.push({
  //         label: breadcrumbConfig.label,
  //         url: currentUrl
  //       });
  //     }
  //     // if(currentUrl==='/summary/project-status'){
  //     //     breadcrumbs.push({
  //     //     label: Weekly,
  //     //     url: currentUrl
  //     //   });
  //     // }
  //     this.updatedBreadCrumb = breadcrumbs;
  //   });

  //   this.breadcrumbStore.updateBreadcrumbs(breadcrumbs);
  // }

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
    } else if (segment.startsWith('project-status')) {
      // Handle dynamic segment for project status
      const id = urlSegments[urlSegments.length - 1]; // Get the last segment as ID
      breadcrumbs.push({
        label: `View Reports /  ${id}`, // Customize the label as needed
        url: currentUrl
      });
    }
    else if (segment.startsWith('task')){
     const id = urlSegments[urlSegments.length - 1]; // Get the last segment as ID
      breadcrumbs.push({
        label: `View Individual Project Status /  ${id}`, // Customize the label as needed
        url: currentUrl
      });
    
    }

    this.updatedBreadCrumb = breadcrumbs;
  });

  this.breadcrumbStore.updateBreadcrumbs(breadcrumbs);
}

}
