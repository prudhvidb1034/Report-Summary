import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonStore } from '../../state/common.store';
import { ValidationsService } from '../../services/validation/validations.service';

@Component({
  selector: 'app-weekly-sprint-releases',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
  templateUrl: './weekly-sprint-releases.component.html',
  styleUrl: './weekly-sprint-releases.component.scss'
})
export class WeeklySprintReleasesComponent {

  weeklyIncidentForm!: FormGroup;
  private fb = inject(FormBuilder);
    private commonStore = inject(CommonStore);
     private modalCtrl = inject(ModalController);
    allProjects$ = this.commonStore.allProjects$;
   public validationService = inject(ValidationsService);
  weekId: any;
  private routering = inject(ActivatedRoute);
  ngOnInit() {
    this.weekId = this.routering.snapshot.paramMap.get('id');
    this.createIncientForm();
  }
  createIncientForm() {
    this.weeklyIncidentForm = this.fb.group({
      weekId: this.weekId,
      projectId: [null, Validators.required],
      major: [null],
      minor: [null],
      incidentCreated: [null],
      releaseInformation: [null],

    });

  }


  createIncient() {

  }

  setOpen(isOpen: boolean) {
    this.modalCtrl.dismiss()
    this.weeklyIncidentForm.reset()


  }
}
