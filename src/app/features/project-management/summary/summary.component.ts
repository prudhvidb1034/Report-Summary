import { Component, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ReusableTableComponent } from '../../../shared/reusable-table/reusable-table.component';
import { SummaryStore } from '../../../state/summary.store';
import { CreateSummaryComponent } from '../../../pop-ups/create-summary/create-summary.component';
import { EmployeeUpdateComponent } from '../../../pop-ups/employee-update/employee-update.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, ReusableTableComponent],
  providers: [SummaryStore],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  label = 'Summary';
  private modalController = inject(ModalController);
  // projects: createTeam[] = [];
  // private summary = inject(SummaryService);
  // weekSummaryForm !: FormGroup;
  private route = inject(Router)
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
      weekId: 'WEEK:01-June-2025 To 07-June-2025',
      weekNo:0,
      // startDate: '2025-05-01',
      // endDate: '2025-05-07',
      status: 'Active',
      viewTask: 'View Task',
      viewReport: 'View Report'
    },
    {
      weekId: 'WEEK:08-June-2025 To 14-June-2025',
       weekNo:1,
      // startDate: '2025-05-08',
      // endDate: '2025-05-14',
      status: 'InActive',
      viewTask: 'View Task',
      viewReport: 'View Report'
    }
  ];
  columns = [
    { header: 'Name ', field: 'weekId' },
    // { header: 'Start Date', field: 'startDate' },
    // { header: 'End Date', field: 'endDate' },
    { header: 'Status', field: 'status' },
//     { header: 'View Task', field: 'viewTask' },
//     { header: 'View Report', field: 'viewReport' },
//     { header: 'Action', field: 'action', type: ['edit', 'delete'], },

    {header:'View Task',field:'viewTask',linkEnable:true},
    {header:'View Report',field:'viewReport',linkEnable:true},
    { header: 'Action', field: 'action', type: [ 'edit', 'delete'], },
  ];

  summarylist$: Observable<any[]> = of(this.summary);

  handleRowAction(event: any) {
    console.log(event)
    switch (event.type) {
      case 'viewTask':
        this.route.navigate(['summary/task', event.item.weekNo]);
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
      default:
        console.log('Unknown action type:', event.type);
    }
  }
  updatedRowData(event: any) {
    this.summary.filter((val:any)=>val.weekId===event.item.weekId?val.status=event.value:'');
    console.log(event)
  }

  loadCreateEmployeeModal() {
    this.modalController.create({
      component: CreateSummaryComponent,
      componentProps: {
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
        console.log('Modal dismissed with data:', data);
      });
    });
  }

  updateWeeklySummary() {
    this.modalController.create({
      component: EmployeeUpdateComponent,
      // cssClass: 'custom-modal',
      componentProps: {
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((data) => {
        console.log('Modal dismissed with data:', data);
        // Handle any data returned from the modal if needed
      });
    });
  }
}
