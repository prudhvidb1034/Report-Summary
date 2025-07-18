import { Component, inject } from '@angular/core';
import { ReusableTableComponent } from "../../shared/reusable-table/reusable-table.component";
import { of } from 'rxjs';
import { CreateWeeklyReportComponent } from '../../pop-ups/create-weekly-report/create-weekly-report.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-weekly-report',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './weekly-report.component.html',
  styleUrl: './weekly-report.component.scss'
})
export class WeeklyReportComponent {
label = 'Weekly Report';
 private modalController = inject(ModalController);
  columns = [
    { header: 'Week Number', field: 'weeknumber' },
    { header: 'Week Start Date', field: 'startdate' },
    { header: 'Week End Date', field: 'enddate' },
       { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];
weeklysprintList$ = of({
  content: [
    {
      weeknumber: 1,
      startdate: '2025-07-01',
      enddate: '2025-07-07'
    },
    {
      weeknumber: 2,
      startdate: '2025-07-08',
      enddate: '2025-07-14'
    },
    {
      weeknumber: 3,
      startdate: '2025-07-15',
      enddate: '2025-07-21'
    }
  ],
  totalElements: 3,
  pageSize: 10,
  pageNumber: 0
});
  handleRowAction(event: any) {
    switch (event.type) {
      case 'create':
         this.loadCreateEmployeeModal();
        break;
      case 'delete':
        if (event.type === 'delete') {
          console.log('Row from table:', event.item);

        }
        // this.deleteModal(event.row);
        break;
      case 'edit':

        break;

      default:
        console.log('Unknown action type:', event.type);
    }
  }

     loadCreateEmployeeModal() {
        this.modalController.create({
          component: CreateWeeklyReportComponent,
          cssClass: 'create-account-modal',
          componentProps: {
    
          }
        }).then((modal) => {
          modal.present();
          modal.onDidDismiss().then((data) => {
         
            console.log('Modal dismissed with data:', data);
          });
        });
      }
  
}
