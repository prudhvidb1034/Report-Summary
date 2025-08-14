import { Component, inject } from '@angular/core';
import { ReusableTableComponent } from "../../shared/reusable-table/reusable-table.component";
import { DependenciesStore } from '../../state/dependecies.store';
import { IonicModule, ModalController } from '@ionic/angular';
import { ConfirmDeleteComponent } from '../../pop-ups/confirm-delete/confirm-delete.component';
import { CreateDependenciesListComponent } from '../../pop-ups/create-dependencies-list/create-dependencies-list.component';
import { CommonModule } from '@angular/common';
import { CommonStore } from '../../state/common.store';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Dependency } from '../../models/sprints.model';

@Component({
  selector: 'app-dependencies-list',
  standalone: true,
  imports: [ReusableTableComponent, CommonModule, IonicModule],
  providers: [DependenciesStore],
  templateUrl: './dependencies-list.component.html',
  styleUrl: './dependencies-list.component.scss'
})

export class DependenciesListComponent {
  sprintDependencies$!: Observable<Dependency[]>;
  label = 'Dependencies';
  private dependenciesStore = inject(DependenciesStore);
  page = 0;
  pageSize = 5;
  sprintId!: string;
  private commonStore = inject(CommonStore);
  private modalController = inject(ModalController);
  private route = inject(ActivatedRoute)
  isLoadingCommon$ = this.commonStore.select(state => state.loading);
  isLoading$ = this.dependenciesStore.select(state => state.loading);

  columns = [
    { header: 'Team', field: 'projectName' },
    { header: 'Dependency', field: 'type' },
    { header: 'Description', field: 'description' },
    { header: 'Owner', field: 'owner' },
    { header: 'Date', field: 'date' },
    { header: 'Status', field: 'statusIn' },
    { header: 'Impact', field: 'impact' },
    { header: 'Action Taken', field: 'actionTaken' },

    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];



  ngOnInit() {


    this.sprintId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadDependency(this.page, this.pageSize);
  }


  loadDependency(pageNum: number, pageSize: number) {
    this.dependenciesStore.getDependencies({
       sprintId: this.sprintId,
      page: pageNum, size: pageSize });
    this.sprintDependencies$ = this.dependenciesStore.dependencies$;
  }

  handleRowAction(event: { type: string; item?: Dependency }) {
    switch (event.type) {
      case 'create':
        this.loadCreateEmployeeModal();
        break;
      case 'delete':
        if(event.item){
        this.deleteModal(event.item);
        }
        break;
      case 'edit':
        this.updateCreateEmployeeModal(event.item);
        break;
      default:
        console.log('Unknown action type:', event.type);
    }
  }






  loadCreateEmployeeModal() {
    this.modalController.create({
      component: CreateDependenciesListComponent,
      cssClass: 'create-dependency-modal',
      componentProps: {
        sprintId: this.sprintId
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
      this.loadDependency(this.page, this.pageSize);
        console.log('Modal dismissed with data:', data);
      });
    });
  }


  updateCreateEmployeeModal(item: Dependency | undefined) {
    if (!item) {
      console.warn('No dependency item provided for editing.');
      return;
    }
    console.log('Selected row data:', item);
    this.modalController.create({
      component: CreateDependenciesListComponent,
      cssClass: 'create-dependency-modal',
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

  deleteModal(item: Dependency) {
    console.log("delete",item)
    this.modalController.create({
      component: ConfirmDeleteComponent,
      cssClass: 'custom-delete-modal',
      componentProps: {
        role: 'delete',
        data: {
          id: item?.id,
          name: item.owner,

        }
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((result) => {
        if (result?.data?.confirmed) {
          this.dependenciesStore.deleteDepedency(result.data.id);
        }
      });
    });
  }
}
