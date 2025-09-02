import { Component, effect, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { ToastService } from '../../shared/toast.service';
import { ValidationsService } from '../../services/validation/validations.service';
import { CommonStore } from '../../state/common.store';
import { QuaterlyReportStore } from '../../state/quaterlyStanding.store';
import { QuaterlyReport } from '../../models/sprints.model';


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
  Quarter: number[] = [1, 2, 3, 4]
  @Input() editData!: QuaterlyReport |null;
  isEditMode: boolean = false;
  quaterlyReport = inject(QuaterlyReportStore);
  public validationService = inject(ValidationsService);
  allProjects$ = this.commonStore.allProjects$;
   isLoading$ = this.quaterlyReport.select(state => state.loading);
  page = 0;
  pageSize = 5;
 
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
    
       if (this.editData) {
      this.quaterlyStandingForm.patchValue(this.editData);
      this.quaterlyStandingForm.get('selectedSprint')?.setValue(this.editData.selectedSprints);
      this.isEditMode = true;

    }

  }



  creteForm() {
    this.quaterlyStandingForm = this.fb.group({
      projectId: ['', Validators.required],
      feature: ['', Validators.required],
      selectedSprint: ['', Validators.required],
      piNumber: ['', Validators.required],
      completionPercentage: ['', Validators.required],
      statusReport: ['', Validators.required],
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

      const formValue = this.quaterlyStandingForm.value;

      if (this.isEditMode && this.editData?.id) {
        this.quaterlyReportStore.updateQuaterlyReport({ id: this.editData.id, data: formValue });
      } else {
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
