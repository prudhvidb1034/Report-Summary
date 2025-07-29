import { Component, inject } from '@angular/core';
import { ReusableTableComponent } from '../../shared/reusable-table/reusable-table.component';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-quaterly-standing',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './quaterly-standing.component.html',
  styleUrl: './quaterly-standing.component.scss'
})
export class QuaterlyStandingComponent {
accountList$: any;
label='Pi3 Standing'
quaterlyList$:any=[];
 private modalController = inject(ModalController);
  ngOnInit() {

  }
 columns = [
    { header: 'Team', field: 'accountName' },
    { header: 'Feature', field: 'accountStartDate' },
    { header: 'Sprint 0', field: 'accountEndDate' },
    { header: 'Sprint 1', field: 'accountEndDate' },
    { header: 'Sprint 2', field: 'accountEndDate' },
    { header: 'Sprint 4', field: 'accountEndDate' },
    { header: '% of Completion', field: 'accountEndDate' },
    { header: 'Status', field: 'accountEndDate' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];


    handleRowAction(event: any) {
       switch (event.type) {
      case 'create':
        this.loadCreateQuaterlyReport();
        break;
        default:
        console.log('failing')
    }
  }

  loadCreateQuaterlyReport(){
  //   this.modalController.create({
  //         component: CreateProjectComponent,
  //         cssClass: 'create-project-modal',
  //         componentProps: {
    
  //         }
  //       }).then((modal) => {
  //         modal.present();
  //         modal.onDidDismiss().then((data) => {
  //         // this.loadProjects(this.page,this.pageSize);
    
  //           console.log('Modal dismissed with data:', data);
  //           // Handle any data returned from the modal if needed
  //         });
  //       });
   }
}
