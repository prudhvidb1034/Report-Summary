import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface Breadcrumb {
  label: string;
  url: string;
}

export interface BreadcrumbState {
  breadcrumbs: Breadcrumb[];
}

@Injectable()
export class BreadcrumbStore extends ComponentStore<BreadcrumbState> {
  constructor(private router: Router) {
    super({ breadcrumbs: [] });

    this.router.events
      .pipe(
        tap(() => {
          const root = this.router.routerState.snapshot.root;
          const breadcrumbs: Breadcrumb[] = [];
          this.buildBreadcrumbs(root, [], breadcrumbs);
          this.setState({ breadcrumbs });
        })
      )
      .subscribe();
  }

  private buildBreadcrumbs(
    route: any,
    url: string[] = [],
    breadcrumbs: Breadcrumb[] = []
  ): void {
    const children: any[] = route.children;

    if (children.length === 0) {
      return;
    }

    for (const child of children) {
      const routeURL: string = child.url.map((segment: any) => segment.path).join('/');
      if (child.data['breadcrumb']) {
        const breadcrumb: Breadcrumb = {
          label: child.data['breadcrumb'],
          url: `${url.join('/')}/${routeURL}`,
        };
        breadcrumbs.push(breadcrumb);
      }
      this.buildBreadcrumbs(child, [...url, routeURL], breadcrumbs);
    }
  }

  readonly breadcrumbs$ = this.select((state) => state.breadcrumbs);
}
