import { Component, inject } from '@angular/core';
import { SummaryService } from '../../services/summary/summary.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SummaryStore } from '../../state/summary.store';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [IonicModule, CommonModule,ReactiveFormsModule],
  providers:[SummaryStore],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  projects: any = [];
  private summary = inject(SummaryService);
  weekSummaryForm !: FormGroup;
  private readonly store = inject(SummaryStore);


private readonly fb = inject(FormBuilder);
  ngOnInit() {
    this.weekSummaryForm = this.fb.group({
      project: [''],
      startDate: [''],
      endDate: [''],
      description: ['']
    });
    this.getProjects()
  }

  getProjects() {
    this.summary.getProjectTitles().subscribe((val: any) => {
      this.projects = val
    })
  }

  onSubmit(): void {
     console.log('Form submitted:', this.weekSummaryForm.value);
     const transformedState = {
      project_id: this.weekSummaryForm.value.id,
      project_name: this.weekSummaryForm.value.project.projectname,
      start_date: this.weekSummaryForm.value.startDate,
      end_date: this.weekSummaryForm.value.endDate,
      employees: []
    };
     this.store.weeklyReport(transformedState)
      // this.summary.postWeeklySummary(this.weekSummaryForm.value).subscribe((val:any)=>{
      //   console.log(val);
        
      // })
  }

  
}
