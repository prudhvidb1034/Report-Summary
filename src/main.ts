import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { addIcons } from 'ionicons';
import { trashOutline, createOutline } from 'ionicons/icons';
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  addIcons({
    'trash-outline': trashOutline,
    'create-outline': createOutline
  });