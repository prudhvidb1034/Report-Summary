import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ValidationsService } from '../../services/validation/validations.service';
import { CommonStore } from '../../state/common.store';
import { DependenciesStore } from '../../state/dependecies.store';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-create-dependencies-list',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  providers: [DependenciesStore],
  templateUrl: './create-dependencies-list.component.html',
  styleUrl: './create-dependencies-list.component.scss'
})
export class CreateDependenciesListComponent {

  dependenciesform !: FormGroup;
  @Input() editData: any;
  private modalCtrl = inject(ModalController);
  private fb = inject(FormBuilder);
  private commonStore = inject(CommonStore);
  private toast = inject(ToastService);
  isEditMode: boolean = false;
  private dependenciesStore = inject(DependenciesStore);
  allProjects$ = this.commonStore.allProjects$;

  public validationService = inject(ValidationsService);
  readonly accountStatusEffect = effect(() => {
    const status = this.dependenciesStore.accountCreateStatus();

    if (status === 'success') {
      this.setOpen(false);
      this.toast.show('success', 'dependency created successfully!');
    } else if (status === 'update') {
      this.setOpen(false);
      this.toast.show('success', 'dependency updated successfully!');
    } else if (status === 'deleted') {
      this.toast.show('success', 'dependency deleted successfully!');
    } else if (status === 'error') {
      this.toast.show('error', 'Something went wrong!');
    }


    if (status) {
      this.dependenciesStore['_dependencyCreateStatus'].set(null);
    }
  });
  ngOnInit() {
    this.createDependenciesForm();
    if (this.editData) {
      this.dependenciesform.patchValue(this.editData);
      this.isEditMode = true;
    }
  }
  createDependenciesForm() {
    this.dependenciesform = this.fb.group({
      projectId: [null, Validators.required],
      type: [null, Validators.required],
      description: [null, Validators.required],
      status_in: [null, Validators.required],
      owner: [null, Validators.required],
      impact: [null, Validators.required],
      actionTaken: [null, Validators.required],
      date: [null, Validators.required],
    });
  }


  setOpen(isOpen: boolean) {
    this.modalCtrl.dismiss()
    // this.weeklysprintUpdateForm.reset()


  }

  onSubmit() {



    const response = this.dependenciesform.value;
    if (this.dependenciesform.valid) {

      const formValue = this.dependenciesform.value;

      if (this.editData && this.editData?.id) {
        this.dependenciesStore.updateDependencies({ id: this.editData.id, data: formValue });
      } else {
        this.dependenciesStore.createDepencency(response);
      }
    } else {
      this.toast.show('error', 'Please fill in all required fields.')
      this.dependenciesform.markAllAsTouched()
    }
    // if (this.dependenciesform.valid) {
    //   this.piprogressStore.createPipgrogressReports(this.dependenciesform.value)
    // }
  }

}
