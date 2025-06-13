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
    this.selectedEmployeeId = ''; 
  }

  onSearch() {
  const selectedProject = this.allProjects.find(p => p.id === this.selectedProjectId);
  if (!selectedProject) return;

  const employeesToShow = this.selectedEmployeeId
    ? selectedProject.employees.filter((e: any) => e.employee_id === this.selectedEmployeeId)
    : selectedProject.employees;

  const flatList = employeesToShow.map((emp: any) => {
    const allTasks = emp.daily_updates
      .map((update: any) => update.task)
      .filter(Boolean)
      .join(', ');

    const allAccomplishments = emp.daily_updates
      .flatMap((update: any) => update.keyAccomplishments || [])
      .join(', ');

    return {
      id: selectedProject.id,
      project_name: selectedProject.project_name,
      upcomingTasks: allTasks,
      employee_name: emp.employee_name,
      summary: emp.summary,
      keyAccomplishments: allAccomplishments
    };
  });

  this.projectData$.next(flatList);
}

}

