import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RegistrationForm } from '../../models/register.mode';
import { RegisterStore } from '../../state/register.store';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { TeamStore } from '../../state/team.store';
import { HttpClient } from '@angular/common/http';
import { createTeam } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, SignUpComponent],
  providers: [TeamStore, RegisterStore],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  isModalOpen: boolean = false;
  employeeForm!: FormGroup;
  private fb = inject(FormBuilder);
  private route = inject(Router)
  private router = inject(ActivatedRoute)
  teamRegisterList = signal<RegistrationForm[]>([]);
  private getRegisterStore = inject(RegisterStore);
  teamRegisterList$ = this.getRegisterStore.register$;
  teamList = signal<createTeam[]>([]);
  private teamStore = inject(TeamStore);
  teamList$ = this.teamStore.team$;
   private http = inject(HttpClient)
  projectid: any = ''
  projects: any = [];
  selectedProject: any = []
  employeesofproject: any=[];
  matchingProject:any={}

  // private teamStore = inject(TeamStore);
  // teamList$ = this.teamStore.team$;
  ngOnInit() {
    this.createEmployeeForm();
    
    this.router.paramMap.subscribe((params: ParamMap) => {
  this.projectid = params.get('id');
  console.log('Project ID:', this.projectid);
   this.getRegisterStore.getRegisterData(this.projectid);

  if (!this.projectid) return;

  // Fetch projects
  this.http.get('http://localhost:3000/projects').subscribe(
    (projects: any) => {
      this.projects = projects;
      console.log('Projects:', this.projects);

      // Fetch teams
      this.http.get('http://localhost:3000/teamslist').subscribe(
        (teams: any) => {
          console.log('Teams:', teams);

          // Find selected project
          this.selectedProject = teams.find((team:any)=> team.id == this.projectid);
          if (!this.selectedProject) return;

          console.log(this.selectedProject);

          // Find and process matching project
          this.matchingProject = this.projects.find(
            (project:any)=> project.project_name === this.selectedProject.projectname
          );

          console.log(this.matchingProject);
          
          if (this.matchingProject) {
            // Extract all employees of the project
            const employeesOfProject = this.matchingProject.employees.flat();
            console.log('Employees of Project:', employeesOfProject);
            
            // Store it in a class variable if you need to use it in the template
            this.employeesofproject = employeesOfProject;
          }
        },
        (err) => console.error('Error fetching teams:', err)
      );
    },
    (err) => console.error('Error fetching projects:', err)
  );
});
  
  }
  

  createEmployeeForm() {
    this.employeeForm = this.fb.group({
      employeeid: ['', [Validators.required, Validators.minLength(6)]],
      employeename: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phonenumber: ['', [Validators.required]],
      designation: ['', [Validators.required]],

    })



  }
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.employeeForm.reset()

  }


  openModal() {
    this.route.navigate(['/view-reports', '0o4d'])
  }
}
