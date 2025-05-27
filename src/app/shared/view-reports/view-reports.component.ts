import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SummaryStore } from '../../state/summary.store';

@Component({
  selector: 'app-view-reports',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './view-reports.component.html',
  styleUrl: './view-reports.component.scss'
})
export class ViewReportsComponent {

  private summary = inject(SummaryStore)
   ngOnInit(){
    console.log(this.summary)
   }
}
