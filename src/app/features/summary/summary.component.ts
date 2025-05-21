import { Component, inject } from '@angular/core';
import { SummaryService } from '../../services/summary/summary.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  projects: any = [];
  private summary = inject(SummaryService);
  weekSummaryForm !: FormGroup;

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
      this.summary.postWeeklySummary(this.weekSummaryForm.value).subscribe((val:any)=>{
        console.log(val);
        
      })
  }

  
}
