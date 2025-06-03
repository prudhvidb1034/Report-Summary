import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ToastComponent } from '../../shared/toast/toast.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-view-all-projects',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './view-all-projects.component.html',
  styleUrl: './view-all-projects.component.scss'
})
export class ViewAllProjectsComponent {
  private http = inject(HttpClient)
  private route = inject(Router)
  private router = inject(ActivatedRoute);
  projects: any = [];
  projectDetails: any = [];
  dailyUpdates: any = [];

  ngOnInit() {
    this.http.get('http://localhost:3000/projects').subscribe(
      (projects: any) => {
        console.log(projects);
        this.projects = projects;
      }
    );
  }
  selectProject(project: any) {
    console.log(project)
    this.projectDetails = project
    console.log(this.projectDetails)
    this.projectDetails.employees.forEach((employee: any, index: number) => {
      console.log(`Employee #${index + 1}:`);
      console.log('Name:', employee.employee_name);
      console.log('Summary:', employee.summary);
      console.log('Tech Stack:', employee.techstack);
      console.log('Daily Updates:', employee.daily_updates);
      if (employee.daily_updates?.length > 0) {
        this.dailyUpdates = employee?.daily_updates
        this.dailyUpdates.forEach((update: any) => {
          console.log('Status:', update.status);
          console.log('Task:', update.task);
        });
      }
    })
  }
} 
