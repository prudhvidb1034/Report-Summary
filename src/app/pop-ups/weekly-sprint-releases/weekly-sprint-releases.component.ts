import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonStore } from '../../state/common.store';
import { ValidationsService } from '../../services/validation/validations.service';
import { SprintReleaseStore } from '../../state/Sprint-release.store';

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
  public validationService = inject(ValidationsService);

  private route = inject(ActivatedRoute);

  ngOnInit() {

    console.log('Week ID:', this.editData);
    this.commonStore.getAllProjects();
    this.createIncientForm();
  }
  createIncientForm() {
    this.weeklyIncidentForm = this.fb.group({
      weekId: [parseInt(this.editData)],
      projectId: [null, Validators.required],
      major: [null],
      minor: [null],
      incidentCreated: [null],
      releaseInformation: [null],

    });

  }



  createIncient() {
    if (this.weeklyIncidentForm.valid) {

      const formdata = this.weeklyIncidentForm.value;
      this.sprintReleaseStore.createIncident(formdata);
      this.setOpen(false);
      this.weeklyIncidentForm.reset();
    }
  }

  setOpen(isOpen: boolean) {
    this.modalCtrl.dismiss()
    this.weeklyIncidentForm.reset()


  }
}
