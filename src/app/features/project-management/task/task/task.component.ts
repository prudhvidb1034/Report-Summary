import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { SummaryService } from '../../../../services/summary/summary.service';
import { SummaryStore } from '../../../../state/summary.store';
import { ReusableTableComponent } from '../../../../shared/reusable-table/reusable-table.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [ReusableTableComponent, CommonModule,IonicModule,FormsModule],
  providers: [SummaryStore],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  label = 'Task';

  private projectData$ = new BehaviorSubject<any[]>([]);
  public readonly projectDataObservable$ = this.projectData$.asObservable();

  private getprojects = inject(SummaryStore);

  // New variables
  allProjects: any[] = [];
  filteredEmployees: any[] = [];
  selectedProjectId: string = '';
  selectedEmployeeId: string = '';

  columns = [
    { header: 'Team ID', field: 'id' },
    { header: 'Project Name', field: 'project_name' },
    { header: 'Employee Name', field: 'employee_name' },
    { header: 'Tasks', field: 'upcomingTasks' },
    { header: 'Summary', field: 'summary' },
    { header: 'Key Accomplishments', field: 'keyAccomplishments' }
  ];

  ngOnInit() {
    this.getprojects.getDetails();

    this.getprojects.projects$.subscribe((projects: any[]) => {
      this.allProjects = projects;
    });
  }

  onProjectChange() {
    const selectedProject = this.allProjects.find(p => p.id === this.selectedProjectId);
    this.filteredEmployees = selectedProject?.employees || [];
    this.selectedEmployeeId = ''; // Reset employee on project change
  }

  onSearch() {
    const selectedProject = this.allProjects.find(p => p.id === this.selectedProjectId);
    const employee = selectedProject?.employees?.find((e:any) => e.employee_id === this.selectedEmployeeId);

    if (!selectedProject || !employee) return;

    const allTasks = employee.daily_updates
      .map((update: any) => update.task)
      .filter(Boolean)
      .join(', ');

    const allAccomplishments = employee.daily_updates
      .flatMap((update: any) => update.keyAccomplishments || [])
      .join(', ');

    const filteredRecord = [{
      id: selectedProject.id,
      project_name: selectedProject.project_name,
      upcomingTasks: allTasks,
      employee_name: employee.employee_name,
      summary: employee.summary,
      keyAccomplishments: allAccomplishments
    }];

    this.projectData$.next(filteredRecord);
  }
}

