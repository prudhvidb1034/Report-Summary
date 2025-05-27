import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SummaryStore } from '../../state/summary.store';

@Component({
  selector: 'app-view-reports',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './view-reports.component.html',
  styleUrl: './view-reports.component.scss',
  providers:[SummaryStore]
  
})
export class ViewReportsComponent {

  private summary = inject(SummaryStore)
   ngOnInit(){
    // this.summary.projects$.subscribe((s)=>{
    //   console.log(s);

    // })
    // console.log(this.summary.getDetails())
   }
}
