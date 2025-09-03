import { Component, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { ReusableTableComponent } from '../../../shared/reusable-table/reusable-table.component';
import { SummaryStore } from '../../../state/summary.store';
import { CreateSummaryComponent } from '../../../pop-ups/create-summary/create-summary.component';
import { ConfirmDeleteComponent } from '../../../pop-ups/confirm-delete/confirm-delete.component';
import { LoginStore } from '../../../state/login.store';
import { WeekRangePipe } from '../../../shared/pipes/week-range.pipe';
import { ColumnConfig } from '../../../models/column.model';
import { WeeklyDataResponse, WeeklyEntry } from '../../../models/summary.model';


@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, ReusableTableComponent, IonicModule],
  providers: [SummaryStore, WeekRangePipe],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  label = 'Summary';
  private modalController = inject(ModalController);
  private loginStore = inject(LoginStore)
  private readonly summaryStore = inject(SummaryStore);
  private datePipe = inject(WeekRangePipe);
  isLoading$ = this.summaryStore.select(state => state.loading);
  private route = inject(Router);
  userRole$ = this.loginStore.user$.pipe(
    map(res => res?.role?.toLocaleLowerCase())
  );
  role!: string;

  columns!: ColumnConfig[];
  page = 0;
  pageSize = 5;


  constructor() {
    this.loadSummary(this.page, this.pageSize)
  }

  ngOnInit() {
    this.userRole$.pipe(take(1)).subscribe((role: string | undefined) => {
      this.role = role ?? '';
      
    });
    if (this.role === 'employee') {
      this.columns = [
        { header: 'Name ', field: 'weekRange' },
        { header: 'View Task', field: 'viewTask', linkEnable: true },
        { header: 'View Report', field: 'viewReport', linkEnable: true },
      ];

    } else {
      this.columns = [
        { header: 'Name ', field: 'weekRange' },
        { header: 'Status', field: 'status' },
        { header: 'View Task', field: 'viewTask', linkEnable: true },
        { header: 'View Report', field: 'viewReport', linkEnable: true },
        { header: 'Action', field: 'action', type: ['edit', 'delete'], },
      ];

    }

    
  }

  summary = [
    {
      weekId: 'WEEK 01-June-2025 To 07-June-2025',
      weekNo: 0,
      // startDate: '2025-05-01',
      // endDate: '2025-05-07',
      status: 'Active',
      viewTask: 'View Task',
      viewReport: 'View Report'
    },
    {
      weekId: 'WEEK 08-June-2025 To 14-June-2025',
      weekNo: 1,
      // startDate: '2025-05-08',
      // endDate: '2025-05-14',
      status: 'InActive',
      viewTask: 'View Task',
      viewReport: 'View Report'
    }
  ];

  summarylist$!: Observable<WeeklyDataResponse>;

  handleRowAction(event: { type: string, item: WeeklyEntry }) {
    switch (event.type) {
      case 'viewTask':
        this.route.navigate(['summary/task', event.item.weekId]);
        break;
      case 'viewReport':
        this.route.navigate(['summary/project-status', event.item.weekNo]);
        break;
      case 'create':
        this.loadCreateEmployeeModal();
        break;
      case 'toggle-status':
        this.updatedRowData(event.item);
        break;
      case 'createStatus':
        this.updateWeeklySummary();
        break;
      case 'edit':
        this.loadCreateEmployeeModal();
        break;
      case 'delete':
        this.deleteModal();
        break;
      case 'nextPage':
        if (typeof event.item === 'number') {
          this.page = event.item;
        }
        this.loadSummary(this.page, this.pageSize)
        break;
      case 'pageSize':
        if (typeof event.item === 'number') {
          this.pageSize = event.item;
        }
        this.loadSummary(this.page, this.pageSize)
        break;
      case 'navigate':
        this.navigate(event);
        break;
      default:
        ;
    }
  }
  updatedRowData(event: WeeklyEntry) {
    this.summary.forEach((val) => {
      if (val.weekId === event.weekId) {
        val.status = event.status;
      }
    });
    ;
  }

  loadCreateEmployeeModal() {
    this.modalController.create({
      component: CreateSummaryComponent,
      cssClass: 'create-summary-modal',
      componentProps: {
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
        console.log('Modal dismissed with data:', data);
      });
    });
  }


navigate(event: { type: string; item: WeeklyEntry }) {
  if (event.type === 'viewTask') {
    this.route.navigate(
      ['/summary/task', event.item.weekId],
      { state: { name: this.datePipe.transform(event.item.weekRange) } }
    );
    
  } else {
    this.route.navigate(
      ['view-reports/', event.item.weekId],
      { state: { name: this.datePipe.transform(event.item.weekRange) } }
    );
  }
}


  updateWeeklySummary() {
    this.route.navigate(['/summary/employee-dashboard'])
  }
  deleteModal() {
    this.modalController.create({
      component: ConfirmDeleteComponent,
      cssClass: 'custom-delete-modal',
      componentProps: {
        role: 'delete',
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
        console.log('Modal dismissed with data:', data);
        // Handle any data returned from the modal if needed
      });
    });
  }

  loadSummary(pageNum: number, pageSize: number) {
    this.summaryStore.getDetails({ page: pageNum, size: pageSize });
    this.summarylist$ = this.summaryStore.weeklyRange$;
  }
}
