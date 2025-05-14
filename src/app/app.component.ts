import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';
import { IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';
import { IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { DashboardComponent } from './dashboard/dashboard.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'report-summary';
}
