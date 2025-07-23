import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ValidationsService } from '../../services/validation/validations.service';
import { CommonStore } from '../../state/common.store';
import { ModalController } from '@ionic/angular/standalone';
import { SprintStore } from '../../state/sprint.store';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-weekly-sprint-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,IonicModule],
  providers:[SprintStore],
  templateUrl: './weekly-sprint-creation.component.html',
  styleUrl: './weekly-sprint-creation.component.scss'
})
export class WeeklySprintCreationComponent {
    private routering = inject(ActivatedRoute);
weeklysprintUpdateForm !: FormGroup;
private fb = inject(FormBuilder);
@Input() editData: any;
  weekId: any;
  private commonStore = inject(CommonStore);
private modalCtrl = inject(ModalController)
  allProjects$ = this.commonStore.allProjects$;
  private sprintStore=inject(SprintStore);
public validationService = inject(ValidationsService);
   private toast = inject(ToastService);
  isEditMode: boolean=false;

ngOnInit() {
   this.weekId = this.editData
      this.createSprintForm();  
          if (this.editData) {
      this.weeklysprintUpdateForm.patchValue(this.editData);
      this.isEditMode = true;
    }

}

  readonly accountStatusEffect = effect(() => {
    const status = this.sprintStore.sprintCreateStatus();

    if (status === 'success') {
    // this.sprintStore.getWeeklyReportById(this.weekId.weeekRangeId);
      this.setOpen(false);
      this.toast.show('success', 'Weekly Sprint Updated Successfully!');

    } else if (status === 'update') {
      this.setOpen(false);
      console.log(this.weekId)
      this.sprintStore.getWeeklyReportById(this.weekId.weeekRangeId);

      this.toast.show('success', 'Weekly Sprint Updated successfully!');
      

    } else if (status === 'deleted') {
      this.toast.show('success', 'Account deleted successfully!');

    } else if (status === 'error') {
      this.toast.show('error', 'Something went wrong!');
    }
  });



   createSprintForm() {
      this.weeklysprintUpdateForm = this.fb.group({
        weeekRangeId: this.weekId,
        projectId: ['', Validators.required],
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
        riskPoints: [null],
        riskStoryCounts: [null],
        comments: [null],
        weeklySprintUpdateStatus: true
      });
    }

    onSubmit(){
      this.weeklysprintUpdateForm.addControl(
        'estimationHealthStatus',
        new FormControl(this.weeklysprintUpdateForm.get('estimationHealth')?.value)
      );
      this.weeklysprintUpdateForm.addControl(
        'groomingHealthStatus',
        new FormControl(this.weeklysprintUpdateForm.get('groomingHealth')?.value)
      );

       if (this.isEditMode) {
        this.sprintStore.updateWeeklySprintById({ id: this.editData.weekSprintId, data: this.weeklysprintUpdateForm.value });
      } else {
        this.sprintStore.createWeeklyUpdateSprint(this.weeklysprintUpdateForm.value)
      }
     
    }

      setOpen(isOpen: boolean) {
        this.modalCtrl.dismiss()
    this.weeklysprintUpdateForm.reset()


  }
}
 