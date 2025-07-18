import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, IonTabs, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-weekly-sprint-update',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
  templateUrl: './weekly-sprint-update.component.html',
  styleUrl: './weekly-sprint-update.component.scss'
})
export class WeeklySprintUpdateComponent {

  weeklysprintUpdateForm !: FormGroup;
  private fb = inject(FormBuilder);

   selectedTab = 'active';

  switchTab(tab: string) {
    this.selectedTab = tab;
  }
  ngOnInit() {
    this.weeklysprintUpdateForm = this.fb.group({
      weekId: ['', Validators.required],
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
      comments:[null]
    });
  }




  setOpen(isOpen: boolean) {
    this.weeklysprintUpdateForm.reset()


  }
  onSubmit() {
    console.log("Form Submitted", this.weeklysprintUpdateForm.value);
  }
}
