import { Component, inject } from '@angular/core';
import { SummaryService } from '../../services/summary/summary.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SummaryStore } from '../../state/summary.store';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  providers: [SummaryStore],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  projects: any = [];
  private summary = inject(SummaryService);
  weekSummaryForm !: FormGroup;
  private readonly store = inject(SummaryStore);
  dateError: string | null = null;
  private readonly fb = inject(FormBuilder);
  ngOnInit() {
    this.weekSummaryForm = this.fb.group({
      project: [null, Validators.required],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
    this.weekSummaryForm.get('endDate')?.valueChanges.subscribe(() => {
      this.validateDates();
    });
    this.getProjects()
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
  // // For proper object comparison in select
  // compareWith(o1: any, o2: any): boolean {
  //   return o1 && o2 ? o1.id === o2.id : o1 === o2;
  // }

  // Custom date validator

  // dateComparisonValidator(weekSummaryForm: FormGroup) {
  //   const start = weekSummaryForm.get('startDate')?.value;
  //   const end = weekSummaryForm.get('endDate')?.value;
  //   if (!start || !end) return null;
  //   const startDate = new Date(start);
  //   const endDate = new Date(end);
  //   return startDate <= endDate ? null : { endDateBeforeStart: true };
  // }



  getProjects() {
    this.summary.getProjectTitles().subscribe((val: any) => {
      this.projects = val
    })
  }

  onSubmit() {

    // const startDate = new Date(this.weekSummaryForm.value.startDate);
    // const endDate = new Date(this.weekSummaryForm.value.endDate);

    if (!this.validateDates()) {
      alert(this.dateError);
      return;
    }
    if (this.weekSummaryForm) {
      // Handle form submission if dates are valid
      console.log(this.weekSummaryForm.value);
      // Your submission logic here
      const transformedState = {
        project_id: this.weekSummaryForm.value.id,
        project_name: this.weekSummaryForm.value.project.projectname,
        start_date: this.weekSummaryForm.value.startDate,
        end_date: this.weekSummaryForm.value.endDate,
        description: this.weekSummaryForm.value.description,
        employees: []
      };
      this.store.weeklyReport(transformedState)
    }


  }
  // this.summary.postWeeklySummary(this.weekSummaryForm.value).subscribe((val:any)=>{
  //   console.log(val);

  // })
}



