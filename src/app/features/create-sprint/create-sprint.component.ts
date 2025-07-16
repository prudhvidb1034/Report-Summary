import { Component } from '@angular/core';
import { ReusableTableComponent } from "../../shared/reusable-table/reusable-table.component";
import { of } from 'rxjs';

@Component({
  selector: 'app-create-sprint',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './create-sprint.component.html',
  styleUrl: './create-sprint.component.scss'
})
export class CreateSprintComponent {
  label = 'Sprint';

  columns = [
    { header: 'Sprint Number', field: 'sprintnumber' },
    { header: 'Sprint Name', field: 'sprintname' },
    { header: 'From Date', field: 'fromdate' },
    { header: 'To Date', field: 'todate' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];
sprintList$ = of({
  content: [
    {
      sprintnumber: 1,
      sprintname: 'Sprint Alpha',
      fromdate: '2025-07-01',
      todate: '2025-07-15'
    },
    {
      sprintnumber: 2,
      sprintname: 'Sprint Beta',
      fromdate: '2025-07-16',
      todate: '2025-07-30'
    },
    {
      sprintnumber: 3,
      sprintname: 'Sprint Gamma',
      fromdate: '2025-08-01',
      todate: '2025-08-15'
    }
  ],
  totalElements: 3,
  pageSize: 10,
  pageNumber: 0
});

  handleRowAction(event: any) {
    switch (event.type) {
      case 'create':
        // this.loadCreateEmployeeModal();
        break;
      case 'delete':
        if (event.type === 'delete') {
          console.log('Row from table:', event.item);

        }
        // this.deleteModal(event.row);
        break;
      case 'edit':

        break;

      default:
        console.log('Unknown action type:', event.type);
    }
  }
}
