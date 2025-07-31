import { Component, inject } from '@angular/core';
import { ReusableTableComponent } from "../../shared/reusable-table/reusable-table.component";
import { CommonStore } from '../../state/common.store';
import { PiPgrogressStore } from '../../state/pi-progress.store';
import { ModalController } from '@ionic/angular';
import { CreatePiProgressComponent } from '../../pop-ups/create-pi-progress/create-pi-progress.component';

@Component({
  selector: 'app-pi-progress',
  standalone: true,
  imports: [ReusableTableComponent],
  providers: [PiPgrogressStore, CommonStore],
  templateUrl: './pi-progress.component.html',
  styleUrl: './pi-progress.component.scss'
})
export class PiProgressComponent {

  accountList$: any;
  label = 'PI Progress'
  piprogressReport = inject(PiPgrogressStore);
  commonStore = inject(CommonStore);
  piprogressReport$: any;
  private modalController = inject(ModalController);
  ngOnInit() {
    this.piprogressReport.getPipgrogressReports()
    this.piprogressReport$ = this.piprogressReport.piprogressReport$
  }



  columns = [
    { header: 'Team', field: 'team' },
    { header: 'Lead Name', field: 'leadName' },
    { header: 'Assigned SP', field: 'assignedSP' },
    { header: 'Completed SP', field: 'completedSP' },
    { header: '% of Completion', field: 'percentOfCompletion' },

    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];

  handleRowAction(event: any) {
    switch (event.type) {
      case 'create':
        this.loadPiProgressReport();
        break;
      case 'edit':
        this.UpdatePiProgressReport(event.item);
        break;
      // case 'delete':
      //   this.deleteModal(event.item);
      //   break;
      default:
        console.log('failing')
    }
  }

  loadPiProgressReport() {
    this.modalController.create({
      component: CreatePiProgressComponent,
      cssClass: 'create-account-modal',
      componentProps: {

      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
        // this.loadProjects(this.page,this.pageSize);

        console.log('Modal dismissed with data:', data);
        // Handle any data returned from the modal if needed
      });
    });
  }

  UpdatePiProgressReport(item: any) {
    console.log('Selected row data:', item);
    this.modalController.create({
      component: CreatePiProgressComponent,
      cssClass: 'create-account-modal',
      componentProps: {
        editData: item
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
        // this.loadProjects(this.page,this.pageSize);

        console.log('Modal dismissed with data:', data);
        // Handle any data returned from the modal if needed
      });
    });
  }
}
