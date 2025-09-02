import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import{ModalController} from '@ionic/angular/standalone';
import { createProject } from '../../../models/project.model';
import { ToastService } from '../../../shared/toast.service';
import { ProjectStore } from '../../../state/project.store';
import { ReusableTableComponent } from '../../../shared/reusable-table/reusable-table.component';
import { CreateProjectComponent } from '../../../pop-ups/create-project/create-project.component';
import { ConfirmDeleteComponent } from '../../../pop-ups/confirm-delete/confirm-delete.component';
import { CommonStore } from '../../../state/common.store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule,
    ReusableTableComponent,
  ],
  providers: [ProjectStore],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectListComponent  {
  readonly label = 'Project';
  isModalOpen = false;
  searchProject = '';
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly projectStore = inject(ProjectStore);
  private  modalController = inject(ModalController);
  private readonly commonStore = inject(CommonStore);

  readonly isLoading$ = this.projectStore.select((state) => state.loading);
  readonly isLoadingCommon$ = this.commonStore.select((state) => state.loading);

  projectList$!: Observable<createProject[]>;

  page = 0;
  pageSize = 5;

  readonly columns = [
    { header: 'Project Name', field: 'projectName' },
    { header: 'Account Name', field: 'accountName' },
    {
      header: 'Teams',
      field: 'viewTeam',
      linkEnable: true,
      link: 'employees',
    },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] },
  ];

  constructor() {
    this.loadProjects(this.page, this.pageSize);
  }

  handleRowAction(action: { type: string; item?: createProject | number | string }): void {
    const { type, item } = action;
     console.log("action",action)
    switch (type) {
      case 'navigate':
        if (this.isCreateProject(item)) {
          this.router.navigate(['/projects/employees', item.projectId], {
            state: { name: item.projectName },
          });
        }
        break;

      case 'create':
        this.openCreateModal();
        break;

      case 'edit':
        if (this.isCreateProject(item)) {
          this.openEditModal(item);
        }
        console.log('Row from table:', item);
        break;

      case 'delete':
        if (this.isCreateProject(item)) {
          this.openDeleteModal(item);
        }
        break;

      case 'nextPage':
        if (typeof item === 'number') {
          this.page = item;
          this.loadProjects(this.page, this.pageSize);
        }
        break;

      case 'pageSize':
        if (typeof item === 'number') {
          this.pageSize = item;
          this.loadProjects(this.page, this.pageSize);
        }
        break;

      case 'search':
        this.commonStore.getSearch({
          type: 'projects',
          searchName: typeof item === 'string' ? item : '',
          page: this.page,
          size: this.pageSize,
          sortBy: 'projectName',
        });
        this.projectList$ = this.commonStore.list$;
        break;

      default:
        break;
    }
  }

  loadProjects(pageNum: number, pageSize: number) {
    this.projectStore.getTeam({
      page: pageNum,
      size: pageSize,
      sortBy: 'projectName',
    });
    this.projectList$ = this.projectStore.team$;
  }

   async openCreateModal() {
    const modal = await this.modalController.create({
      component: CreateProjectComponent,
      cssClass: 'create-project-modal',
    });
    await modal.present();
    const { role } = await modal.onDidDismiss();
    if (role !== 'cancel') {
      this.loadProjects(this.page, this.pageSize);
    }
  }

   async openEditModal(item: createProject){
    const modal = await this.modalController.create({
      component: CreateProjectComponent,
      cssClass: 'create-project-modal',
      componentProps: { editData: item },
    });
    await modal.present();

    await modal.onDidDismiss();
    this.loadProjects(this.page, this.pageSize);
  }

  async openDeleteModal(item: createProject) {
    const modal = await this.modalController.create({
      component: ConfirmDeleteComponent,
      cssClass: 'custom-delete-modal',
      componentProps: {
        role: 'delete',
        data: {
          id:item.projectId? item.projectId.toString():'',
          name: item.projectName,
        },
      },
    });
    await modal.present();

    const { role } = await modal.onDidDismiss();
    if (role !== 'cancel') {
      this.projectStore.deleteProject(item.projectId?item.projectId.toString():'');
    }
  }
  
  isCreateProject(obj: unknown): obj is createProject {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'projectId' in obj &&
      'projectName' in obj
    );
  }

}
