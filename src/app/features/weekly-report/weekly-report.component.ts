import { Component, inject } from '@angular/core';
import { ReusableTableComponent } from "../../shared/reusable-table/reusable-table.component";
import { map, of, pluck } from 'rxjs';
import { CreateWeeklyReportComponent } from '../../pop-ups/create-weekly-report/create-weekly-report.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SprintStore } from '../../state/sprint.store';
import { CommonModule } from '@angular/common';
import { WeekRangePipe } from '../../shared/pipes/week-range.pipe';

@Component({
  selector: 'app-weekly-report',
  standalone: true,
  imports: [ReusableTableComponent,IonicModule,CommonModule],
  providers:[SprintStore,WeekRangePipe],
  templateUrl: './weekly-report.component.html',
  styleUrl: './weekly-report.component.scss'
})
export class WeeklyReportComponent {
  label = 'Weekly Report';
  private routering = inject(ActivatedRoute);
  private modalController = inject(ModalController);
  columns = [
    { header: 'Week Number', field: 'weekId' },
    { header: 'Week Start Date', field: 'weekFromDate' },
    { header: 'Week End Date', field: 'weekToDate' },
    { header: 'Weekly Update', field: 'View', linkEnable: true, },
    { header: 'Status', field: 'status' },

  ];
  sprintId: any;

  private sprintStore = inject(SprintStore);
  weeklysprintList$: any;
  weeklyReportById$: any;
  isLoading$ = this.sprintStore.select(state => state.loading);
  private router = inject(Router);
private datePipe=inject(WeekRangePipe);
  
  constructor(private route: ActivatedRoute) {
    this.sprintId = this.route.snapshot.paramMap.get('id');
    this.sprintStore.getSprintById(this.sprintId);
  }

  ngOnInit() {
    this.loadWeeklyReport();
    console.log(this.sprintId);
  }

  handleRowAction(event: any) {
    switch (event.type) {
      case 'create':
        this.loadCreateEmployeeModal();
        break;
      case 'delete':
        break;
      case 'edit':
        break;
      case 'navigate':
        this.navigate(event);
        break;

      default:
        console.log('Unknown action type:', event.type);
    }
  }

  loadCreateEmployeeModal() {
    this.modalController.create({
      component: CreateWeeklyReportComponent,
      cssClass: 'create-account-modal',
      componentProps: {

      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
        console.log('Modal dismissed with data:', data);
      });
    });
  }

  loadWeeklyReport() {
    this.weeklysprintList$ = this.sprintStore.weeklySprint$.pipe(
      map((resp: any) => {
        const weeks = resp[0]?.weeks;
        return {
          content: weeks,
        };
      })
    );
  }

  navigate(event: any) {
    if (event.columnName === 'Weekly Update') {
      console.log(event);
      this.router.navigateByUrl('sprints/create-weekly-sprint/create-weekly-report-sprint'+'/'+event.item.weekId,  { state: { name: this.datePipe.transform(event.item) } });
    }
  }

}
