import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { createProject } from '../../models/project.model';
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
  projects: createProject[] = [];
  private summary = inject(SummaryService);
  weekSummaryForm !: FormGroup;
  private route = inject(Router);
    private modalCtrl = inject(ModalController);
  private readonly store = inject(SummaryStore);
  dateError: string | null = null;
  private readonly fb = inject(FormBuilder);
  ngOnInit() {
    this.weekSummaryForm = this.fb.group({
      weekFromDate: ['', [Validators.required]],
      weekToDate: ['', [Validators.required]],
    });
    this.weekSummaryForm.get('weekToDate')?.valueChanges.subscribe(() => {
      this.validateDates();
    });
  }

  // create a formArray for upcoming tasks
  get upcomingTasks(): FormArray {
    return this.weekSummaryForm.get('upcomingTasks') as FormArray;
  }

  validateDates(): boolean {
    const weekFromDate = this.weekSummaryForm.get('weekFromDate')?.value;
    const weekToDate = this.weekSummaryForm.get('weekToDate')?.value;
    if (!weekFromDate || !weekToDate) {
      this.dateError = null;
      return true;
    }
    const start = new Date(weekFromDate);
    const end = new Date(weekToDate);
    if (start > end) {
      this.dateError = 'Start date cannot be greater than end date';
      return false;
    }
    this.dateError = null;
    return true;
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
      this.store.weeklyReport(this.weekSummaryForm.value)
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
