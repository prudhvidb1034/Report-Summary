import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { createTeam } from '../../models/project.model';
import { SummaryService } from '../../services/summary/summary.service';
import { Router } from '@angular/router';
import { SummaryStore } from '../../state/summary.store';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-summary',
  standalone: true,
  imports: [IonicModule,CommonModule,ReactiveFormsModule],
   providers: [SummaryStore],
  templateUrl: './create-summary.component.html',
  styleUrl: './create-summary.component.scss'
})
export class CreateSummaryComponent {
  projects: createTeam[] = [];
  private summary = inject(SummaryService);
  weekSummaryForm !: FormGroup;
  private route = inject(Router);
    private modalCtrl = inject(ModalController);
  private readonly store = inject(SummaryStore);
  dateError: string | null = null;
  private readonly fb = inject(FormBuilder);
  ngOnInit() {
    this.weekSummaryForm = this.fb.group({
      project: [null, Validators.required],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      upcomingTasks: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
    this.weekSummaryForm.get('endDate')?.valueChanges.subscribe(() => {
      this.validateDates();
    });
    this.getProjects()
  }

  // create a formArray for upcoming tasks
  get upcomingTasks(): FormArray {
    return this.weekSummaryForm.get('upcomingTasks') as FormArray;
  }

  validateDates(): boolean {
    const startDate = this.weekSummaryForm.get('startDate')?.value;
    const endDate = this.weekSummaryForm.get('endDate')?.value;
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

  getProjects() {
    this.summary.getProjectTitles().subscribe((val: any) => {
      this.projects = val
    })
  }
  setOpen(isOpen: boolean) {
    this.modalCtrl.dismiss();
    this.weekSummaryForm.reset()

  }

  onSubmit() {

    if (!this.validateDates()) {
      alert(this.dateError);
      return;
    }
    if (this.weekSummaryForm.valid) {
      console.log(this.weekSummaryForm.value);
      const transformedState = {
        project_id: this.weekSummaryForm.value.id,
        project_name: this.weekSummaryForm.value.project.projectname,
        start_date: this.weekSummaryForm.value.startDate,
        end_date: this.weekSummaryForm.value.endDate,
        upcomingTasks: this.weekSummaryForm.value.upcomingTasks,
        employees: []
      };
      this.store.weeklyReport(transformedState)
      this.route.navigate(['/dashboard'])
    }else{
      this.weekSummaryForm.markAllAsTouched();
    }
  }
  isInvalid(controlName: string): boolean {
  const control = this.weekSummaryForm.get(controlName);
  return !!(control && control.invalid && control.touched);
}

isValid(controlName: string): boolean {
  const control = this.weekSummaryForm.get(controlName);
  return !!(control && control.valid && control.touched);
}
}
