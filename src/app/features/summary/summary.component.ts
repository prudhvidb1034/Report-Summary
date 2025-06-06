import { Component, inject } from '@angular/core';
import { SummaryService } from '../../services/summary/summary.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, FormArray } from '@angular/forms';
import { SummaryStore } from '../../state/summary.store';
import { createTeam } from '../../models/project.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  providers: [SummaryStore],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  projects: createTeam[] = [];
  private summary = inject(SummaryService);
  weekSummaryForm !: FormGroup;
  private route = inject(Router)
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

  onSubmit() {

    if (!this.validateDates()) {
      alert(this.dateError);
      return;
    }
    if (this.weekSummaryForm) {
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
    }
  }

   weekList = [
    {
      weekId: 'WEEK001',
      startDate: '2025-05-01',
      endDate: '2025-05-07'
    },
    {
      weekId: 'WEEK002',
      startDate: '2025-05-08',
      endDate: '2025-05-14'
    }
  ];

}
