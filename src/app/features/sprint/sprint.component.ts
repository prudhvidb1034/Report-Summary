import { Component, inject } from '@angular/core';
import { ReusableTableComponent } from "../../shared/reusable-table/reusable-table.component";
import { of } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { CreateSprintComponent } from '../../pop-ups/create-sprint/create-sprint.component';

@Component({
  selector: 'app-sprint',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './sprint.component.html',
  styleUrl: './sprint.component.scss'
})
export class SprintComponent {
  label = 'Sprint';
 private modalController = inject(ModalController);
  columns = [
    { header: 'Sprint Number', field: 'sprintnumber' },
    { header: 'Sprint Name', field: 'sprintname' },
    { header: 'From Date', field: 'fromdate' },
    { header: 'To Date', field: 'todate' },
     { header: 'Weekly Report',field: 'View', linkEnable: true, link: '/create-weekly-sprint' },
      { header: 'Viewall Report', field: 'View', linkEnable: true, link: '/sprint-report' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];
sprintList$ = of({
  content: [
    {
      sprintnumber: 1,
      sprintname: 'Sprint Alpha',
      fromdate: '2025-07-01',
      todate: '2025-07-15'
    },
    {
      sprintnumber: 2,
      sprintname: 'Sprint Beta',
      fromdate: '2025-07-16',
      todate: '2025-07-30'
    },
    {
      sprintnumber: 3,
      sprintname: 'Sprint Gamma',
      fromdate: '2025-08-01',
      todate: '2025-08-15'
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
        component: CreateSprintComponent,
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
