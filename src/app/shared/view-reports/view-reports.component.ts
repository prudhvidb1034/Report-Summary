import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SummaryStore } from '../../state/summary.store';
import { LoginStore } from '../../state/login.store';

@Component({
  selector: 'app-view-reports',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './view-reports.component.html',
  styleUrl: './view-reports.component.scss',
  providers:[SummaryStore,LoginStore]
  
})
export class ViewReportsComponent {

  private login = inject(LoginStore)
   ngOnInit(){
   }
}
