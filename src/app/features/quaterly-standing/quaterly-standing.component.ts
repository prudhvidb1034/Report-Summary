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
  label = '';
  quaterlyReport = inject(QuaterlyReportStore);
  commonStore = inject(CommonStore);
  quaterlyReports$: any;
  page = 0;
  pageSize = 5;
  content: any = [];
  private modalController = inject(ModalController);
  // ngOnInit() {
  //   this.quaterlyReport.getQuaterlyReports({ page: this.page, size: this.pageSize })
  //   this.quaterlyReports$ = this.quaterlyReport.quaterlyReport$
  //   this.quaterlyReport.quaterlyReport$.subscribe((val: any) => {
  //     this.content = val?.content;
  //     console.log(this.content);
      
  //     this.content.map((res: any) => {
  //       console.log(res);
        
  //       this.label = `PI${res?.piNumber}Standing`;
  //     })
  //   })

  // }

  ngOnInit() {
  this.quaterlyReport.getQuaterlyReports({ page: this.page, size: this.pageSize });
  this.quaterlyReports$ = this.quaterlyReport.quaterlyReport$;

  this.quaterlyReport.quaterlyReport$.subscribe((val: any) => {
    this.content = val?.content;
    console.log(this.content);

    if (Array.isArray(this.content)) {
      this.content.map((res: any) => {
        console.log(res);
        this.label = `PI${res?.piNumber}Standing`;
      });
    } else {
      console.warn('content is not an array:', this.content);
    }
  });
}

  columns = [
    { header: 'Team', field: 'projectName' },
    { header: 'Feature', field: 'feature' },
    { header: 'Sprint 0', field: 'sprint0' },
    { header: 'Sprint 1', field: 'sprint1' },
    { header: 'Sprint 2', field: 'sprint2' },
    { header: 'Sprint 3', field: 'sprint3' },
    { header: 'Sprint 4', field: 'sprint3' },
    { header: '% of Completion', field: 'completionPercentage' },
    { header: 'Status', field: 'status' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];


  handleRowAction(event: any) {
    switch (event.type) {
      case 'create':
        this.createQuaterlyReport();
        break;
      case 'edit':
        this.UpdateQuaterlyReport(event.item);
        break;
      case 'delete':
        this.deleteModal(event.item);
      //   break;
      // case 'nextPage':
      //   this.page = event.item;
      //   this.loadAccounts(this.page, this.pageSize)
      //   break;
      // case 'pageSize':
      //   this.pageSize = event.item;
      //   this.loadAccounts(this.page, this.pageSize)
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
