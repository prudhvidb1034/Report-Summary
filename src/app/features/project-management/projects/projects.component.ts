import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { createTeam } from '../../../models/project.model';
import { ToastService } from '../../../shared/toast.service';
import { LoginStore } from '../../../state/login.store';
import { TeamStore } from '../../../state/team.store';
import { ReusableTableComponent } from '../../../shared/reusable-table/reusable-table.component';
import { CreateProjectComponent } from '../../../pop-ups/create-project/create-project.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    FormsModule, RouterModule,
    IonicModule, CommonModule, ReactiveFormsModule, RouterModule, ReusableTableComponent],
  providers: [TeamStore],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectListComponent {
  label = 'Project';
  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Project Name', field: 'projectname' },
    { header: 'Location', field: 'projectLocation' },
    { header: 'Start Date', field: 'startDate' },
    { header: 'End Date', field: 'endDate' },
    { header: 'Action', field: 'action', type: ['view', 'edit', 'delete'] }
  ];

  handleRowAction(action: any) {
    switch (action.type) {
      case 'view':
        this.router.navigate(['/projects/employees']);
        break;
      case 'create':
        this.loadCreateEmployeeModal();
        break

      default:
        console.log('failing')
    }
  }



  private url = "http://localhost:3000/teamslist"
  isModalOpen = false;
  teamForm !: FormGroup;
  private fb = inject(FormBuilder)
  private toast = inject(ToastService)
  private router = inject(Router)
  teamList = signal<createTeam[]>([]);
  private teamStore = inject(TeamStore);
  teamList$ = this.teamStore.team$;
  private modalController = inject(ModalController);
  private loginStore = inject(LoginStore);
  constructor(private route: ActivatedRoute) {
    this.teamStore.getTeam();
  }
  ngOnInit() {
    this.CreateForm();
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
      this.teamStore.addTeam(response);
      this.setOpen(false);
      this.teamForm.reset();
      this.toast.show('success', 'Project created successfully!')
    } else {
      this.toast.show('error', 'Please fill in all required fields.')
      this.teamForm.markAllAsTouched()
    }
  }

  loadCreateEmployeeModal() {
    this.modalController.create({
      component: CreateProjectComponent,
      cssClass: 'custom-modal',
      componentProps: {
        
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
