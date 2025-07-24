import { Component, inject, Input } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../shared/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-weekly-report',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,IonicModule],
  templateUrl: './create-weekly-report.component.html',
  styleUrl: './create-weekly-report.component.scss'
})
export class CreateWeeklyReportComponent {

 private sharedservice = inject(SharedService)
  isModalOpen: boolean = false;
  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder)
  private toast = inject(ToastService);
  weeklyreportForm!: FormGroup;
  @Input() editData: any;
  isEditMode: boolean = false;
  constructor() { }


  
//   sprintStore = inject(SprintStore)
//   accounts$ = this.sprintStore.sprint$; 
//  isLoading$ = this.sprintStore.select(state => state.loading);
  // readonly accountStatusEffect = effect(() => {
  //   const status = this.accountStore.accountCreateStatus();

  //   if (status === 'success') {
  //     // this.accountStore.getAccounts();
  //     this.setOpen(false);
  //     this.toast.show('success', 'Account created successfully!');

  //   } else if (status === 'update') {
  //     this.setOpen(false);
  //     this.toast.show('success', 'Account updated successfully!');

  //   } else if (status === 'deleted') {
  //     this.toast.show('success', 'Account deleted successfully!');

  //   } else if (status === 'error') {
  //     this.toast.show('error', 'Something went wrong!');
  //   }
  // });


  ngOnInit() {
    this.creteForm();
    // this.accountStore.getAccounts();
    // if (this.editData) {
    //   this.accountForm.patchValue(this.editData);
    //   this.isEditMode = true;
    // }

  }



  creteForm() {
    this.weeklyreportForm = this.fb.group({
      WeekName: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    })
  }


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;

    if (!isOpen) {
      this.isEditMode = false; // Only reset on close
      this.weeklyreportForm.reset();
      this.modalCtrl.dismiss();
    }
  }


  SubmitForm() {
    if (this.weeklyreportForm.valid) {
      const formValue = this.weeklyreportForm.value;

      // if (this.isEditMode && this.editData?.accountId) {
      //   this.accountStore.updateAccount({ id: this.editData.accountId, data: formValue });
      // } else {
        // this.sprintStore.createSprint(formValue);
      }
    // } else {
    //   this.accountForm.markAllAsTouched();
    // }
  }


  isInvalid(controlName: string): boolean {
    const control = this.weeklyreportForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  isValid(controlName: string): boolean {
    const control = this.weeklyreportForm.get(controlName);
    return !!(control && control.valid && control.touched);
  }
}

