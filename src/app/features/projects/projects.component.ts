import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule,SignUpComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  isModalOpen: boolean = false;
  employeeForm!: FormGroup;
  private fb = inject(FormBuilder);


  ngOnInit() {
    this.createEmployeeForm();
   
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

  submitData() {
    if (this.employeeForm.valid) {
console.log(this.employeeForm.value)
    }
    else {
      this.employeeForm.markAllAsTouched()
    }
  }














  employees = [
    {
      employeeId: 'E001',
      employeeName: 'John Doe',
      employeeMail: 'john.doe@example.com',
      employeeNumber: '123456789077',
      employeeDesignation: 'Frontend Developer',
      techStack: ['Frontend']
    },
    {
      employeeId: 'E002',
      employeeName: 'Jane Smith',
      employeeMail: 'jane.smith@example.com',
      employeeNumber: '0987654321',
      employeeDesignation: 'Backend Developer',
      techStack: ['Backend']
    },
    {
      employeeId: 'E003',
      employeeName: 'Alice Brown',
      employeeMail: 'alice.brown@example.com',
      employeeNumber: '1122334455',
      employeeDesignation: 'Full Stack Developer',
      techStack: ['Angular']
    },
    {
      employeeId: 'E004',
      employeeName: 'Bob White',
      employeeMail: 'bob.white@example.com',
      employeeNumber: '2233445566',
      employeeDesignation: 'Frontend Developer',
      techStack: ['Testing']
    },
    {
      employeeId: 'E005',
      employeeName: 'Charlie Black',
      employeeMail: 'charlie.black@example.com',
      employeeNumber: '6677889900',
      employeeDesignation: 'Backend Developer',
      techStack: ['Testing']
    }
  ];



  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.employeeForm.reset()

  }

}
