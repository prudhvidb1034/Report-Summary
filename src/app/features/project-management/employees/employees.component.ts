import { Component } from '@angular/core';
import { ManagerEmpListComponent } from '../../../shared/manager-emp-list/manager-emp-list.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [ManagerEmpListComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {

}
