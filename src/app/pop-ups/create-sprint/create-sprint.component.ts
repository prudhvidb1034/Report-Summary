import { Component, inject, Input } from '@angular/core';
import { SharedService } from '../../services/shared/shared.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../shared/toast.service';
import { CreateSprintStore } from '../../state/create-sprint.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-sprint',
  standalone: true,
  imports: [CommonModule,IonicModule,ReactiveFormsModule],
  providers: [CreateSprintStore],
  templateUrl: './create-sprint.component.html',
  styleUrl: './create-sprint.component.scss'
})
export class CreateSprintComponent {

  private sharedservice = inject(SharedService)
  isModalOpen: boolean = false;
  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder)
  private toast = inject(ToastService);
  sprintForm!: FormGroup;
  @Input() editData: any;
  isEditMode: boolean = false;
minEndDate: string | null = null;
maxEndDate: string | null = null;
minStartDate: string | null = null;
maxStartDate: string | null = null;
  constructor() { }

  sprintStore = inject(CreateSprintStore)
  accounts$ = this.sprintStore.sprint$; 
 isLoading$ = this.sprintStore.select(state => state.loading);
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
    this.sprintForm = this.fb.group({
      sprintName: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    })
  }


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;

    if (!isOpen) {
      this.isEditMode = false; // Only reset on close
      this.sprintForm.reset();
      this.modalCtrl.dismiss();
    }
  }


  SubmitForm() {
    if (this.sprintForm.valid) {
      const formValue = this.sprintForm.value;

      // if (this.isEditMode && this.editData?.accountId) {
      //   this.accountStore.updateAccount({ id: this.editData.accountId, data: formValue });
      // } else {
        this.sprintStore.createSprint(formValue);
      }
    // } else {
    //   this.accountForm.markAllAsTouched();
    // }
  }

 

onStartDateChange(e: any) {
  const start = new Date(e.detail.value);
  const exactly21 = new Date(start);
  exactly21.setDate(start.getDate() + 21);
  const iso = exactly21.toISOString().split('T')[0];
  this.minEndDate = iso;
  this.maxEndDate = iso;
  this.sprintForm.get('toDate')?.setValue(iso);
  this.minStartDate = null;
  this.maxStartDate = null;
}

onEndDateChange(e: any) {
  const end = new Date(e.detail.value);
  const exactly21Before = new Date(end);
  exactly21Before.setDate(end.getDate() - 21);
  const isoBefore = exactly21Before.toISOString().split('T')[0];
  this.minStartDate = isoBefore;
  this.maxStartDate = isoBefore;
  this.sprintForm.get('fromDate')?.setValue(isoBefore);
  this.minEndDate = null;
  this.maxEndDate = null;
}



  isInvalid(controlName: string): boolean {
    const control = this.sprintForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  isValid(controlName: string): boolean {
    const control = this.sprintForm.get(controlName);
    return !!(control && control.valid && control.touched);
  }
}
