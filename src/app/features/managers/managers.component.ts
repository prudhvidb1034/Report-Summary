import { Component, inject } from '@angular/core';
import { ReusableTableComponent } from "../../shared/reusable-table/reusable-table.component";
import { Observable, of } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { RegisterComponent } from '../../shared/register/register.component';
import { ConfirmDeleteComponent } from '../../pop-ups/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-managers',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.scss'
})
export class ManagersComponent {

label = 'Manager';
 private modalController = inject(ModalController);
  
   columns = [
    { header: 'Manager ID', field: 'managerid' },
    { header: 'Manager Name', field: 'managername' },
    { header: 'Mail id', field: 'mail' },
    { header: 'Project', field: 'project' },
    // { header: 'End Date', field: 'endDate' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] 
    },
  
  ];
 managers = [
  {
    managerid: 'MGR001',
    managername: 'Alice Johnson',
    mail: 'alice.johnson@company.com',
    project: 'Internal Tools'
  },
  {
    managerid: 'MGR002',
    managername: 'Brian Edwards',
    mail: 'brian.edwards@company.com',
    project: 'Analytics Dashboard'
  },
  {
    managerid: 'MGR003',
    managername: 'Clara Mitchell',
    mail: 'clara.mitchell@company.com',
    project: 'AI Assistant'
  },
  {
    managerid: 'MGR004',
    managername: 'David Sharma',
    mail: 'david.sharma@company.com',
    project: 'Mobile App Platform'
  },
  {
    managerid: 'MGR005',
    managername: 'Emma Zhang',
    mail: 'emma.zhang@company.com',
    project: 'Customer Insights Engine'
  }
];
 managerlist$: Observable<any[]> = of(this.managers);




 handleRowAction(event:any) {
     switch(event.type){
       case 'create' :
         this.loadCreateEmployeeModal();
         //this.route.navigate(['/projects/employees/create']);
         break
        case 'edit':
         this.loadCreateEmployeeModal();
          break;
        case 'delete':
      this.deleteModal()
         break;
       default:
         console.log('Unknown action type:', event.type);
     }
   } 
 
   loadCreateEmployeeModal(){
   this.modalController.create({
       component: RegisterComponent,
      //  cssClass: 'custom-modal',
       componentProps: {
       role:'manager',
       }
     }).then((modal) => {
       modal.present();
       modal.onDidDismiss().then((data) => {
         console.log('Modal dismissed with data:', data);
         // Handle any data returned from the modal if needed
       });
     });
   }

   deleteModal(){
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
