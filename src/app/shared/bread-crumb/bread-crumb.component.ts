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


 interface Project {
  projectName: string;
}

interface ProjectsMap {
  [key: string]: Project[];
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
 weekName=[{name:'WEEK 01-June-2025 To 07-June-2025'},{name:'WEEK 08-June-2025 To 14-June-2025'}]


projects: { projects: ProjectsMap } = {
  projects: {
    "04da": [{ projectName: "Customer-365" }],
    "1be0": [{ projectName: "Onboarding/Initio" }],
    "83f2": [{ projectName: "spp canada" }]
  }
};
  name: any;


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
          const nav = this.router.getCurrentNavigation();
          this.name = nav?.extras.state?.['name']
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.buildBreadcrumbs(this.router.url);
      });
    // const nav = this.router.getCurrentNavigation();
    // console.log("nav",nav)
    // this.projectName = nav?.extras.state?.['projectName']

  }

  breadcrumbConfig: { label: any; url: string }[] = [
    { label: 'Home', url: '/home' },
    {label:'Accounts',url:'/accounts'},
    { label: 'Projects', url: '/projects' },
    { label: 'Weekly Summary', url: '/summary' },
    { label: 'Managers', url: '/managers' },
    { label: 'Weekly Status Update', url: '/employee-dashboard' },
    { label: 'Employees', url: '/projects/employees/:id' },
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
        label: this.renameFunc(id) +' '+'/'+' '+'Reports', // Customize the label as needed
        url: currentUrl
      });
    }
    else if (segment.startsWith('task')){
     const id = urlSegments[urlSegments.length - 1]; // Get the last segment as ID
      breadcrumbs.push({
        label:this.name +' '+'/'+' '+'Task', // Customize the label as needed
        url: currentUrl
      });
    }
    else if(segment.startsWith('employees')){
      const id = urlSegments[urlSegments.length - 1]; // Get the last segment as ID
      breadcrumbs.push({
        label:this.name +' '+'/'+' '+'Employees', // Customize the label as needed
        url: currentUrl
      });
    }

    this.updatedBreadCrumb = breadcrumbs;
  });

  this.breadcrumbStore.updateBreadcrumbs(breadcrumbs);
}

getProjectName(id: string): string | undefined {
  return this.projects.projects[id]?.[0]?.projectName;
}

renameFunc(id:any){
 return this.weekName[id].name;
}

}
