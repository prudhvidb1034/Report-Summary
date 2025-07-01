import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ToastService } from '../../shared/toast.service';
import { AccountStore } from '../../state/account.store';
import { TeamStore } from '../../state/team.store';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  providers: [AccountStore, TeamStore],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent {

  private readonly fb = inject(FormBuilder);
  private toast = inject(ToastService)
  teamForm!: FormGroup
  isModalOpen = false;
  private modalCtrl = inject(ModalController);
  teamStore = inject(TeamStore);
  teams$ = this.teamStore.team$; // ✅ auto updated from store
  accountStore = inject(AccountStore)
   accounts$ = this.accountStore.account$;

 isLoading$ = this.teamStore.select(state => state.loading);
   readonly accountStatusEffect = effect(() => {
      const status = this.teamStore.accountCreateStatus();
  
      if (status === 'success') {
        // this.accountStore.getAccounts();
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
    this.CreateForm();
    this.accountStore.getAccounts();
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
      this.teamStore.addTeam(response);
      // console.log('prushvi',response);
      // // this.setOpen(false);
      // // this.teamForm.reset();
      // this.toast.show('success', 'Project created successfully!')
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
