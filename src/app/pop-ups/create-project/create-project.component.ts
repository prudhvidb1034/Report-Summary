import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent {

  private readonly fb = inject(FormBuilder);
  private toast = inject(ToastService)
  teamForm!: FormGroup
  isModalOpen = false;
  private modalCtrl = inject(ModalController);


  ngOnInit() {
    this.CreateForm();
  }
  CreateForm() {
    this.teamForm = this.fb.group({
      projectname: ['', [Validators.required, Validators.minLength(3)]],
      projectlocation: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']

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
      this.setOpen(false);
      this.teamForm.reset();
      this.toast.show('success', 'Project created successfully!')
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
