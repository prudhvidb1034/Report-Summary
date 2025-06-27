import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { SharedService } from '../../services/shared/shared.service';
import { urls } from '../../constants/string-constants';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  private sharedservice = inject(SharedService)
  isModalOpen: boolean = false;
  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder)
  accountForm!: FormGroup;

  ngOnInit() {
    this.creteForm();
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
    this.modalCtrl.dismiss();
    this.accountForm.reset()
  }

  SubmitForm() {

    const response = this.accountForm.value
    if (this.accountForm.valid) {
      this.sharedservice.postData(urls.CREATE_ACCOUNT, response).subscribe((data) => {
        console.log(data)
      })
      console.log(this.accountForm.value)
    } else {
      this.accountForm.markAllAsTouched()
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
