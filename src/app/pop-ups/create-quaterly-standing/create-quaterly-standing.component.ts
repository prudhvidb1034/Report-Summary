import { Component, inject, Input } from '@angular/core';
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
  providers:[QuaterlyReportStore],
  templateUrl: './create-quaterly-standing.component.html',
  styleUrl: './create-quaterly-standing.component.scss'
})
export class CreateQuaterlyStandingComponent {


   isModalOpen: boolean = false;
   private modalCtrl = inject(ModalController);
   private fb = inject(FormBuilder)
   private toast = inject(ToastService);
   private quaterlyReportStore = inject(QuaterlyReportStore)
   quaterlyStandingForm!: FormGroup;
   @Input() editData: any;
   isEditMode: boolean = false;
   constructor() { }

  ngOnInit() {
    this.creteForm();
    // this.accountStore.getAccounts({ page: 0, size: 5, sortBy: 'accountName' });
    console.log(this.editData);
    
    if (this.editData) {
      this.quaterlyStandingForm.patchValue(this.editData);
      this.isEditMode = true;
    }

  }



  creteForm() {
    this.quaterlyStandingForm = this.fb.group({
      team: ['', Validators.required],
      feature: ['', Validators.required],
      sprint0: ['', Validators.required],
      sprint1: ['', Validators.required],
      sprint2: ['', Validators.required],
      sprint3: ['', Validators.required],
      completion: ['', Validators.required],
      statusReport:['', Validators.required],
      id:['']
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
    if (this.quaterlyStandingForm.valid) {
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



   isInvalid(controlName: string): boolean {
    const control = this.quaterlyStandingForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  isValid(controlName: string): boolean {
    const control = this.quaterlyStandingForm.get(controlName);
    return !!(control && control.valid && control.touched);
  }
}
