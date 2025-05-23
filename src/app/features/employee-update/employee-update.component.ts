import { Component, EventEmitter, inject, Input, Output, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormArray } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RegisterStore } from '../../state/register.store';
import { SignUpService } from '../../services/sign-up/sign-up.service';
import { Router } from '@angular/router';
import { createTeam } from '../../models/project.model';
import { TeamStore } from '../../state/team.store';
import { EmployeeUpdateService } from '../../services/employee-update/employee-update.service';
import { SummaryStore } from '../../state/summary.store';

@Component({
  selector: 'app-employee-update',
  standalone: true,
  providers: [SummaryStore],
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './employee-update.component.html',
  styleUrl: './employee-update.component.scss'
})
export class EmployeeUpdateComponent {
  private readonly employeeupdate = inject(EmployeeUpdateService);
  Dates:any=[];
   dateError: string | null = null;
  //   projects: any = [];
  //   private update = inject(EmployeeUpdateService);
  //   employeeUpdateForm !: FormGroup;
  //   today = new Date();
  //   formattedDate = this.today.toISOString().split('T')[0];

  // private readonly fb = inject(FormBuilder);
  ngOnInit() {
    //   this.employeeUpdateForm = this.fb.group({
    //     summary:[''],
    //     startDate: [this.formattedDate, [Validators.required]],
    //     endDate: [this.formattedDate, [Validators.required]],
    //     task: ['', [Validators.required, Validators.minLength(3)]],
    //     status: ['Pending', Validators.required]
    //   });
    
  this.getProjetcDates()
  }

   getProjetcDates() {
    this.employeeupdate.getDates().subscribe((val: any) => {
    console.log(val);
    this.Dates = val
    })
  }

  employeeUpdateForm !: FormGroup;
  // today = new Date();
  // formattedDate = this.today.toISOString().split('T')[0];
  constructor(private fb: FormBuilder) {
    // this.formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
    this.initializeForm();
  }


  initializeForm(): void {
    this.employeeUpdateForm = this.fb.group({
      summary: [''],
      weeklyUpdates: this.fb.array([this.createWeeklyUpdateGroup()])
    });
     
  }

   validateDates(): boolean {
    const startDate = this.employeeUpdateForm.get('startDate')?.value;
    const endDate = this.employeeUpdateForm.get('endDate')?.value;
    if (!startDate || !endDate) {
      this.dateError = null;
      return true;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      this.dateError = 'Start date cannot be greater than end date';
      return false;
    }
    this.dateError = null;
    return true;
  }

  createWeeklyUpdateGroup(): FormGroup {
    let group:FormGroup = this.fb.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      task: ['', [Validators.required, Validators.minLength(3)]],
      status: ['', [Validators.required]]
    });
    group.get('endDate')?.valueChanges.subscribe(() => {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;
    if (!startDate || !endDate) {
      this.dateError = null;
      return true;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      this.dateError = 'Start date cannot be greater than end date';
      return false;
    }
    this.dateError = null;
    return true;
    });

    return group;
  }

  get weeklyUpdates(): FormArray {
    return this.employeeUpdateForm.get('weeklyUpdates') as FormArray;
  }

  addMore(): void {
    this.weeklyUpdates.push(this.createWeeklyUpdateGroup());
  }

  removeUpdate(index: number): void {
    if (this.weeklyUpdates.length > 1) {
      this.weeklyUpdates.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.employeeUpdateForm.valid) {
      console.log('Form submitted:', this.employeeUpdateForm.value);
      // Here you can process the form data
      // For example, send to a service:
      // this.yourService.saveWeeklyUpdates(this.employeeUpdateForm.value);
    } else {
      this.markFormGroupTouched(this.employeeUpdateForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
