import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ToastService } from '../../shared/toast.service';
import { AccountStore } from '../../state/account.store';
import { ProjectStore, } from '../../state/project.store';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  providers: [AccountStore, ProjectStore],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent {
  @Input() editData: any;
  isEditMode: boolean = false;
  private readonly fb = inject(FormBuilder);
  private toast = inject(ToastService)
  teamForm!: FormGroup
  isModalOpen = false;
  private modalCtrl = inject(ModalController);
  projectStore = inject(ProjectStore);
  teams$ = this.projectStore.team$;
  accountStore = inject(AccountStore)
  accounts$ = this.accountStore.account$;

  isLoading$ = this.projectStore.select(state => state.loading);
  readonly accountStatusEffect = effect(() => {
    const status = this.projectStore.accountCreateStatus();

    if (status === 'success') {
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


    if (status) {
      this.projectStore['_accountCreateStatus'].set(null);
    }
  });

  ngOnInit() {
    this.CreateForm();
    this.accountStore.getAccounts();
    if (this.editData) {
      console.log('Edit Data:', this.editData);
      this.teamForm.patchValue(this.editData);
      this.isEditMode = true;
    }
  }
  CreateForm() {
    this.teamForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      accountId: ['', Validators.required],


    })


  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.modalCtrl.dismiss();
    this.teamForm.reset()
  }

  SubmitForm() {
    const response = this.teamForm.value;
    if (this.teamForm.valid) {

      const formValue = this.teamForm.value;

      if (this.editData && this.editData?.projectId) {
        this.accountStore.updateAccount({ id: this.editData.projectId, data: formValue });
      } else {
        this.projectStore.addTeam(response);
      }
    } else {
      this.toast.show('error', 'Please fill in all required fields.')
      this.teamForm.markAllAsTouched()
    }
  }
  isInvalid(controlName: string): boolean {
    const control = this.teamForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  isValid(controlName: string): boolean {
    const control = this.teamForm.get(controlName);
    return !!(control && control.valid && control.touched);
  }
}
