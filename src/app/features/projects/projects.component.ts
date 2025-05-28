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
  employeesofproject: any;

  // private teamStore = inject(TeamStore);
  // teamList$ = this.teamStore.team$;
  ngOnInit() {
    this.createEmployeeForm();
    this.getRegisterStore.getRegisterData();
  
    this.router.paramMap.subscribe((params: ParamMap) => {
      this.projectid = params.get('id');
      console.log('Project ID:', this.projectid);
    }); // ✅ Properly closed subscribe
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
    this.route.navigateByUrl('view-reports')
  }
}
