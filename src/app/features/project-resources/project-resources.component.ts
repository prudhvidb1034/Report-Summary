import { Component, inject } from '@angular/core';
import { ReusableTableComponent } from '../../shared/reusable-table/reusable-table.component';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateResoursesComponent } from '../../pop-ups/create-resourses/create-resourses.component';
import { SprintStore } from '../../state/sprint.store';
import { ResourcesStore } from '../../state/resources.store';

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
   types = [
    { id: 'technologies', name: 'Technologies' },
    { id: 'projects', name: 'Projects' }
  ];
    page = 0;
  pageSize = 5;
  resourcesList$:any;

  // sample arrays
  technologies = ['Angular', 'React', 'Vue', 'Ionic', 'Node.js'];
  projects = ['Apollo', 'Zeus', 'Hermes', 'Athena', 'Poseidon'];

  selectedType='';
  searchTerm = '';
  suggestions: string[] = [];

  ionSelectChange() {
    this.searchTerm = '';
    this.updateSuggestions();
  }

  ngOnInit(){
console.log("preojectr REsoirs")
this.resourceStore.getResources({ page: this.page, size: this.pageSize });
    this.resourcesList$=this.resourceStore.resources$;
  }

  updateSuggestions() {
    const list = this.selectedType === 'technologies'
      ? this.technologies
      : this.selectedType === 'projects'
        ? this.projects
        : [];
    const term = this.searchTerm.toLowerCase();
    this.suggestions = list.filter(item => item.toLowerCase().includes(term));
  }

  onInput(event: any) {
    this.searchTerm = event.detail.value;
    this.updateSuggestions();
  }

  choose(name: string) {
    this.searchTerm = name;
    this.suggestions = [];
  }

  onSearchClicked() {
    console.log('Searching:', this.selectedType, this.searchTerm);
    // handle search logic here
  }

  columns = [
    { header: 'Type', field: 'type' },
    { header: 'Name', field: 'name' },
    { header: 'Onsite', field: 'onsite' },
    { header: 'Offshore', field: 'offshore', },
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
