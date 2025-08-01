import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ValidationsService } from '../../services/validation/validations.service';
import { PiPgrogressStore } from '../../state/pi-progress.store';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-create-pi-progress',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  providers: [PiPgrogressStore],
  templateUrl: './create-pi-progress.component.html',
  styleUrl: './create-pi-progress.component.scss'
})
export class CreatePiProgressComponent {
  private toast = inject(ToastService)
  piProgressForm!: FormGroup;
  private modalCtrl = inject(ModalController);
  isEditMode = false;
  private fb = inject(FormBuilder);
  @Input() editData: any;
  private piprogressStore = inject(PiPgrogressStore);

  public validationService = inject(ValidationsService);

   isLoading$ = this.piprogressStore.select(state => state.loading);
    readonly accountStatusEffect = effect(() => {
      const status = this.piprogressStore.accountCreateStatus();
  
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
        this.piprogressStore['_accountCreateStatus'].set(null);
      }
    });
  ngOnInit() {
    this.creteForm();
  }

  creteForm() {
    this.piProgressForm = this.fb.group({
      team: ['', Validators.required],
      tcbLead: ['', Validators.required],
      assignedSP: ['', Validators.required],
      completedSP: ['', Validators.required],
      // Percentage: ['', Validators.required],


    })
  }
 

  setOpen(isOpen: boolean) {
    // this.isModalOpen = isOpen;

    // if (!isOpen) {
    //   this.isEditMode = false; // Only reset on close
    //   this.sprintresourceForm.reset();
    // }
    this.modalCtrl.dismiss(isOpen);

  }

  SubmitForm() {
    


      const response = this.piProgressForm.value;
    if (this.piProgressForm.valid) {

      const formValue = this.piProgressForm.value;

      if (this.editData && this.editData?.projectId) {
        this.piprogressStore.updatepiprogressReport({ id: this.editData.progressid, data: formValue });
      } else {
        this.piprogressStore.createPipgrogressReports(response);
      }
    } else {
      this.toast.show('error', 'Please fill in all required fields.')
      this.piProgressForm.markAllAsTouched()
    }
    // if (this.piProgressForm.valid) {
    //   this.piprogressStore.createPipgrogressReports(this.piProgressForm.value)
    // }
  }
}
