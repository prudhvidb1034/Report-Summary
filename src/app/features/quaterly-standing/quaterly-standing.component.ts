import { Component, inject } from '@angular/core';
import { ReusableTableComponent } from '../../shared/reusable-table/reusable-table.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { CreateQuaterlyStandingComponent } from '../../pop-ups/create-quaterly-standing/create-quaterly-standing.component';
import { CommonStore } from '../../state/common.store';
import { QuaterlyReportStore } from '../../state/quaterlyStanding.store';
import { CommonModule } from '@angular/common';
import { ConfirmDeleteComponent } from '../../pop-ups/confirm-delete/confirm-delete.component';
import { Observable } from 'rxjs';
import { SprintData, SprintDataResponse } from '../../models/quaterly.model';


@Component({
  selector: 'app-quaterly-standing',
  standalone: true,
  providers: [QuaterlyReportStore],
  imports: [ReusableTableComponent, CommonModule,CommonModule,IonicModule],
  templateUrl: './quaterly-standing.component.html',
  styleUrl: './quaterly-standing.component.scss'
})
export class QuaterlyStandingComponent {
  label = 'PI Standing';
  quaterlyReport = inject(QuaterlyReportStore);
  commonStore = inject(CommonStore);
  quaterlyReports$!: Observable<SprintDataResponse>;
  page = 0;
  pageSize = 5;
  private modalController = inject(ModalController);
  isLoading$ = this.quaterlyReport.select(state => state.loading);
  isLoadingCommon$=this.commonStore.select(state=>state.loading);

  ngOnInit() {
  this.quaterlyReport.getQuaterlyReports({ page: this.page, size: this.pageSize });
  this.quaterlyReports$ = this.quaterlyReport.quaterlyReport$;
}

  columns = [
    { header: 'Team', field: 'projectName' },
    { header: 'Feature', field: 'feature' },
    { header: 'Sprint 0', field: 'sprint0' },
    { header: 'Sprint 1', field: 'sprint1' },
    { header: 'Sprint 2', field: 'sprint2' },
    { header: 'Sprint 3', field: 'sprint3' },
    { header: 'Sprint 4', field: 'sprint4' },
    { header: '% of Completion', field: 'completionPercentage' },
    { header: 'Status', field: 'statusReport' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];


  handleRowAction(event: { type: string, item: SprintData}) {
    switch (event.type) {
      case 'create':
        this.createQuaterlyReport();
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


  loadAccounts(pageNum: number, pageSize: number) {
    this.quaterlyReport.getQuaterlyReports({ page: pageNum, size: pageSize });
    this.quaterlyReports$ = this.quaterlyReport.quaterlyReport$
  }

  createQuaterlyReport() {
    this.modalController.create({
      component: CreateQuaterlyStandingComponent,
      cssClass: 'reusable-popUp-modal',
      componentProps: {

      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then(() => {
this.quaterlyReport.getQuaterlyReports({ page: this.page, size: this.pageSize })
      });
    });
  }

  UpdateQuaterlyReport(item: SprintData) {
    console.log('Selected row data:', item);
    this.modalController.create({
      component: CreateQuaterlyStandingComponent,
      cssClass: 'create-account-modal',
      componentProps: {
        editData: item
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then(() => {
      this.quaterlyReport.getQuaterlyReports({ page: this.page, size: this.pageSize })
      });
    });
  }

  deleteModal(item: SprintData) {
    console.log(item.id);

    this.modalController.create({
      component: ConfirmDeleteComponent,
      cssClass: 'custom-delete-modal',
      componentProps: {
        role: 'delete',
        data: {
          id: item.id,
          name: item.projectName,

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
