import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ValidationsService } from '../../services/validation/validations.service';
import { CommonStore } from '../../state/common.store';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-weekly-sprint-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,IonicModule],
  templateUrl: './weekly-sprint-creation.component.html',
  styleUrl: './weekly-sprint-creation.component.scss'
})
export class WeeklySprintCreationComponent {
    private routering = inject(ActivatedRoute);
weeklysprintUpdateForm !: FormGroup;
private fb = inject(FormBuilder);
  weekId: any;
  private commonStore = inject(CommonStore);
 private modalCtrl = inject(ModalController)
  allProjects$ = this.commonStore.allProjects$;
 public validationService = inject(ValidationsService);
ngOnInit() {
   this.weekId = this.routering.snapshot.paramMap.get('id');
      this.createSprintForm();  
}

   createSprintForm() {
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
        riskPoints: [null],
        riskStoryCounts: [null],
        comments: [null]
      });
    }

    onSubmit(){

    }
 
      setOpen(isOpen: boolean) {
        this.modalCtrl.dismiss()
    this.weeklysprintUpdateForm.reset()


  }
}
