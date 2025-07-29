import { Component, inject } from '@angular/core';
import { ReusableTableComponent } from "../../shared/reusable-table/reusable-table.component";
import { Observable, of } from 'rxjs';
import { DependenciesStore } from '../../state/dependecies.store';
import { ModalController } from '@ionic/angular';
import { ConfirmDeleteComponent } from '../../pop-ups/confirm-delete/confirm-delete.component';
import { CreateDependenciesListComponent } from '../../pop-ups/create-dependencies-list/create-dependencies-list.component';

@Component({
  selector: 'app-dependencies-list',
  standalone: true,
  imports: [ReusableTableComponent],
  providers:[DependenciesStore],
  templateUrl: './dependencies-list.component.html',
  styleUrl: './dependencies-list.component.scss'
})
export class DependenciesListComponent {


  label = 'Dependencies';
private dependenciesStore = inject(DependenciesStore);


private  modalController = inject(ModalController);
isLoading$ = this.dependenciesStore.select(state => state.loading);

  columns = [
    { header: 'Team', field: 'team' },
    { header: 'Dependency', field: 'dependencyBlocker' },
    { header: 'Description', field: 'description' },
    { header: 'Owner', field: 'owner' },
    { header: 'Date', field: 'dateStatus' },
    { header: 'Status', field: 'accountEndDate' },
    { header: 'Impact', field: 'impact' },
    { header: 'Action Taken', field: 'actionTaken' },

    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];


  sprintDependencies$: Observable<any[]> = of([

    {
      team: "Employee Portal",
      dependencyBlocker: "Backend API not ready",
      description: "The frontend team is blocked due to pending API endpoints from the backend team.",
      owner: "John Doe",
      dateStatus: "2025-07-28 - Blocked",
      impact: "Delays UI integration and testing.",
      actionTaken: "Followed up with backend team; awaiting response."
    },
    {
      team: "Employee Portal",
      dependencyBlocker: "Database schema changes",
      description: "Backend team is waiting for final database schema from the DB architect.",
      owner: "Alice Smith",
      dateStatus: "2025-07-28 - In Progress",
      impact: "Cannot finalize API contracts until schema is locked.",
      actionTaken: "DB architect assigned; expected completion by tomorrow."
    },
    {
      team: "Employee Portal",
      dependencyBlocker: "Environment setup issue",
      description: "QA team cannot start testing due to issues in test environment configuration.",
      owner: "Robert Wilson",
      dateStatus: "2025-07-27 - Blocked",
      impact: "Testing timelines will be pushed by 2 days.",
      actionTaken: "DevOps team is fixing environment; estimated completion today."
    }
  ]);


 handleRowAction(event: any) {
    switch (event.type) {
      // case 'search':
      //   this.commonStore.getSearch({type:'Account',searchName:event.item, page: this.page, size: this.pageSize, sortBy: 'accountName'});
      //    this.accountList$ = this.commonStore.list$;
      //   break;
      case 'create':
        this.loadCreateEmployeeModal();
        break;
      case 'delete':
          this.deleteModal(event.item);
        break;
      case 'edit':
        this.updateCreateEmployeeModal(event.item);
        break;
      // case 'nextPage':
      //   this.page = event.item;
      //   this.loadAccounts(this.page, this.pageSize)
      //   break;
      // case 'pageSize':
      //   this.pageSize = event.item;
      //   this.loadAccounts(this.page, this.pageSize)
      //   break;
      default:
        console.log('Unknown action type:', event.type);
    }
  }






   loadCreateEmployeeModal() {
      this.modalController.create({
        component: CreateDependenciesListComponent,
        cssClass: 'create-dependency-modal',
        componentProps: {
  
        }
      }).then((modal) => {
        modal.present();
        modal.onDidDismiss().then((data) => {
          // this.loadAccounts(this.page,this.pageSize);
          console.log('Modal dismissed with data:', data);
        });
      });
    }
  
  
    updateCreateEmployeeModal(item: any) {
      console.log('Selected row data:', item);
      this.modalController.create({
        component: CreateDependenciesListComponent,
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
            // this.accountStore.deleteAccount(result.data.id);
          }
        });
      });
    }
}
