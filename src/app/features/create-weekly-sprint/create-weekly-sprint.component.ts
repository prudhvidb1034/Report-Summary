import { Component } from '@angular/core';
import { ReusableTableComponent } from "../../shared/reusable-table/reusable-table.component";
import { of } from 'rxjs';

@Component({
  selector: 'app-create-weekly-sprint',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './create-weekly-sprint.component.html',
  styleUrl: './create-weekly-sprint.component.scss'
})
export class CreateWeeklySprintComponent {
 label = 'Weekly Sprint';

  columns = [
    { header: 'Week Number', field: 'weeknumber' },
    { header: 'Week Start Date', field: 'startdate' },
    { header: 'Week End Date', field: 'enddate' },
       { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];
weeklysprintList$ = of({
  content: [
    {
      weeknumber: 1,
      startdate: '2025-07-01',
      enddate: '2025-07-07'
    },
    {
      weeknumber: 2,
      startdate: '2025-07-08',
      enddate: '2025-07-14'
    },
    {
      weeknumber: 3,
      startdate: '2025-07-15',
      enddate: '2025-07-21'
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
