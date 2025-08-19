import { Component, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { ReusableTableComponent } from "../../../shared/reusable-table/reusable-table.component";
import { ConfirmDeleteComponent } from '../../../pop-ups/confirm-delete/confirm-delete.component';
import { CreateAccountComponent } from '../../../pop-ups/create-account/create-account.component';
import { AccountStore } from '../../../state/account.store';
import { CommonModule } from '@angular/common';
import { CommonStore } from '../../../state/common.store';
import { createAccountForm } from '../../../models/account.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [ReusableTableComponent, CommonModule,IonicModule],
  providers: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountCreateComponent {
  private modalController = inject(ModalController);
  label = 'Account';
  accountStore = inject(AccountStore);
  commonStore=inject(CommonStore);
  accountList$: Observable<createAccountForm[]> = this.accountStore.account$;
  isLoading$ = this.accountStore.select(state => state.loading);
  isLoadingCommon$=this.commonStore.select(state=>state.loading);
  page:number = 0;
  pageSize:number = 5;


constructor() {
    this.loadAccounts(this.page,this.pageSize)
  }


  ngOnInit() {

  }


  columns = [
    { header: 'Account Name', field: 'accountName' },
    { header: 'Start Date', field: 'accountStartDate' },
    { header: 'End Date', field: 'accountEndDate' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];




  handleRowAction(event: { type: string, item: createAccountForm}) {
    switch (event.type) {
      case 'search':
        this.commonStore.getSearch({type:'Account',searchName:event.item.accountName, page: this.page, size: this.pageSize, sortBy: 'accountName'});
         this.accountList$ = this.commonStore.list$;
        break;
      case 'create':
        this.loadCreateEmployeeModal();
        break;
      case 'delete':
          this.deleteModal(event.item);
        break;
      case 'edit':
        this.updateCreateEmployeeModal(event.item);
        break;
      case 'nextPage':
          if( typeof event.item === 'number') {
         this.page=event.item;
        }
        this.loadAccounts(this.page, this.pageSize)
        break;
      case 'pageSize':
         if( typeof event.item === 'number') {
         this.pageSize=event.item;
        }
        this.loadAccounts(this.page, this.pageSize)
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
        this.loadAccounts(this.page,this.pageSize);
        console.log('Modal dismissed with data:', data);
      });
    });
  }


  updateCreateEmployeeModal(item: createAccountForm) {
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

  deleteModal(item: createAccountForm) {
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
