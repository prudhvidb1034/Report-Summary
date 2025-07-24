import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonStore } from '../../state/common.store';
import { ValidationsService } from '../../services/validation/validations.service';
import { SprintReleaseStore } from '../../state/Sprint-release.store';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-weekly-sprint-releases',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
  providers: [SprintReleaseStore],
  templateUrl: './weekly-sprint-releases.component.html',
  styleUrl: './weekly-sprint-releases.component.scss'
})
export class WeeklySprintReleasesComponent {
  private sprintReleaseStore = inject(SprintReleaseStore);
  isLoading$ = this.sprintReleaseStore.select(state => state.loading);
  weeklyIncidentForm!: FormGroup;
  @Input() editData: any;
  private fb = inject(FormBuilder);
  private commonStore = inject(CommonStore);
  private modalCtrl = inject(ModalController);
  allProjects$ = this.commonStore.allProjects$;
  private toast = inject(ToastService);
  public validationService = inject(ValidationsService);

  private route = inject(ActivatedRoute);
  isEditMode = false;

  readonly accountStatusEffect = effect(() => {
    const status = this.sprintReleaseStore.sprintCreateStatus();

    if (status === 'success') {
      // this.accountStore.getAccounts();
      this.setOpen(false);
     
      this.toast.show('success', 'Sprint created successfully!');

    } else if (status === 'update') {
      this.setOpen(false);
      this.toast.show('success', 'Sprint updated successfully!');

    } else if (status === 'deleted') {
      this.toast.show('success', 'Sprint deleted successfully!');

    } else if (status === 'error') {
      this.toast.show('error', 'Something went wrong!');
    }
  });

  ngOnInit() {
    this.createIncientForm();

    console.log('Week ID:', this.editData.item);
    if (this.editData != null) {
      this.weeklyIncidentForm.patchValue(this.editData.item);
      this.isEditMode = true;
    }
    // this.commonStore.getAllProjects();
     this.sprintReleaseStore.getReleaseByWeekId(this.editData.item.releaseId);
  }

  createIncientForm() {
    this.weeklyIncidentForm = this.fb.group({
      weekId: [parseInt(this.editData)],
      projectId: [null, Validators.required],
      sprintId: 1,
      major: [null],
      minor: [null],
      incidentCreated: [null],
      releaseInformation: [null],

    });

  }



  createIncient() { 
    if (this.weeklyIncidentForm.valid) {
      const formdata = this.weeklyIncidentForm.value;
      if (this.editData && this.editData?.item?.releaseId) {
        this.sprintReleaseStore.updateRelase({ id: this.editData?.item?.releaseId, data: formdata })
      } else {
        this.sprintReleaseStore.createIncident(formdata);
        
      }
      console.log('Form Data:', formdata);
    }
  }

  setOpen(isOpen: boolean) {
    this.modalCtrl.dismiss()
    this.weeklyIncidentForm.reset()


  }
}
