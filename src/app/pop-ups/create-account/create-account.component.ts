import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { SharedService } from '../../services/shared/shared.service';
import { AccountStore } from '../../state/account.store';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  providers: [AccountStore],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  private sharedservice = inject(SharedService)
  isModalOpen: boolean = false;
  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder)
  private toast = inject(ToastService);
  accountForm!: FormGroup;
  @Input() editData: any;
  isEditMode: boolean = false;
  constructor() { }

  accountStore = inject(AccountStore)
  accounts$ = this.accountStore.account$; 
  isLoading$ = this.accountStore.select(state => state.loading);
  readonly accountStatusEffect = effect(() => {
    const status = this.accountStore.accountCreateStatus();

    if (status === 'success') {
     this.accountStore.getAccounts({ page: 0, size: 5, sortBy: 'accountName' });
      this.setOpen(false);
      this.toast.show('success', 'Account created successfully!');

    } else if (status === 'update') {
      this.setOpen(false);
      this.toast.show('success', 'Account updated successfully!');

    } else if (status === 'deleted') {
      this.toast.show('success', 'Account deleted successfully!');

    } else if (status === 'error') {
      this.toast.show('error', 'Something went wrong!');
    }
  });


  ngOnInit() {
    this.creteForm();
    this.accountStore.getAccounts({ page: 0, size: 5, sortBy: 'accountName' });
    if (this.editData) {
      this.accountForm.patchValue(this.editData);
      this.isEditMode = true;
    }

  }



  creteForm() {
    this.accountForm = this.fb.group({
      accountName: ['', Validators.required],
      accountStartDate: ['', Validators.required],
      accountEndDate: ['', Validators.required]
    })
  }


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;

    if (!isOpen) {
      this.isEditMode = false; // Only reset on close
      this.accountForm.reset();
      this.modalCtrl.dismiss();
    }
  }


  SubmitForm() {
    if (this.accountForm.valid) {
      const formValue = this.accountForm.value;

      if (this.isEditMode && this.editData?.accountId) {
        this.accountStore.updateAccount({ id: this.editData.accountId, data: formValue });
      } else {
        this.accountStore.createAccount(formValue);
      }
    } else {
      this.accountForm.markAllAsTouched();
    }
  }


  isInvalid(controlName: string): boolean {
    const control = this.accountForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  isValid(controlName: string): boolean {
    const control = this.accountForm.get(controlName);
    return !!(control && control.valid && control.touched);
  }
}
