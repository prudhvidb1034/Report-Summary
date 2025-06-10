import { Component, inject } from '@angular/core';
import { ManagerEmpListComponent } from '../../../shared/manager-emp-list/manager-emp-list.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [ManagerEmpListComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {
  private route = inject(Router)
  private router = inject(ActivatedRoute)
  employeeId:any
  ngOnInit() {
    this.router.paramMap.subscribe((params: ParamMap) => {
      console.log(params.get('id'));
      this.employeeId = params.get('id')
    });
  }
}
