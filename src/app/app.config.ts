import {  provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import 'zone.js'; // Import before bootstrapping


import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { jwtInterceptor } from './interceptor/jwt.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        jwtInterceptor
      ])
    ),
    provideIonicAngular(),
    provideRouter(routes),
    provideStore()
]
};
