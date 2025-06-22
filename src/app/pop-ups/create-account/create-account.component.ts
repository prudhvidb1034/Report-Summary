import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {

  isModalOpen: boolean = false;
  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder)
  accountForm!: FormGroup;

  ngOnInit() {
    this.creteForm();
  }



  creteForm() {
    this.accountForm = this.fb.group({
      accountname: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    })
  }
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.modalCtrl.dismiss();
    this.accountForm.reset()
  }

  SubmitForm() {
    if (this.accountForm.valid) {
      console.log(this.accountForm.value)
    } else {
      this.accountForm.markAllAsTouched()
    }
  }
}
