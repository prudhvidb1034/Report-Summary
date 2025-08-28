import { Component,  inject, } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { EmployeeUpdateService } from '../../services/employee-update/employee-update.service';
import { SummaryStore } from '../../state/summary.store';
import { LoginStore } from '../../state/login.store';
import { Project } from '../../models/summary.model';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { CommonStore } from '../../state/common.store';
@Component({
  selector: 'app-employee-update',
  standalone: true,
  providers: [SummaryStore, CommonStore],
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './employee-update.component.html',
  styleUrl: './employee-update.component.scss'
})
export class EmployeeUpdateComponent {
  private readonly employeeupdate = inject(EmployeeUpdateService);
  Dates: Project[] = [];
  dateError: string | null = null;
  private summary = inject(SummaryStore);
  private loginStore = inject(LoginStore);
  private router = inject(Router);
  week:any=[];
  userInfo: any;
  projectInfo = '';
  weekValue = 'WEEK:16-June-2025 To 20-June-2025';
  private modalCtrl = inject(ModalController);
  // weekOptions = [
  //   'WEEK:16-June-2025 To 20-June-2025',
  //   'WEEK:08-June-2025 To 14-June-2025',
  //   'WEEK:01-June-2025 To 07-June-2025',
  // ];
   weekOptions:any=[];
  private commonStore = inject(CommonStore);
  allProjects$ = this.commonStore.allProjects$;
  allEmployees$ = this.commonStore.employeeList$
  allProjects: any = [];
  allEmployees: any = [];

  ngOnInit() {
    this.commonStore.getAllProjects();
    //this.commonStore.getWeeklyRange();
    this.summary.getDetails({ page: 0,size: 5 })
    this.allProjects$.subscribe((val: any) => {
      this.allProjects = val
      console.log('projects', this.allProjects);
    })
    this.allEmployees$.subscribe((val: any) => {
      this.allEmployees = val
      console.log('employees', this.allEmployees);
    })
    this.summary.weeklyRange$.subscribe((val:any)=>{
      console.log('weekrange',val);
      val.content.map((res:any)=>{

        console.log(res.weekRange)
        this.week = res.weekRange;
        this.weekOptions = [res.weekRange.weekFromDate+''+'To'+''+res.weekRange.weekToDate]
      })
    })
    this.loginStore.user$.pipe(
      tap(res => {
        console.log(res)
        this.userInfo = res;
      }, () => { })
    ).subscribe()

    // this.userInfo = JSON.parse(localStorage.getItem('userList') || '[]');
    console.log("userList", this.userInfo)
    //  this.summary.getDetails('');
    this.summary.projects$.subscribe((data: any) => {
      const d = data.find((ele: any) => ele.project_name === this.userInfo.projectName);
      this.projectInfo = d?.id;
      console.log("filter", d)
      console.log(data);
    })
  }



  employeeUpdateForm !: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }


  initializeForm(): void {
    this.employeeUpdateForm = this.fb.group({
      taskName: [''],
      taskStatus: [this.week?.['weekFromDate']],
      taskStartDate: [this.week?.['weekToDate']],
      taskEndDate: [''],
      projectName: [''],
      firstName: [''],
      weekRange:[''],
      weeklyUpdates: this.fb.array([this.createWeeklyUpdateGroup()])
    });

  }

  validateDates(): boolean {
    const startDate = this.employeeUpdateForm.get('startDate')?.value;
    const endDate = this.employeeUpdateForm.get('endDate')?.value;
    if (!startDate || !endDate) {
      this.dateError = null;
      return true;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      this.dateError = 'Start date cannot be greater than end date';
      return false;
    }
    this.dateError = null;
    return true;
  }

  createWeeklyUpdateGroup(): FormGroup {
    const group: FormGroup = this.fb.group({
      // upcomingTasks: ['', [Validators.required]],
      // status: ['', [Validators.required]],
      // summary: ['', [Validators.required]],
      // keyAccomplishments: ['', [Validators.required]],
      // weekRange: [this.weekOptions, Validators.required],  // default
      // comments: ['', Validators.required]  // ← Add this

    summary: ['', [Validators.required]],
    keyAccomplishments: ['', [Validators.required]],
    upcomingTasks: ['', [Validators.required]],
    comments: ['', [Validators.required]],

    });
    group.get('endDate')?.valueChanges.subscribe(() => {
      const startDate = group.get('startDate')?.value;
      const endDate = group.get('endDate')?.value;
      if (!startDate || !endDate) {
        this.dateError = null;
        return true;
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        this.dateError = 'Start date cannot be greater than end date';
        return false;
      }
      this.dateError = null;
      return true;
    });

    return group;
  }

  get weeklyUpdates(): FormArray {
    return this.employeeUpdateForm.get('weeklyUpdates') as FormArray;
  }

  addMore(): void {
    this.weeklyUpdates.push(this.createWeeklyUpdateGroup());
  }

  removeUpdate(index: number): void {
    this.weeklyUpdates.removeAt(index);
  }

  // onSubmit() {
    // console.log(this.employeeUpdateForm.value);

    // if (this.employeeUpdateForm.value) {
      // const d = {
      //   projectId: '',
      //   date: this.employeeUpdateForm.value.weeklyUpdates[0].startDate,
      //   task: this.employeeUpdateForm.value.weeklyUpdates[0].task
      // }
      // const employee = {
      //   employee_id: this.employeeUpdateForm.value.personId,
      //   project_id: this.employeeUpdateForm.value.projectId,
      //   employee_name: this.employeeUpdateForm.value.firstName,
      //   summary: this.employeeUpdateForm.value.summary,
      //   daily_updates: this.weeklyUpdates.value,
      //   taskName: this.employeeUpdateForm.value.taskName,
      //   taskStatus: this.employeeUpdateForm.value.taskStatus,
      //   projectName: this.employeeUpdateForm.value.projectName,
      //   techstack: this.userInfo.techstack
      // }
      // const employee =
      // {
      //   "weekId": 2,
      //   "projectId": 3,
      //   "personId": 3,
      //   "taskName": "Implement feature X",
      //   "taskStatus": "IN_PROGRESS",
      //   "summary": [
      //     "Completed initial setup",
      //     "Integrated API endpoints"
      //   ],
      //   "keyAccomplishment": [
      //     "Delivered module A",
      //     "Resolved critical bug in module B"
      //   ],
      //   "upcomingTasks": [
      //     "Write unit tests",
      //     "Prepare deployment scripts"
      //   ],
      //   "comments": [
      //     "Need clarification on requirement Y",
      //     "Waiting for review from QA team"
      //   ],
      //   "taskStartDate": "2025-06-30",
      //   "taskEndDate": "2025-07-04"
      // }


    //   const formValue = this.employeeUpdateForm.value;

   
    // const output = {
    //   weekId: 8, // assuming static or dynamic as needed
    //   projectId: formValue.projectName,
    //   personId: formValue.firstName,
    //   taskName: formValue.taskName,
    //   taskStatus: formValue.taskStatus,
    //   taskStartDate: '2025-06-30',
    //   taskEndDate: '2025-07-04',
    //   summary: [] as string[],
    //   keyAccomplishment: [] as string[],
    //   upcomingTasks: [] as string[],
    //   comments: [] as string[]
    // };

    // for (let update of formValue.weeklyUpdates) {
    //   switch (update.task) {
    //     case 'Pending':
    //       output.summary.push(update.comments);
    //       break;
    //     case 'Completed':
    //       output.keyAccomplishment.push(update.comments);
    //       break;
    //     case 'Progress':
    //       output.upcomingTasks.push(update.comments);
    //       break;
    //   }

      // Always push to comments regardless of task
    //   output.comments.push(update.comments);
    // }

    // 👉 Replace this with your actual POST API call
    // console.log('Final POST payload:', output);

    // Example:
    // this.http.post('your-api-url', output).subscribe(...)
  
      // this.summary.addEmployeeTask(output);
      // console.log('Form submitted:', this.employeeUpdateForm.value);
      // this.markFormGroupTouched(this.employeeUpdateForm);
    // }
  // }


  onSubmit() {
  const formValue = this.employeeUpdateForm.value;

  const output = {
    weekId: this.week?.weekId,
    projectId: formValue.projectName,
    personId: formValue.firstName,
    taskName: formValue.taskName,
    taskStatus: formValue.taskStatus,
    taskStartDate: this.week.weekFromDate,
    taskEndDate: this.week.weekToDate,
    summary: [] as string[],
    keyAccomplishment: [] as string[],
    upcomingTasks: [] as string[],
    comments: [] as string[]
  };

  formValue.weeklyUpdates.forEach((update: any) => {
    if (update.summary?.trim()) {
      output.summary.push(update.summary.trim());
    }

    if (update.keyAccomplishments?.trim()) {
      output.keyAccomplishment.push(update.keyAccomplishments.trim());
    }

    if (update.upcomingTasks?.trim()) {
      output.upcomingTasks.push(update.upcomingTasks.trim());
    }

    if (update.comments?.trim()) {
      output.comments.push(update.comments.trim());
    }
  });

  console.log('Final POST payload:', output);

  this.summary.addEmployeeTask(output);

  this.markFormGroupTouched(this.employeeUpdateForm);
  console.log('Form submitted:', this.employeeUpdateForm.value);
}

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  setOpen(isOpen: boolean) {
    this.employeeUpdateForm.reset()
    this.router.navigate(['/summary'])

  }

  isInvalid(controlName: string): boolean {
    const control = this.employeeUpdateForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  isValid(controlName: string): boolean {
    const control = this.employeeUpdateForm.get(controlName);
    return !!(control && control.valid && control.touched);
  }
}
