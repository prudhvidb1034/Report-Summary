import { Component, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { ReusableTableComponent } from '../../shared/reusable-table/reusable-table.component';
import { CreateSprintComponent } from '../../pop-ups/create-sprint/create-sprint.component';
import { SprintStore } from '../../state/sprint.store';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  Router } from '@angular/router';
import { ConfirmDeleteComponent } from '../../pop-ups/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-sprints',
  standalone: true,
  imports: [ReusableTableComponent, IonicModule, FormsModule, CommonModule],
  providers: [SprintStore],
  templateUrl: './sprints.component.html',
  styleUrl: './sprints.component.scss'
})
export class SprintsComponent {

  label = 'Sprint';
  private modalController = inject(ModalController);
  private sprintSore = inject(SprintStore);
  isLoading$ = this.sprintSore.select(state => state.loading);
  page = 0;
  pageSize = 5;
  sprintList$: any;
  private router = inject(Router);



  constructor() {
    this.loadSprint(this.page, this.pageSize)
  }

  navigate(event: any) {
    if (event.columnName === 'Weekly Report') {
      this.router.navigateByUrl('sprints/create-weekly-sprint' + '/' + event.item.sprintId, { state: { sprintName: event.item.sprintName } });
    } else if (event.columnName === 'Pi3 Standing') {
      this.router.navigateByUrl('quaterly-standing');
    }
    else if (event.columnName === 'View Resource') {
      this.router.navigateByUrl('sprints/view-resource' + '/' + event.item.sprintId, { state: { sprintName: event.item.sprintName } });
    } else if (event.columnName === 'Dependencies') {
      this.router.navigateByUrl('sprints/dependencies' + '/' + event.item.sprintId, { state: { sprintName: event.item.sprintName } });
    }
    else {
      this.router.navigateByUrl('sprints/sprint-report' + '/' + event.item.sprintId,{ state: { sprintName: event.item.sprintName } })
    }
  }


  columns = [
    { header: 'Sprint Number', field: 'sprintNumber' },
    { header: 'Sprint Name', field: 'sprintName' },
    { header: 'From Date', field: 'fromDate' },
    { header: 'To Date', field: 'toDate' },
    { header: 'View Resource', field: 'View', linkEnable: true, link: '/view-resource' },
    { header: 'Dependencies', field: 'View', linkEnable: true, link: '/dependencies' },
    { header: 'Weekly Report', field: 'View', linkEnable: true, link: '/create-weekly-sprint' },
    { header: 'Status', field: 'status' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] },
    { header: 'OverAll Report', field: 'View', linkEnable: true, link: '/sprint-report' }
  ];
  handleRowAction(event: any) {
    switch (event.type) {
      case 'create':
        this.loadCreateEmployeeModal();
        break;
      case 'delete':
        this.deleteModal(event.item);
        break;
      case 'nextPage':
        this.page = event.item;
        this.loadSprint(this.page, this.pageSize);
        break;
      case 'pageSize':
        this.pageSize = event.item;
        this.loadSprint(this.page, this.pageSize);
        break;
      case 'edit':
        this.updateCreateEmployeeModal(event.item);
        break;
      case 'navigate':
        this.navigate(event);
        break;
      case 'toggle-status':
        this.toggleAPI(event);
        break;  
      default:
        console.log('Unknown action type:', event.type);
    }
  }

  loadSprint(pageNum: number, pageSize: number) {
    this.sprintSore.getSprintDetails({ page: pageNum, size: pageSize });
    this.sprintList$ = this.sprintSore.sprint$;
  }

  toggleAPI(event:any){
    this.sprintSore.toggleStatus(event.item.sprintId)
    console.log("toggle",event);
  }

  loadCreateEmployeeModal() {
    this.modalController.create({
      component: CreateSprintComponent,
      cssClass: 'create-account-modal',
      componentProps: {

      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((val) => {
        if (val.data) {
          this.loadSprint(this.page, this.pageSize);
        }
        console.log('Modal dismissed with data:', val.data);
      });
    });
  }

  // navigateToQuaterlyStandingReport{

  // }

  updateCreateEmployeeModal(item: any) {
    this.modalController.create({
      component: CreateSprintComponent,
      cssClass: 'create-account-modal',
      componentProps: {
        editData: item
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((val) => {
        if (val.data) {
          this.loadSprint(this.page, this.pageSize);
        }
        console.log("Model", val.data)
        // this.accountStore.getAccounts();
        console.log('Modal dismissed with data:', val.data);
      });
    });
  }


  deleteModal(item: any) {
    this.modalController.create({
      component: ConfirmDeleteComponent,
      cssClass: 'custom-delete-modal',
      componentProps: {
        role: 'delete',
        data: {
          id: item.sprintId,
          name: item.sprintName,

        }
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((result) => {
        if (result?.data?.confirmed) {
          this.sprintSore.deleteAccount(result.data.id);
        }
      });
    });
  }

}


