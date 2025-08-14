import { Component, inject } from '@angular/core';
import { ReusableTableComponent } from "../../shared/reusable-table/reusable-table.component";
import { IonicModule, ModalController } from '@ionic/angular';
import { RegisterComponent } from '../../shared/register/register.component';
import { ConfirmDeleteComponent } from '../../pop-ups/confirm-delete/confirm-delete.component';
import { RegisterStore } from '../../state/register.store';
import { CommonModule } from '@angular/common';
import { Constants } from '../../constants/string-constants';

@Component({
  selector: 'app-managers',
  standalone: true,
  imports: [ReusableTableComponent, CommonModule,IonicModule],
  providers: [RegisterStore],
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.scss'
})
export class ManagersComponent {

  label = 'Manager';
  private modalController = inject(ModalController);

  private registerStore = inject(RegisterStore);
  managerList$!: any;
  isLoading$ = this.registerStore.select(state => state.loading);
  page = 0;
  pageSize = 5;

  constructor(){
    this.loadManagers(this.page,this.pageSize);
  }

  columns = [
    { header: 'Manager ID', field: 'personId' },
    { header: 'Manager Name', field: 'firstName' },
    { header: 'Mail id', field: 'email' },
    { header: 'Project', field: 'projectNames' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] },
  ];

   handleRowAction(event: any) {
    switch (event.type) {
      case 'create':
        this.loadCreateEmployeeModal();
        break;
      case 'edit':
        this.editCreateEmployeeModal(event.item);
        break;
      case 'delete':
        this.deleteModal(event.item);
        break;
      case 'nextPage':
        this.page=event.item;
        this.loadManagers(this.page,this.pageSize);
       break;
        case 'pageSize':
        this.pageSize=event.item;
        this.loadManagers(this.page,this.pageSize);
        break;
      default:
        console.log('Unknown action type:');
    }
  }

  loadCreateEmployeeModal() {
    this.modalController.create({
      component: RegisterComponent,
      //  cssClass: 'custom-modal',
      componentProps: {
        role: 'manager',
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
        this.registerStore.getRegisterData({ page: this.page, size: this.pageSize, sortBy: 'firstName', url:Constants.ROLE_MANAGER });
        console.log('Modal dismissed with data:', data);
        // Handle any data returned from the modal if needed
      });
    });
  }

  editCreateEmployeeModal(item: any) {
    this.modalController.create({
      component: RegisterComponent,
      //  cssClass: 'custom-modal',
      componentProps: {
        role: 'manager',
        editData: item,
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
        this.registerStore.getRegisterData({ page: this.page, size: this.pageSize, sortBy: 'firstName', url:Constants.ROLE_MANAGER});
        console.log('Modal dismissed with data:12345667', data);
        // Handle any data returned from the modal if needed
      });
    });
  }
  deleteModal(item: any) {

    console.log('Selected row data for deletion:', item);
    this.modalController.create({
      component: ConfirmDeleteComponent,
      cssClass: 'custom-delete-modal',

       componentProps: {
        role: 'delete',
        data: {
          id: item.personId,
          name: item.firstName,

        }
      }
     
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((result) => {
        if (result?.data?.confirmed) {
          this.registerStore.deleteProject(result.data.id);
        }
      });
    });
  }

  loadManagers(pageNum:number,pageSize:number){
  this.registerStore.getRegisterData({ page: pageNum, size: pageSize, sortBy: 'firstName', url:Constants.ROLE_MANAGER });
  this.managerList$ = this.registerStore.register$;
}
}
