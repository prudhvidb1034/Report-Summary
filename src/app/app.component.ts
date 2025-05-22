import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './features/header/header.component';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,IonicModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'report-summary';

    private readonly http = inject(HttpClient);
       private readonly apiUrl = 'http://localhost:3000/register';
  

  private router= inject(Router)
  isLoggedIn=true;



  navigateToWkSmry(){
    this.router.navigate(['/summary'])
  
  }
    navigateToProjectUpdate(){
    this.router.navigate(['/employee-update'])
  
  }
}
