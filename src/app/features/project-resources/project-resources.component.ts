import { Component, inject } from '@angular/core';
import { ReusableTableComponent } from '../../shared/reusable-table/reusable-table.component';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateResoursesComponent } from '../../pop-ups/create-resourses/create-resourses.component';
import { SprintStore } from '../../state/sprint.store';
import { ResourcesStore } from '../../state/resources.store';
import { urls } from '../../constants/string-constants';
import { CommonStore } from '../../state/common.store';
import { map } from 'rxjs';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ConfirmDeleteComponent } from '../../pop-ups/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-project-resources',
  standalone: true,
  imports: [ReusableTableComponent, IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [ResourcesStore, ModalController],
  templateUrl: './project-resources.component.html',
  styleUrl: './project-resources.component.scss'
})
export class ProjectResourcesComponent {
  label = 'Resources'
  private modalController = inject(ModalController);
  private resourceStore = inject(ResourcesStore);
  private commonStore = inject(CommonStore);
  private router = inject(ActivatedRoute)
  isLoading$ = this.resourceStore.select(state => state.loading);
  types = [
    { id: 'TECH_STACK', name: 'Technologies' },
    { id: 'PROJECT', name: 'Projects' }
  ];
  page = 0;
  pageSize = 10;
  resourcesList$: any;
  copyDisabled = false;

  // sample arrays
  technologies$ = this.commonStore.allTechnologies$;
  projectNames$ = this.commonStore.allProjects$.pipe(
    map(projects => projects.map((p: any) => p.projectName))
  );

  projects = ['Apollo', 'Zeus', 'Hermes', 'Athena', 'Poseidon'];

  selectedType = '';
  searchTerm = '';
  suggestions$: any;
  list$: any;
  sprintId: any;
  ionSelectChange() {
    this.searchTerm = '';
    this.updateSuggestions();
  }

  ngOnInit() {

    this.sprintId = this.router.snapshot.paramMap.get('id')
    this.technologies$.subscribe((data: any) => {
      console.log(data)
    })
    this.loadAllResources();
  }

  copyResources() {
    if (this.copyDisabled) return;
    this.copyDisabled = true;
    // this.resourceStore.getResources({ page: this.page, size: this.pageSize,sortBy:'resourceType',apiPath:urls.GET_RESOURCES_FILTER_TYPE });
    this.resourcesList$ = this.resourceStore.resources$;

  }

  search() {
    if (this.selectedType) {
      const sprintId = 1
      const resourceType = 'PROJECT';
      // const projectName = 'AI test';
      const page = this.page;
      const pageSize = this.pageSize;

      const queryParams = `${sprintId}&resourceType=${encodeURIComponent(resourceType)}&page=${page}&size=${pageSize}`;
      this.resourceStore.getResourcesWithType({ apiPath: urls.GET_RESOURCES_FILTER_TYPE + queryParams });
      this.resourcesList$ = this.resourceStore.resources$;
    }
    console.log(this.selectedType)
  }

  // searchWithType() {
  //   if (this.selectedType) {
  //     const sprintId = 1
  //     const resourceType = 'PROJECT';
  //     // const projectName = 'AI test';
  //     const page = this.page;
  //     const pageSize = this.pageSize;

  //     const queryParams = `${sprintId}&resourceType=${encodeURIComponent(resourceType)}&page=${page}&size=${pageSize}`;
  //     this.resourceStore.getResourcesByProjectOrTeckStack({ apiPath: urls.GET_RESOURCES_FILTER_TYPE + queryParams });
  //     this.resourcesList$ = this.resourceStore.resources$;
  //   }
  //   console.log(this.selectedType)
  // }




  updateSuggestions() {
    this.list$ = this.selectedType === 'TECH_STACK'
      ? this.technologies$
      : this.selectedType === 'PROJECT'
        ? this.projectNames$
        : of([]);
    const term = this.searchTerm.toLowerCase();
    this.suggestions$ = this.list$.pipe(
      map((list: any[]) =>
        list.filter(item =>
          item.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      )
    );
  }

  onInput(event: any) {
    this.searchTerm = event.detail.value;
    setTimeout(() => {

    }, 300)
    this.updateSuggestions();
  }

  choose(name: string) {
    this.searchTerm = name;
    this.suggestions$ = of([] as string[]);
  }

  onSearchClicked() {
    console.log('Searching:', this.selectedType, this.searchTerm);
    // handle search logic here
  }

  loadAllResources() {
    const sprintId = this.sprintId
    this.resourceStore.getAllResources(
      {
        apiPath: urls.GET_ALL_RESOURCES + `sprintId=${sprintId}`
      }
    );
    this.resourcesList$ = this.resourceStore.resources$;
    this.resourcesList$.subscribe((val: any) => {
      console.log(val);

    })
  }
  columns = [
    { header: 'Type', field: 'resourceType' },
    { header: 'Name', field: 'name' },
    { header: 'Onsite', field: 'onsite' },
    { header: 'Offshore', field: 'offsite', },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] },
  ];

  openModal(item: any) {
    // console.log(item);

    this.modalController.create({
      component: CreateResoursesComponent,
      cssClass: 'create-account-modal',
      componentProps: {
        editData: item
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
        this.loadAllResources();
        console.log('Modal dismissed with data:', data);
      });
    });
  }

  deleteModal(item: any) {
    // console.log(item)
    this.modalController.create({
      component: ConfirmDeleteComponent,
      cssClass: 'custom-delete-modal',
      componentProps: {
        role: 'delete',
        data: {
          id: item.resourceId,
          name: item.name
        }
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((result) => {
        console.log(result)
        if (result?.data?.confirmed) {
          this.resourceStore.deleteResource(result.data.id);
        }
        setTimeout(() => {
          this.loadAllResources();
        }, 1000);
      });
    });

  }

  updateCreateResourceModal(item: any) {
    // console.log('Selected row data:', item);
    this.modalController.create({
      component: CreateResoursesComponent,
      cssClass: 'create-account-modal',
      componentProps: {
        editData: item
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
        this.loadAllResources();
        console.log('Modal dismissed with data:', data);
      });
    });
  }

  handleRowAction(event: any) {
    switch (event.type) {
      case 'create':
        this.openModal(event);
        break;
      case 'delete':
        this.deleteModal(event.item);
        break;
      case 'edit':
        this.updateCreateResourceModal(event.item);
        break;
      default:
        console.log('Unknown action type:', event.type);
    }
  }

}
