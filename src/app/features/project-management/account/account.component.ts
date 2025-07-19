import { Component, inject } from '@angular/core';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { ReusableTableComponent } from "../../../shared/reusable-table/reusable-table.component";
import { ConfirmDeleteComponent } from '../../../pop-ups/confirm-delete/confirm-delete.component';
import { ReusablePopUpComponent } from '../../../pop-ups/reusable-pop-up/reusable-pop-up.component';
import { CreateAccountComponent } from '../../../pop-ups/create-account/create-account.component';
import { AccountStore } from '../../../state/account.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [ReusableTableComponent, CommonModule,IonicModule],
  providers: [AccountStore],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountCreateComponent {
  private modalController = inject(ModalController);
  label = 'Account';

  accountStore = inject(AccountStore);
  accountList$: any;
isLoading$ = this.accountStore.select(state => state.loading);
page=0;
pageSize=5;


constructor() {
    this.loadAccounts(this.page,this.pageSize)
    // this.accountStore.getAccounts({ page: this.page, size: this.pageSize, sortBy: 'accountName' });
    // this.accountList$ = this.accountStore.account$;
  }


  ngOnInit() {

  }


  columns = [
    { header: 'Account Name', field: 'accountName' },
    { header: 'Start Date', field: 'accountStartDate' },
    { header: 'End Date', field: 'accountEndDate' },

    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];




  handleRowAction(event: any) {
    switch (event.type) {
      case 'create':
        this.loadCreateEmployeeModal();
        break;
      case 'delete':
        if (event.type === 'delete') {
          console.log('Row from table:', event.item);
          this.deleteModal(event.item); 
        }
        // this.deleteModal(event.row);
        break;
      case 'edit':
        this.updateCreateEmployeeModal(event.item);
        // this.updateCreateEmployeeModal(event.row);
        break;
      case 'nextPage':
        this.page=event.item;
        this.loadAccounts(this.page,this.pageSize)
       break;
        case 'pageSize':
        this.pageSize=event.item;
        this.loadAccounts(this.page,this.pageSize)
       break;  
      default:
        console.log('Unknown action type:', event.type);
    }
  }


  loadAccounts(pageNum:number,pageSize:number){
   this.accountStore.getAccounts({ page: pageNum, size: pageSize, sortBy: 'accountName' });
    this.accountList$ = this.accountStore.account$;
  }

  loadCreateEmployeeModal() {
    this.modalController.create({
      component: CreateAccountComponent,
      cssClass: 'create-account-modal',
      componentProps: {

      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
      //  this.accountStore.getAccounts(); // Refresh the account list after modal is dismissed
        console.log('Modal dismissed with data:', data);
      });
    });
  }


  updateCreateEmployeeModal(item: any) {
    console.log('Selected row data:', item);
    this.modalController.create({
      component: CreateAccountComponent,
      cssClass: 'create-account-modal',
      componentProps: {
        editData: item
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
       // this.accountStore.getAccounts();
        console.log('Modal dismissed with data:', data);
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
          id: item.accountId,
          name: item.accountName,

        }
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((result) => {
        if (result?.data?.confirmed) {
          this.accountStore.deleteAccount(result.data.id);
        }
      });
    });
  }

}
