import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ReusableTableComponent } from "../../../shared/reusable-table/reusable-table.component";
import { Observable, of } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { RegisterComponent } from '../../../shared/register/register.component';
import { EmployeeUpdateComponent } from '../../../pop-ups/employee-update/employee-update.component';
import { CreateProjectComponent } from '../../../pop-ups/create-project/create-project.component';
import { ReusablePopUpComponent } from '../../../pop-ups/reusable-pop-up/reusable-pop-up.component';
import { TeamStore } from '../../../state/team.store';
import { SummaryStore } from '../../../state/summary.store';
import { RegisterStore } from '../../../state/register.store';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [ReusableTableComponent],
  providers: [TeamStore, RegisterStore],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {

  label = 'Employee';
  private modalController = inject(ModalController);
  private route = inject(Router)
  private router = inject(ActivatedRoute)
  employeeId: any;
  private teamStore = inject(TeamStore);
  private registerStore = inject(RegisterStore);
  registerList$ = this.registerStore.register$;
  teamsList$ = this.teamStore.team$;
  ngOnInit() {
    this.teamStore.getTeam();
    this.registerStore.getRegisterData({ role: 'employee' });


    this.router.paramMap.subscribe((params: ParamMap) => {
      console.log(params.get('id'));
      this.employeeId = params.get('id')
    });


  }

  columns = [
    { header: 'Employee ID', field: 'employeeId' },
    { header: 'Employee Name', field: 'employeeName' },
    { header: 'Mail id', field: 'mailId' },
    { header: 'Project', field: 'project' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];


  employees = [
    {
      employeeId: 'EMP001',
      employeeName: 'Alice Johnson',
      mailId: 'alice.johnson@example.com',
      project: 'Zira Clone'
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Bob Smith',
      mailId: 'bob.smith@example.com',
      project: 'iTraceu Enhancement'
    },
    {
      employeeId: 'EMP003',
      employeeName: 'Charlie Lee',
      mailId: 'charlie.lee@example.com',
      project: 'Onboarding Portal'
    },
    {
      employeeId: 'EMP004',
      employeeName: 'Diana Cruz',
      mailId: 'diana.cruz@example.com',
      project: 'Payroll Integration'
    },
    {
      employeeId: 'EMP005',
      employeeName: 'Ethan Patel',
      mailId: 'ethan.patel@example.com',
      project: 'UI Revamp'
    },
    {
      employeeId: 'EMP006',
      employeeName: 'Fiona Wright',
      mailId: 'fiona.wright@example.com',
      project: 'Admin Dashboard'
    }
  ];


  employeelist$: Observable<any[]> = of(this.employees);

  handleRowAction(event: any) {
    switch (event.type) {
      case 'create':
        this.loadCreateEmployeeModal();
        break;
      case 'tagEmployee':
        this.loadtagEmployeeModal();
        break;
      default:
        console.log('Unknown action type:', event.type);
    }
  }

  loadCreateEmployeeModal() {
    this.modalController.create({
      component: RegisterComponent,
      componentProps: {
        role: 'employee',
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
        console.log('Modal dismissed with data:', data);
      });
    });
  }
  loadtagEmployeeModal() {
    this.modalController.create({
      component: ReusablePopUpComponent,
      cssClass: 'custom-modal',
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
}
