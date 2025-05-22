import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './features/header/header.component';
import { ToastComponent } from './shared/toast/toast.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,IonicModule,ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'report-summary';

  private router= inject(Router)
  isLoggedIn=true;

  navigateToWkSmry(){
    this.router.navigate(['/summary'])
  
  }
}
