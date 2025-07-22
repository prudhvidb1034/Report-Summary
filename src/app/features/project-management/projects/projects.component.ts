import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { createProject } from '../../../models/project.model';
import { ToastService } from '../../../shared/toast.service';
import { LoginStore } from '../../../state/login.store';
import { ProjectStore } from '../../../state/project.store';
import { ReusableTableComponent } from '../../../shared/reusable-table/reusable-table.component';
import { CreateProjectComponent } from '../../../pop-ups/create-project/create-project.component';
import { ConfirmDeleteComponent } from '../../../pop-ups/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    FormsModule, RouterModule,
    IonicModule, CommonModule, ReactiveFormsModule, RouterModule, ReusableTableComponent],
  providers: [ProjectStore],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectListComponent {
  label = 'Project';




  private url = "http://localhost:3000/teamslist"
  isModalOpen = false;
  searchProject = '';
  teamForm !: FormGroup;
  private fb = inject(FormBuilder)
  private toast = inject(ToastService)
  private router = inject(Router)
  teamList = signal<createProject[]>([]);
  private projectStore = inject(ProjectStore);
  private modalController = inject(ModalController);
  private loginStore = inject(LoginStore);
  // projectStore = inject(TeamStore);
isLoading$ = this.projectStore.select(state => state.loading);
  projectList$: any;
  page=0
pageSize=5


  constructor(private route: ActivatedRoute) {
    this.loadProjects(this.page,this.pageSize);
  }
  ngOnInit() {
    this.CreateForm();
  }
onSearchTermChanged(term: string) {
  this.searchProject = term;
  // You can also trigger search logic here
}

  goToProject(project: any) {
    console.log(project);
    this.router.navigate(['/projects/employees']);
  }


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.teamForm.reset();
  }


  CreateForm() {
    this.teamForm = this.fb.group({
      projectname: ['', [Validators.required, Validators.minLength(3)]],
      projectlocation: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']

    })

  }


  SubmitForm() {
    const response = this.teamForm.value;
    if (this.teamForm.valid) {
      this.projectStore.addTeam(response);
      this.setOpen(false);
      this.teamForm.reset();
      this.toast.show('success', 'Project created successfully!')
    } else {
      this.toast.show('error', 'Please fill in all required fields.')
      this.teamForm.markAllAsTouched()
    }
  }



  columns = [
    { header: 'Project Id', field: 'projectId' },
    { header: 'Project Name', field: 'projectName' },
    { header: 'Account Name', field: 'accountName' },
    { header: 'Teams', field: 'viewTeam', linkEnable: true ,link:'employees' },
    // { header: 'Start Date', field: 'startDate' },
    // { header: 'End Date', field: 'endDate' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];

  handleRowAction(action: any) {
    switch (action.type) {
      case 'navigate':
        this.router.navigate(
          ['/projects/employees', action.item.projectId],
          { state: { name: action.item.projectName } }
        );
       // this.router.navigate(['/projects/employees', action.item.projectId], { state: { projectName: action.item.projectName });
        break;
      case 'create':
        this.loadCreateEmployeeModal();
        break;
      case 'edit':
        this.updateCreateEmployeeModal(action.item);
        console.log('Row from table:', action.item);
        break;
      case 'delete':
        this.deleteModal(action.item);
        break;
      case 'nextPage':
        this.page=action.item;
        this.loadProjects(this.page,this.pageSize)
       break;
        case 'pageSize':
        this.pageSize=action.item;
        this.loadProjects(this.page,this.pageSize)
       break;  
      default:
        console.log('failing')
    }
  }

  loadCreateEmployeeModal() {
    this.modalController.create({
      component: CreateProjectComponent,
      cssClass: 'create-project-modal',
      componentProps: {

      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
      this.loadProjects(this.page,this.pageSize);

        console.log('Modal dismissed with data:', data);
        // Handle any data returned from the modal if needed
      });
    });

  }

  updateCreateEmployeeModal(item: any) {
    this.modalController.create({
      component: CreateProjectComponent,
      cssClass: 'create-project-modal',
      componentProps: {
        editData: item

      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
      this.loadProjects(this.page,this.pageSize);

        console.log('Modal dismissed with data:', data);
        // Handle any data returned from the modal if needed
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
          id: item.projectId,
          name: item.projectName
        }
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
        console.log('Modal dismissed with data:', data);
        this.projectStore.deleteProject(item.projectId);
        // Handle any data returned from the modal if needed
      });
    });
  }


    loadProjects(pageNum:number,pageSize:number){
    this.projectStore.getTeam({ page: pageNum, size: pageSize, sortBy: 'projectName' });
    this.projectList$ = this.projectStore.team$;

  }
}
