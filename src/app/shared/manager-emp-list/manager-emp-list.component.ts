import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RegisterStore } from '../../state/register.store';
import { ReusableTableComponent } from '../reusable-table/reusable-table.component';

@Component({
  selector: 'app-manager-emp-list',
  standalone: true,
  imports: [CommonModule, IonicModule, ReusableTableComponent],
  providers: [RegisterStore],
  templateUrl: './manager-emp-list.component.html',
  styleUrl: './manager-emp-list.component.scss'
})
export class ManagerEmpListComponent {

  columns = [
    { header: 'Employee ID', field: 'employeeId' },
    { header: 'Employee Name', field: 'firstName' },
    { header: 'Mail Id', field: 'username' },
    { header: 'Project', field: 'projectName' },
    { header: 'Action', field: 'action' },
  ];
  @Input() title: string = '';
  @Input() id: string = '';
  private getRegisterStore = inject(RegisterStore);
  teamRegisterList$ = this.getRegisterStore.register$;

  constructor() {
    this.teamRegisterList$.subscribe((res: any) => {
     console.log(res)
    })
    
  }
}
