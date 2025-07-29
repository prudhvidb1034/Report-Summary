import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ValidationsService } from '../../services/validation/validations.service';
import { CommonStore } from '../../state/common.store';

@Component({
  selector: 'app-create-dependencies-list',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './create-dependencies-list.component.html',
  styleUrl: './create-dependencies-list.component.scss'
})
export class CreateDependenciesListComponent {

  dependenciesform !: FormGroup
  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder);
  private commonStore = inject(CommonStore);
  
  allProjects$ = this.commonStore.allProjects$;

  public validationService = inject(ValidationsService);

ngOnInit() {
    this.createDependenciesForm();
  }
 createDependenciesForm() {
  this.dependenciesform = this.fb.group({   
    projectId: [null, Validators.required],
    dependencyName: [null, Validators.required],
    description: [null, Validators.required],
    status: [null, Validators.required],
    owner: [null, Validators.required],
    impact: [null, Validators.required],
    actionTaken: [null, Validators.required],
    dateStatus: [null, Validators.required],
  });
}


  setOpen(isOpen: boolean) {
    this.modalCtrl.dismiss()
    // this.weeklysprintUpdateForm.reset()


  }

  onSubmit() {

  }

}
