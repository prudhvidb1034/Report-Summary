// reusable-pop-up.component.ts

import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { createTeam } from '../../models/project.model';
import { RegistrationForm } from '../../models/register.mode';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-reusable-pop-up',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './reusable-pop-up.component.html',
  styleUrl: './reusable-pop-up.component.scss'
})
export class ReusablePopUpComponent {
  constructor(private modalCtrl: ModalController) { }

  private toaster = inject(ToastService)
  @Input() teamsList$!: Observable<createTeam[]>;
  @Input() registerList$!: Observable<RegistrationForm[]>;

  projectSearch = '';
  employeeSearch = '';

  projectSelected: boolean = false;
  employeeSelected: boolean = false;

  selectProject(name: string) {
    this.projectSearch = name;
    this.projectSelected = true;
  }

  selectEmployee(name: string) {
    this.employeeSearch = name;
    this.employeeSelected = true;
  }

  clearProjectSearch() {
    this.projectSearch = '';
    this.projectSelected = false;
  }

  clearEmployeeSearch() {
    this.employeeSearch = '';
    this.employeeSelected = false;
  }

  onProjectTyping() {
    this.projectSelected = false;
  }

  onEmployeeTyping() {
    this.employeeSelected = false;
  }

  filterProjects(projects: createTeam[], search: string): createTeam[] {
    if (!search || this.projectSelected) return [];
    return projects.filter(p =>
      p.projectname?.toLowerCase().includes(search.toLowerCase())
    );
  }

  filterEmployees(employees: RegistrationForm[], search: string): RegistrationForm[] {
    if (!search || this.employeeSelected) return [];
    return employees.filter(e =>
      e.firstName?.toLowerCase().includes(search.toLowerCase())
    );
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
  tagEmployee() {
    if (!this.projectSelected || !this.employeeSelected) {
      this.toaster.show('warning', 'Please enter all fields!');
      return;
    }
    this.modalCtrl.dismiss();
    this.toaster.show('success', 'Employee tagged successfully!');
  }

}
