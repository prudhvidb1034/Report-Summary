import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ValidationsService } from '../../services/validation/validations.service';

@Component({
  selector: 'app-create-pi-progress',
  standalone: true,
  imports: [IonicModule, CommonModule,ReactiveFormsModule],
  templateUrl: './create-pi-progress.component.html',
  styleUrl: './create-pi-progress.component.scss'
})
export class CreatePiProgressComponent {

  piProgressForm!: FormGroup;
  private modalCtrl = inject(ModalController);
  isEditMode = false;
  private fb = inject(FormBuilder);

  public validationService = inject(ValidationsService);
  ngOnInit() {
    this.creteForm();
  }

  creteForm() {
    this.piProgressForm = this.fb.group({
      team: ['',Validators.required],
      leadname: ['',Validators.required],
      Assignedp: ['',Validators.required],
      completedsp: ['',Validators.required],
      Percentage: ['',Validators.required],


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

  SubmitForm(){

  }
}
