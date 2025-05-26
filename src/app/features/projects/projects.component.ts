import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RegistrationForm } from '../../models/register.mode';
import { RegisterStore } from '../../state/register.store';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, SignUpComponent],
  providers: [RegisterStore],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  isModalOpen: boolean = false;
  employeeForm!: FormGroup;
  private fb = inject(FormBuilder);
  private route = inject(Router)
  teamRegisterList = signal<RegistrationForm[]>([]);
  private getRegisterStore = inject(RegisterStore);
  teamRegisterList$ = this.getRegisterStore.register$;
  ngOnInit() {
    this.createEmployeeForm();
    this.getRegisterStore.getRegisterData();

    //  this.teamRegisterList$.subscribe((data:any)=>{
    //   console.log(data)
    // })
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
