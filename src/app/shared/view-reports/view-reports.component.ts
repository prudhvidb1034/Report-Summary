import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SummaryStore } from '../../state/summary.store';
import { LoginStore } from '../../state/login.store';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-reports',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './view-reports.component.html',
  styleUrl: './view-reports.component.scss',
  // providers:[SummaryStore]

})
export class ViewReportsComponent {

  project: any = [];
  private loginStore = inject(LoginStore)
  private http = inject(HttpClient)
  private route = inject(Router)
  private router = inject(ActivatedRoute)
  foundProject: any = [];
  dailyUpdates: any;


  ngOnInit() {
    this.router.paramMap.subscribe((params: ParamMap) => {
      const projectId = params.get('id');
      console.log('Project ID:', projectId);

      this.http.get('http://localhost:3000/projects').subscribe(
        (projects: any) => {
          // Find the project with matching ID
          this.foundProject = projects.find((project: any) => project.id === projectId);

          if (this.foundProject) {
            console.log('Found project:', this.foundProject);

            // Check if employees exist
            if (this.foundProject.employees && this.foundProject.employees.length > 0) {
              console.log('Employees:');

              // Loop through all employees
              this.foundProject.employees.forEach((employee: any, index: number) => {
                console.log(`Employee #${index + 1}:`);
                console.log('Name:', employee.employee_name);
                console.log('Summary:', employee.summary);
                console.log('Tech Stack:', employee.techstack);
                console.log('Daily Updates:', employee.daily_updates);
                console.log('----------------------'); // Separator

                // Process daily updates for each employee
                if (employee.daily_updates?.length > 0) {
                this.dailyUpdates =  employee?.daily_updates
                
                 this.dailyUpdates.forEach((update: any) => 
                    {
                    console.log('Status:', update.status);
                    console.log('Task:', update.task);
                  });
                }
                 else 
                {
                console.log('No project found with ID:', projectId);
              }
            })
          }
        }
      })
    })
  }
}

            

