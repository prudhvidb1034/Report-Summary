import { Component, effect, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RegisterStore } from '../../state/register.store';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { createProject } from '../../models/project.model';
import { ProjectStore } from '../../state/project.store';
import { ToastService } from '../../shared/toast.service';
import { SummaryService } from '../../services/summary/summary.service';
import { RegistrationForm } from '../../models/register.mode';
import { ValidationsService } from '../../services/validation/validations.service';
import { CommonStore } from '../../state/common.store';
import { QuaterlyReportStore } from '../../state/quaterlyStanding.store';


@Component({
  selector: 'app-create-quaterly-standing',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  providers: [QuaterlyReportStore, QuaterlyReportStore],
  templateUrl: './create-quaterly-standing.component.html',
  styleUrl: './create-quaterly-standing.component.scss'
})
export class CreateQuaterlyStandingComponent {


  isModalOpen: boolean = false;
  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder)
  private toast = inject(ToastService);
  private quaterlyReportStore = inject(QuaterlyReportStore);
  private commonStore = inject(CommonStore);
  quaterlyStandingForm!: FormGroup;
  Quarter:any = [1,2,3,4]
  PINumber: any;
  pi: any
  @Input() editData: any;
  isEditMode: boolean = false;
  quaterlyReport = inject(QuaterlyReportStore);
  public validationService = inject(ValidationsService);
  allProjects$ = this.commonStore.allProjects$;
  quaterlyReports$: any;
  isLoading$ = this.quaterlyReport.select(state => state.loading);
  page = 0;
  pageSize = 5;
  content: any = [];
  sprints = ['sprint0', 'sprint1', 'sprint2', 'sprint3', 'sprint4'];
  // sprintInfo: any = [
  //       { id: 1, sprint0: false },
  //       { id: 2, sprint1: false },
  //       { id: 3, sprint2: false },
  //       { id: 4, sprint3: false },
  //       { id: 5, sprint4: false },
  //     ];

    readonly accountStatusEffect = effect(() => {
      const status = this.quaterlyReportStore.accountCreateStatus();
  
      if (status === 'success') {
       this.quaterlyReportStore.getQuaterlyReports({ page: 0, size: 5 });
        this.setOpen(false);
        this.toast.show('success', 'Report created successfully!');
  
      } else if (status === 'update') {
        this.setOpen(false);
        this.toast.show('success', 'Report updated successfully!');
  
      } else if (status === 'deleted') {
        this.toast.show('success', 'Report deleted successfully!');
  
      } else if (status === 'error') {
        this.toast.show('error', 'Something went wrong!');
      }
    });
  constructor() { }

  ngOnInit() {
    this.creteForm();
    this.quaterlyReport.getQuaterlyReports({ page: this.page, size: this.pageSize });
    this.quaterlyReports$ = this.quaterlyReport.quaterlyReport$;
    this.quaterlyReport.quaterlyReport$.subscribe((val: any) => {
      this.content = val?.content;
      console.log(this.content);

      if (Array.isArray(this.content)) {
        this.content.map((res: any) => {
          this.PINumber = res?.piNumber;
          this.pi = this.PINumber
          console.log(this.PINumber);
        });
      } else {
        console.warn('content is not an array:', this.content);
      }
    });
    // this.accountStore.getAccounts({ page: 0, size: 5, sortBy: 'accountName' });
    console.log(this.editData);
    if (this.editData) {
      this.quaterlyStandingForm.patchValue(this.editData);
      console.log(this.quaterlyStandingForm.value);
      this.isEditMode = true;
      console.log(this.editData?.piNumber);

    }
    console.log(this.pi);

  }



  creteForm() {
    console.log(this.PINumber);

    this.quaterlyStandingForm = this.fb.group({
      projectId: ['', Validators.required],
      feature: ['', Validators.required],
      sprint0: ['', Validators.required],
      sprint1: ['', Validators.required],
      sprint2: ['', Validators.required],
      sprint3: ['', Validators.required],
      sprint4: ['', Validators.required],
      completionPercentage: ['', Validators.required],
      statusReport: ['', Validators.required],
      piNumber: ['']
    })
  }


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;

    if (!isOpen) {
      this.isEditMode = false; // Only reset on close
      this.quaterlyStandingForm.reset();
      this.modalCtrl.dismiss();
    }
  }


  SubmitForm() {
    if (this.quaterlyStandingForm.value) {
      const formValue = {
        ...this.quaterlyStandingForm.value,
        piNumber: this.PINumber
      };
      // const formValue = this.quaterlyStandingForm.value;

      if (this.isEditMode && this.editData?.id) {
        this.quaterlyReportStore.updateQuaterlyReport({ id: this.editData.id, data: formValue });
      } else {
        console.log(formValue);

        this.quaterlyReportStore.createQuaterlyReport(formValue);
      }
    } else {
      this.quaterlyStandingForm.markAllAsTouched();
    }
    
  }


  // this.quaterlyReportStore.createQuaterlyReport(formValue);




  isInvalid(controlName: string): boolean {
    const control = this.quaterlyStandingForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  isValid(controlName: string): boolean {
    const control = this.quaterlyStandingForm.get(controlName);
    return !!(control && control.valid && control.touched);
  }
}
