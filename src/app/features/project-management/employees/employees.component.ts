import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ReusableTableComponent } from "../../../shared/reusable-table/reusable-table.component";
import { Observable, of } from 'rxjs';
import { IonicModule, ModalController } from '@ionic/angular';
import { RegisterComponent } from '../../../shared/register/register.component';
import { EmployeeUpdateComponent } from '../../../pop-ups/employee-update/employee-update.component';
import { CreateProjectComponent } from '../../../pop-ups/create-project/create-project.component';
import { ReusablePopUpComponent } from '../../../pop-ups/reusable-pop-up/reusable-pop-up.component';
import { ProjectStore } from '../../../state/project.store';
import { SummaryStore } from '../../../state/summary.store';
import { RegisterStore } from '../../../state/register.store';
import { ConfirmDeleteComponent } from '../../../pop-ups/confirm-delete/confirm-delete.component';
import { CommonModule } from '@angular/common';
import { Constants } from '../../../constants/string-constants';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [ReusableTableComponent, IonicModule, CommonModule],
  providers: [ProjectStore, RegisterStore],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {

  label = 'Employee';
  private modalController = inject(ModalController);
  private route = inject(Router)
  private router = inject(ActivatedRoute)
  employeeId: any;
  private projectStore = inject(ProjectStore);
  private registerStore = inject(RegisterStore);
  teamsList$ = this.projectStore.team$;
  isLoading$ = this.registerStore.select(state => state.loading);
  page = 0;
  pageSize = 5;
  registerList$: any;
  projectId: string | null;
  baseUrl:string | null | undefined;



  constructor(){
    this.projectId = this.router.snapshot.paramMap.get('id');
    this.projectId?this.baseUrl='Person/project/'+this.projectId:this.baseUrl=Constants.ROLE_EMPLOYEE
    this.loadEmployees(this.page,this.pageSize);
  }
  ngOnInit() {
   // this.projectStore.getTeam();


  }

  columns = [
    { header: 'Employee ID', field: 'personId' },
    { header: 'Employee Name', field: 'firstName' },
    { header: 'Mail id', field: 'email' },
    { header: 'Project', field: 'projectNames' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];



  handleRowAction(event: any) {
    switch (event.type) {
      case 'create':
        this.loadCreateEmployeeModal();
        break;
      case 'tagEmployee':
        this.loadtagEmployeeModal();
        break;
      case 'edit':
        this.EditCreateEmployeeModal(event.item);
        break;
      case 'delete':
        this.deleteModal(event.item);
        break;
        case 'nextPage':
        this.page=event.item;
        this.loadEmployees(this.page,this.pageSize);
       break;
        case 'pageSize':
        this.pageSize=event.item;
        this.loadEmployees(this.page,this.pageSize);  
        break;
      default:
        console.log('Unknown action type:', event.type);
    }
  }

  loadCreateEmployeeModal() {
    this.modalController.create({
      component: RegisterComponent,
      cssClass: 'register-modal',
      componentProps: {
        role: 'employee',
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
          this.registerStore.getRegisterData({ page: 0, size: 5, sortBy: 'firstName',url: this.baseUrl ?? ''});
        console.log('Modal dismissed with data:', data);
      });
    });
  }
  EditCreateEmployeeModal(item: any) {
    this.modalController.create({
      component: RegisterComponent,
      cssClass: 'register-modal',
      componentProps: {
        role: 'employee',
        editData: item,
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
        this.registerStore.getRegisterData({ page: 0, size: 5, sortBy: 'firstName',url: this.baseUrl ?? '' });
        console.log('Modal dismissed with data:', data);
      });
    });
  }
  loadtagEmployeeModal() {
    this.modalController.create({
      component: ReusablePopUpComponent,
      cssClass: 'reusable-popUp-modal',
      componentProps: {
        teamsList$: this.teamsList$,
        registerList$: this.registerList$,
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
        console.log('Modal dismissed with data:', data);
      });
    });
  }
  deleteModal(item: any) {
    this.modalController.create({
      component: ConfirmDeleteComponent,
      cssClass: 'custom-delete-modal',
      componentProps: {
        role: 'delete',
        data: {
          id: item.personId,
          name: item.firstName,

        }
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((result) => {
        if (result?.data?.confirmed) {
          this.registerStore.deleteProject(result.data.id);
           
        }
      });
    });
  }

  loadEmployees(pageNum:number,pageSize:number ){
  this.registerStore.getRegisterData({ page: pageNum, size: pageSize, sortBy: 'firstName', url: this.baseUrl ?? '' });
  this.registerList$ = this.registerStore.register$;
}

}
