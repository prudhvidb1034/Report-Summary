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

@Component({
  selector: 'app-project-resources',
  standalone: true,
  imports: [ReusableTableComponent,IonicModule,CommonModule,FormsModule,ReactiveFormsModule],
  providers:[ResourcesStore],
  templateUrl: './project-resources.component.html',
  styleUrl: './project-resources.component.scss'
})
export class ProjectResourcesComponent {
  label='Resources'
    private modalController = inject(ModalController);
  private resourceStore=inject(ResourcesStore);
  private commonStore=inject(CommonStore);
  isLoading$ = this.resourceStore.select(state => state.loading);
   types = [
    { id: 'TECH_STACK', name: 'Technologies' },
    { id: 'PROJECT', name: 'Projects' }
  ];
  page = 0;
  pageSize = 5;
  resourcesList$:any;
  copyDisabled = false;

  // sample arrays
  technologies$ = this.commonStore.allTechnologies$;
  projectNames$ = this.commonStore.allProjects$.pipe(
  map(projects => projects.map((p:any) => p.projectName))
);

  projects = ['Apollo', 'Zeus', 'Hermes', 'Athena', 'Poseidon'];

  selectedType='';
  searchTerm = '';
  suggestions$: any;
  list$: any;

  ionSelectChange() {
    this.searchTerm = '';
    this.updateSuggestions();
  }

  ngOnInit(){
    this.technologies$.subscribe((data:any)=>{
      console.log(data)
    })
  }

  copyResources(){
    if (this.copyDisabled) return;
    this.copyDisabled = true;
   // this.resourceStore.getResources({ page: this.page, size: this.pageSize,sortBy:'resourceType',apiPath:urls.GET_RESOURCES_FILTER_TYPE });
    this.resourcesList$=this.resourceStore.resources$;

  }

  search(){
    if(this.selectedType){
    this.resourceStore.getResources({ page: this.page, size: this.pageSize,sortBy:'resourceType',apiPath:urls.GET_RESOURCES_FILTER_TYPE+this.selectedType});
    this.resourcesList$=this.resourceStore.resources$;
  }
    console.log(this.selectedType)
  }


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
    setTimeout(()=>{

    },300)
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

  loadResources(){
    this.resourceStore.getResources({ page: this.page, size: this.pageSize,sortBy:'resourceType',apiPath:urls.GET_RESOURCES_FILTER_TYPE+this.selectedType+'&name='+this.searchTerm.toUpperCase()});
    this.resourcesList$=this.resourceStore.resources$;
}
  columns = [
    { header: 'Type', field: 'resourceType' },
    { header: 'Name', field: 'name' },
    { header: 'Onsite', field: 'onsite' },
    { header: 'Offshore', field: 'offsite', },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] },
  ];

    openModal() {
      this.modalController.create({
        component: CreateResoursesComponent,
        cssClass: 'create-account-modal',
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
}
