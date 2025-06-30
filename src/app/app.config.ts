import {  provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import 'zone.js'; // Import before bootstrapping


import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { httpInterceptor } from './interceptor/http.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        httpInterceptor
      ])
    ),
    provideIonicAngular(),
    provideRouter(routes),
    provideStore()
]
};
