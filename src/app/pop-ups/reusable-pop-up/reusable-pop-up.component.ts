// reusable-pop-up.component.ts

import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { createProject } from '../../models/project.model';
import { RegistrationForm } from '../../models/register.mode';
import { ToastService } from '../../shared/toast.service';
import { ProjectStore } from '../../state/project.store';
import { SharedService } from '../../services/shared/shared.service';
import { Constants, urls } from '../../constants/string-constants';
import { RegisterStore } from '../../state/register.store';
import { CommonStore } from '../../state/common.store';

@Component({
  selector: 'app-reusable-pop-up',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [ProjectStore, RegisterStore,CommonStore],
  templateUrl: './reusable-pop-up.component.html',
  styleUrl: './reusable-pop-up.component.scss'
})
export class ReusablePopUpComponent {
  private toaster = inject(ToastService)
  private sharedservice = inject(SharedService);
  projectSearch = '';
  employeeSearch = '';
  projectId = [];
  personId = '';
  private projectStore = inject(ProjectStore);
  private registerStore = inject(RegisterStore);
  teamsList$ = this.projectStore.team$;

  private commonStore = inject(CommonStore);
    allProjects$ = this.commonStore.allProjects$;
    allEmployees$ = this.commonStore.employeeList$

  // projectSearch = '';
  projectList: any = [];
  employeeList: any = [];
  filteredProjects: any = [];
  filteredEmployees: any = [];

  projectSelected: boolean = false;
  employeeSelected: boolean = false;
  // teamsList$!: Observable<createProject[]>;
  registerList$!: Observable<RegistrationForm[]>;
  // private projectStore = inject(ProjectStore);
  projectList$ = this.projectStore.team$;
  employeeList$ = this.registerStore.register$

  constructor(private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.commonStore.getAllProjects();
    this.commonStore.getAllProjects();
    this.allProjects$.subscribe(list => {
      this.projectList = list;
      console.log(this.projectList) 
    });
    this.allEmployees$.subscribe((val: any) => {
      this.employeeList = val
      console.log(val);
    })
  }
  selectProject(name: any) {
    console.log(name)
    this.projectSearch = name.projectName;
    this.projectId = name.projectId;
    this.projectSelected = true;
  }
  selectEmployee(name: any) {
    console.log(name)
    this.employeeSearch = name.firstName;
    this.personId = name.personId
    this.employeeSelected = true;
  }

  clearProjectSearch() {
    this.projectSearch = '';
    this.projectSelected = false;
    this.filteredProjects = this.projectList;
  }

  clearEmployeeSearch() {
    this.employeeSearch = '';
    this.employeeSelected = false;
    this.filteredEmployees = this.employeeList;
  }

  onProjectTyping() {
    this.projectSelected = false;
    const search = this.projectSearch.toLowerCase();
    this.filteredProjects = this.projectList.filter((project: any) =>
      project.projectName.toLowerCase().includes(search)
    );
  }

  onEmployeeTyping() {
    this.employeeSelected = false;
    const search = this.projectSearch.toLowerCase();
    this.filteredEmployees = this.employeeList.filter((project: any) =>
      project.firstName.toLowerCase().includes(search)
    );
  }

  filterItems<T>(items: T[], search: string, key: keyof T, selected: boolean): T[] {
    console.log(items, search, key);
    if (!search || selected) return [];
    return items.filter(item =>
      item[key]?.toString().toLowerCase().includes(search.toLowerCase())
    );
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }



  tagEmployee() {
    // 1. Validate first
    if (!this.projectSelected || !this.employeeSelected) {
      this.toaster.show('warning', 'Please enter all fields!');
      return;
    }

    // 2. Build URL with query params
    const urlWithParams = `${urls.TAG_EMPLOYEE}?personId=${this.personId}`;
    const body = [this.projectId];

    console.log('Tagging employee with:', urlWithParams, body);

    // 3. Call API
    this.sharedservice.postData(urlWithParams, body).subscribe({
      next: () => {
        this.toaster.show('success', 'Employee tagged successfully!');
        this.modalCtrl.dismiss();
      },
      error: (err) => {
        console.error('Error tagging employee:', err);
        this.toaster.show('error', 'Failed to tag employee. Please try again.');
      }
    });
  }


}
