import {  provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import 'zone.js'; // Import before bootstrapping


import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { ViewAllProjectsComponent } from './features/view-all-projects/view-all-projects.component';

export const appConfig: ApplicationConfig = {
   providers: [
    provideHttpClient(),
    provideIonicAngular(),
    provideRouter(
      [
        ...routes, // Include your existing routes from app.routes.ts
        { path: '', component: ViewAllProjectsComponent } // Add your additional route
      ],
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideStore()
  ]
};
