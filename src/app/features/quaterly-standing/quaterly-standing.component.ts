import { Component, inject } from '@angular/core';
import { ReusableTableComponent } from '../../shared/reusable-table/reusable-table.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { CreateQuaterlyStandingComponent } from '../../pop-ups/create-quaterly-standing/create-quaterly-standing.component';
import { Observable, of } from 'rxjs';
import { CommonStore } from '../../state/common.store';
import { QuaterlyReportStore } from '../../state/quaterlyStanding.store';
import { CommonModule } from '@angular/common';
import { ConfirmDeleteComponent } from '../../pop-ups/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-quaterly-standing',
  standalone: true,
  providers: [QuaterlyReportStore, CommonStore],
  imports: [ReusableTableComponent, CommonModule],
  templateUrl: './quaterly-standing.component.html',
  styleUrl: './quaterly-standing.component.scss'
})
export class QuaterlyStandingComponent {
  accountList$: any;
  label = 'PI Standing'
  quaterlyReport = inject(QuaterlyReportStore);
  commonStore = inject(CommonStore);
  quaterlyReport$: any;
  private modalController = inject(ModalController);
  ngOnInit() {
    this.quaterlyReport.getQuaterlyReports()
    this.quaterlyReport$ = this.quaterlyReport.quaterlyReport$
  }
  columns = [
    { header: 'Team', field: 'team' },
    { header: 'Feature', field: 'feature' },
    { header: 'Sprint 0', field: 'sprint0' },
    { header: 'Sprint 1', field: 'sprint1' },
    { header: 'Sprint 2', field: 'sprint2' },
    { header: 'Sprint 3', field: 'sprint3' },
    { header: '% of Completion', field: 'completion' },
    { header: 'Status', field: 'statusReport' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];

  //  quaterlyList$: Observable<any[]> = of([
  //     {
  //       accountName: 'Team Alpha',
  //       feature: 'User Authentication',
  //       sprint0: 'Completed setup',
  //       sprint1: 'Login/Logout done',
  //       sprint2: 'OAuth integration',
  //       sprint4: 'MFA & testing',
  //       percentage: '90%',
  //       status: 'In Progress',
  //       action: null
  //     },
  //     {
  //       accountName: 'Team Beta',
  //       feature: 'Dashboard Analytics',
  //       sprint0: 'Wireframes ready',
  //       sprint1: 'Chart components done',
  //       sprint2: 'API integration',
  //       sprint4: 'Bug fixes',
  //       percentage: '100%',
  //       status: 'Completed',
  //       action: null
  //     },
  //     {
  //       accountName: 'Team Gamma',
  //       feature: 'Notification System',
  //       sprint0: 'Requirements gathering',
  //       sprint1: 'Basic alerts',
  //       sprint2: 'Push notifications',
  //       sprint4: 'Email + SMS integration',
  //       percentage: '75%',
  //       status: 'In Progress',
  //       action: null
  //     }
  //   ]);

  handleRowAction(event: any) {
    switch (event.type) {
      case 'create':
        this.loadCreateQuaterlyReport();
        break;
      case 'edit':
        this.UpdateQuaterlyReport(event.item);
        break;
      case 'delete':
        this.deleteModal(event.item);
        break;
      default:
        console.log('failing')
    }
  }


  loadCreateQuaterlyReport() {
    this.modalController.create({
      component: CreateQuaterlyStandingComponent,
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

  UpdateQuaterlyReport(item: any) {
    console.log('Selected row data:', item);
    this.modalController.create({
      component: CreateQuaterlyStandingComponent,
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

  deleteModal(item: any) {
    console.log(item);
    
    this.modalController.create({
      component: ConfirmDeleteComponent,
      cssClass: 'custom-delete-modal',
      componentProps: {
        role: 'delete',
        data: {
          id: item.id,
          name: item.team,

        }
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((result) => {
        console.log(result);
        
        if (result?.data?.confirmed) {
          this.quaterlyReport.deleteQuaterlyReport(result.data.id);
        }
      });
    });
  }
}
