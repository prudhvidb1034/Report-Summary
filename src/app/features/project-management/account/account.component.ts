import { Component, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { ReusableTableComponent } from "../../../shared/reusable-table/reusable-table.component";
import { ConfirmDeleteComponent } from '../../../pop-ups/confirm-delete/confirm-delete.component';
import { ReusablePopUpComponent } from '../../../pop-ups/reusable-pop-up/reusable-pop-up.component';
import { CreateAccountComponent } from '../../../pop-ups/create-account/create-account.component';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountCreateComponent {
private modalController = inject(ModalController);
label='Account';
    columns = [
      { header: 'Account Name', field: 'accountName' },
      { header: 'Start Date', field: 'startDate' },
      { header: 'End Date', field: 'endDate' },
    
      { header: 'Action', field: 'action', type: ['edit', 'delete'] }
    ];
  
  
  accounts = [
  {
    accountName: 'Texas Capital Bank',
    startDate: '2024-01-10',
    endDate: '2024-06-30'
  },
  {
    accountName: 'Bank of America',
    startDate: '2024-02-15',
    endDate: '2024-07-31'
  },
  {
    accountName: 'Wells Fargo',
    startDate: '2024-03-01',
    endDate: '2024-08-20'
  },
  {
    accountName: 'Citibank',
    startDate: '2024-04-05',
    endDate: '2024-09-15'
  },
  {
    accountName: 'Chase Bank',
    startDate: '2024-05-01',
    endDate: '2024-10-10'
  },
  {
    accountName: 'U.S. Bank',
    startDate: '2024-06-01',
    endDate: '2024-11-30'
  }
];

  
    accountlist$: Observable<any[]> = of(this.accounts);
  
    handleRowAction(event: any) {
      switch (event.type) {
        case 'create':
          this.loadCreateEmployeeModal();
          break;
          case 'delete':
            this.deleteModal();
            break;
            case 'edit':
              this.loadCreateEmployeeModal();
              break;
       
        default:
          console.log('Unknown action type:', event.type);
      }
    }
  
    loadCreateEmployeeModal() {
      this.modalController.create({
        component: CreateAccountComponent,
        cssClass:'custom-modal',
        componentProps: {
          
        }
      }).then((modal) => {
        modal.present();
        modal.onDidDismiss().then((data) => {
          console.log('Modal dismissed with data:', data);
        });
      });
    }
    

     deleteModal() {
        this.modalController.create({
          component: ConfirmDeleteComponent,
          cssClass: 'custom-delete-modal',
          componentProps: {
            role: 'delete',
          }
        }).then((modal) => {
          modal.present();
          modal.onDidDismiss().then((data) => {
            console.log('Modal dismissed with data:', data);
            // Handle any data returned from the modal if needed
          });
        });
      }
}
