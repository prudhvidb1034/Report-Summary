import { Component, inject } from '@angular/core';
import { ReusableTableComponent } from "../../shared/reusable-table/reusable-table.component";
import { CommonStore } from '../../state/common.store';
import { PiPgrogressStore } from '../../state/pi-progress.store';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pi-progress',
  standalone: true,
  imports: [ReusableTableComponent],
  providers: [PiPgrogressStore, CommonStore],
  templateUrl: './pi-progress.component.html',
  styleUrl: './pi-progress.component.scss'
})
export class PiProgressComponent {

    accountList$: any;
    label = 'PI Progress'
    quaterlyReport = inject(PiPgrogressStore);
    commonStore = inject(CommonStore);
    quaterlyReport$: any;
    private modalController = inject(ModalController);
    ngOnInit() {
      // this.quaterlyReport.getQuaterlyReports()
      // this.quaterlyReport$ = this.quaterlyReport.quaterlyReport$
    }



     columns = [
    { header: 'Team', field: 'team' },
    { header: 'Lead Name', field: 'leadname' },
    { header: 'Assigned SP', field: 'Assignedp' },
    { header: 'Completed SP', field: 'completedsp' },
      { header: '% of Completion', field: 'Percentage' },
   
    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];

   handleRowAction(event: any) {
    switch (event.type) {
      // case 'create':
      //   this.loadCreateQuaterlyReport();
      //   break;
      // case 'edit':
      //   this.UpdateQuaterlyReport(event.item);
      //   break;
      // case 'delete':
      //   this.deleteModal(event.item);
      //   break;
      default:
        console.log('failing')
    }
  }

}
