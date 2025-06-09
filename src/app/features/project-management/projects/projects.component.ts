import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { createTeam } from '../../../models/project.model';
import { ToastService } from '../../../shared/toast.service';
import { LoginStore } from '../../../state/login.store';
import { TeamStore } from '../../../state/team.store';
import { ReusableTableComponent } from '../../../shared/reusable-table/reusable-table.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    FormsModule, RouterModule,
    IonicModule, CommonModule, ReactiveFormsModule, RouterModule,ReusableTableComponent],
  providers: [TeamStore],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectListComponent {

employees: any[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', project: 'Project A' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', project: 'Project B' }
  ];

  columns = [
    { header: 'ID', field: 'id' },
    { header: 'Project Name', field: 'projectName' },
    { header: 'Location', field: 'location'},
    { header: 'Start Date', field: 'startDate'},
    { header: 'End Date', field: 'endDate'},

  ];

  handleRowAction(employee: any): void {
    console.log('Row action triggered for:', employee);
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
  private loginStore = inject(LoginStore);
  constructor(private route:ActivatedRoute) {

  }
  ngOnInit() {
    this.CreateForm();
    this.teamStore.getTeam();
  }

  goToProject(id: string) {
    this.router.navigate(['/projects/employees' ,id]);
  }


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.teamForm.reset()
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

}
