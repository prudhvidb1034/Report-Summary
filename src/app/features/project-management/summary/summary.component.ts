import { Component, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { map, Observable, of, take } from 'rxjs';
import { ReusableTableComponent } from '../../../shared/reusable-table/reusable-table.component';
import { SummaryStore } from '../../../state/summary.store';
import { CreateSummaryComponent } from '../../../pop-ups/create-summary/create-summary.component';
import { EmployeeUpdateComponent } from '../../../pop-ups/employee-update/employee-update.component';
import { ConfirmDeleteComponent } from '../../../pop-ups/confirm-delete/confirm-delete.component';
import { LoginStore } from '../../../state/login.store';
import { WeekRangePipe } from '../../../shared/pipes/week-range.pipe';

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

  // projects: createProject[] = [];
  // private summary = inject(SummaryService);
  // weekSummaryForm !: FormGroup;
  private route = inject(Router);
  userRole$ = this.loginStore.user$.pipe(
    map(res => res?.role?.toLocaleLowerCase())
  );
  role: any;

  columns: any;
  page = 0;
  pageSize = 5;


  constructor() {
    this.loadSummary(this.page, this.pageSize)
  }

  ngOnInit() {
    this.userRole$.pipe(take(1)).subscribe(role => {
      this.role = role;
      console.log('User role:', role);
    });
    if (this.role == 'employee') {
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

    console.log(this.userRole$)
  }
  // private readonly store = inject(SummaryStore);
  // dateError: string | null = null;
  // private readonly fb = inject(FormBuilder);
  // ngOnInit() {
  //   this.weekSummaryForm = this.fb.group({
  //     project: [null, Validators.required],
  //     startDate: ['', [Validators.required]],
  //     endDate: ['', [Validators.required]],
  //     upcomingTasks: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
  //   });
  //   this.weekSummaryForm.get('endDate')?.valueChanges.subscribe(() => {
  //     this.validateDates();
  //   });
  //   this.getProjects()
  // }

  // // create a formArray for upcoming tasks
  // get upcomingTasks(): FormArray {
  //   return this.weekSummaryForm.get('upcomingTasks') as FormArray;
  // }

  // validateDates(): boolean {
  //   const startDate = this.weekSummaryForm.get('startDate')?.value;
  //   const endDate = this.weekSummaryForm.get('endDate')?.value;
  //   if (!startDate || !endDate) {
  //     this.dateError = null;
  //     return true;
  //   }
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);
  //   if (start > end) {
  //     this.dateError = 'Start date cannot be greater than end date';
  //     return false;
  //   }
  //   this.dateError = null;
  //   return true;
  // }

  // getProjects() {
  //   this.summary.getProjectTitles().subscribe((val: any) => {
  //     this.projects = val
  //   })
  // }

  // onSubmit() {

  //   if (!this.validateDates()) {
  //     alert(this.dateError);
  //     return;
  //   }
  //   if (this.weekSummaryForm) {
  //     console.log(this.weekSummaryForm.value);
  //     const transformedState = {
  //       project_id: this.weekSummaryForm.value.id,
  //       project_name: this.weekSummaryForm.value.project.projectname,
  //       start_date: this.weekSummaryForm.value.startDate,
  //       end_date: this.weekSummaryForm.value.endDate,
  //       upcomingTasks: this.weekSummaryForm.value.upcomingTasks,
  //       employees: []
  //     };
  //     this.store.weeklyReport(transformedState)
  //     this.route.navigate(['/projects'])
  //   }
  // }

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

  summarylist$: any;

  handleRowAction(event: any) {
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
        this.updatedRowData(event);
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
        this.page = event.item;
        this.loadSummary(this.page, this.pageSize)
        break;
      case 'pageSize':
        this.pageSize = event.item;
        this.loadSummary(this.page, this.pageSize)
        break;
      case 'navigate':
        this.navigate(event);
        break;
      default:
        console.log('Unknown action type:', event.type);
    }
  }
  updatedRowData(event: any) {
    this.summary.filter((val: any) => val.weekId === event.item.weekId ? val.status = event.value : '');
    console.log(event)
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


  navigate(event: any) {
    if (event.columnName === 'View Task') {
      this.route.navigate(
        ['/summary/task', event.item.weekRange.weekId],
        { state: { name: this.datePipe.transform(event.item.weekRange) } }
      );
      console.log(this.datePipe.transform(event.item.weekRange));
    } else {
      this.route.navigate(
        ['view-reports/', event.item.weekRange.weekId],
        { state: { name: this.datePipe.transform(event.item.weekRange) } }
      );
    }
    console.log(event);
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
