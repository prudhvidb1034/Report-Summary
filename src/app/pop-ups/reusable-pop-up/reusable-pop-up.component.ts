// reusable-pop-up.component.ts

import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { createProject } from '../../models/project.model';
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
   private toaster = inject(ToastService)
  projectSearch = '';
  employeeSearch = '';

  projectSelected: boolean = false;
  employeeSelected: boolean = false;
   teamsList$!: Observable<createProject[]>;
  registerList$!: Observable<RegistrationForm[]>;

  constructor(private modalCtrl: ModalController) { 
   
     this.modalCtrl.getTop().then(modal => {
      if (modal?.componentProps) {
        this.teamsList$ = modal.componentProps['teamsList$'];
        this.registerList$ = modal.componentProps['registerList$'];
      }
    });
  }

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

  filterItems<T>(items: T[], search: string, key: keyof T, selected: boolean): T[] {
    if (!search || selected) return [];
    return items.filter(item =>
      item[key]?.toString().toLowerCase().includes(search.toLowerCase())
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
