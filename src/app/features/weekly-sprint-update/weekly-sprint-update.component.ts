import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, IonTabs, ModalController } from '@ionic/angular';
import { CommonStore } from '../../state/common.store';
import { ValidationsService } from '../../services/validation/validations.service';
import { ActivatedRoute } from '@angular/router';
import { SprintStore } from '../../state/sprint.store';

@Component({
  selector: 'app-weekly-sprint-update',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
  providers:[SprintStore],
  templateUrl: './weekly-sprint-update.component.html',
  styleUrl: './weekly-sprint-update.component.scss'
})
export class WeeklySprintUpdateComponent {

  weeklysprintUpdateForm !: FormGroup;
  private fb = inject(FormBuilder);
  private commonStore=inject(CommonStore);
      private routering = inject(ActivatedRoute);
  private sprintStore=inject(SprintStore);
  allProjects$=this.commonStore.allProjects$;
    public validationService = inject(ValidationsService);

   selectedTab = 'active';
  weekId: any;

  switchTab(tab: string) {
    this.selectedTab = tab;
  }
  ngOnInit() {
    this.weekId = this.routering.snapshot.paramMap.get('id');
    this.weeklysprintUpdateForm = this.fb.group({
      weekId: this.weekId,
      projectIds: ['', Validators.required],
      assignedPoints: [null],
      assignedStoriesCount: [null],
      inDevPoints: [null],
      inDevStoriesCount: [null],
      inQaPoints: [null],
      inQaStoriesCount: [null],
      completePoints: [null],
      completeStoriesCount: [null],
      blockedPoints: [null],
      blockedStoriesCount: [null],
      completePercentage: [null],
      estimationHealth: [''],
      groomingHealth: [''],
      difficultCount1: [null],
      difficultCount2: [null],
      injection: [null],
      riskPoints:[null],
      riskStoryCounts:[null],
      comments:[null]
    });
  }




  setOpen(isOpen: boolean) {
    this.weeklysprintUpdateForm.reset()


  }
  onSubmit() {
    if(this.weeklysprintUpdateForm.valid){
      this.sprintStore.updateWeeklyUpdateSprint(this.weeklysprintUpdateForm.value);
    }
    console.log("Form Submitted", this.weeklysprintUpdateForm.value);
  }
}
