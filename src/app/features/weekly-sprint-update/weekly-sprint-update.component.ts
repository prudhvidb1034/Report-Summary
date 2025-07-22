import { CommonModule } from '@angular/common';
import { Component, effect, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, IonTabs, ModalController } from '@ionic/angular';
import { CommonStore } from '../../state/common.store';
import { ValidationsService } from '../../services/validation/validations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SprintStore } from '../../state/sprint.store';
import { ReusableTableComponent } from "../../shared/reusable-table/reusable-table.component";
import { of } from 'rxjs';
import { WeeklySprintCreationComponent } from '../../pop-ups/weekly-sprint-creation/weekly-sprint-creation.component';
import { WeeklySprintReleasesComponent } from '../../pop-ups/weekly-sprint-releases/weekly-sprint-releases.component';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-weekly-sprint-update',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule, ReusableTableComponent],
  providers: [SprintStore],
  templateUrl: './weekly-sprint-update.component.html',
  styleUrl: './weekly-sprint-update.component.scss'
})
export class WeeklySprintUpdateComponent {
  label = 'Week Wise';
  weeklysprintUpdateForm !: FormGroup;
  weeklyIncidentForm!: FormGroup;
  private modalController = inject(ModalController);
  private fb = inject(FormBuilder);
  private commonStore = inject(CommonStore);
  private routering = inject(ActivatedRoute);
  private router=inject(Router);
  private sprintStore = inject(SprintStore);
  allProjects$ = this.commonStore.allProjects$;
  private toast = inject(ToastService);

  public validationService = inject(ValidationsService);
  isLoading$ = this.sprintStore.select(state => state.loading);
  readonly accountStatusEffect = effect(() => {
    const status = this.sprintStore.sprintCreateStatus();

    if (status === 'success') {
   //  this.sprintStore.getSprintDetails({ page: 0, size: 5 });
      this.setOpen(false);
      this.toast.show('success', 'Weekly Sprint Updated Successfully!');

    } else if (status === 'update') {
      this.setOpen(false);
      this.toast.show('success', 'Weekly Sprint Updated successfully!');

    } else if (status === 'deleted') {
      this.toast.show('success', 'Account deleted successfully!');

    } else if (status === 'error') {
      this.toast.show('error', 'Something went wrong!');
    }
  });

  weekId: any;

  selectedTab = 'active';
  name: any;
  

  constructor(){
          const nav = this.router.getCurrentNavigation();
         if(nav?.extras.state?.['name']){
          this.name=nav?.extras.state?.['name']
  }
}
  columnsWeekly = [
    { header: 'Week', field: 'week' },
    { header: 'Assigned Points', field: 'assignedPoint' },
    { header: 'Assigned Stores', field: 'assignedStores' },
    { header: 'In Dev Stories', field: 'inDevStories' },
    { header: 'QA Stories', field: 'qaStories' },
    { header: 'Prod Stories', field: 'prodStories' },
    { header: 'Comments', field: 'comments' },
    { header: 'Injections', field: 'injections' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];

  columnsReleases = [
    { header: 'Project', field: 'projectId' },
    { header: 'Major Version', field: 'major' },
    { header: 'Minor Version', field: 'minor' },
    { header: 'Incident Created', field: 'incidentCreated' },
    { header: 'Release Information', field: 'releaseInformation' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];

  columns = this.columnsWeekly;

  switchTab(tab: string): void {
    this.selectedTab = tab;
    if (tab === 'active') {
      this.label = 'Week Wise';
      this.columns = this.columnsWeekly;
    } else {
      this.label = 'Release';
      this.columns = this.columnsReleases;
    }

  }

  ngOnInit() {
    this.weekId = this.routering.snapshot.paramMap.get('id');
    console.log('Week ID:', this.weekId);

  }






  setOpen(isOpen: boolean) {
    this.weeklysprintUpdateForm.reset()


  }

  sprintweekList = {
    content: [
      {
        week: 'Sprint 1',
        assignedPoint: 35,
        assignedStores: 10,
        inDevStories: 6,
        qaStories: 5,
        prodStories: 4,
        comments: 'Initial sprint went smooth',
        injections: 1,
        status: 'Active'
      },
      {
        week: 'Sprint 2',
        assignedPoint: 42,
        assignedStores: 12,
        inDevStories: 9,
        qaStories: 7,
        prodStories: 6,
        comments: 'Minor delays in QA',
        injections: 2,
        status: 'Active'
      },
      {
        week: 'Sprint 3',
        assignedPoint: 30,
        assignedStores: 9,
        inDevStories: 7,
        qaStories: 4,
        prodStories: 3,
        comments: 'Less bandwidth due to leaves',
        injections: 0,
        status: 'InActive'
      }
    ],
    pageNumber: 0,
    pageSize: 10,
    totalElements: 3
  };


  sprintweekList$ = of(this.sprintweekList);


 handleRowAction(event: any) {
  switch (event.type) {
    case 'create':
      this.loadCreateModalByTab();
      break;

    default:
      console.log('Unknown action type:', event.type);
  }
}
loadCreateModalByTab() {
  let componentToLoad: any;

  if (this.selectedTab === 'active') {
    componentToLoad = WeeklySprintCreationComponent;
  } else if (this.selectedTab === 'link') {
    componentToLoad = WeeklySprintReleasesComponent;
  } else {
    console.warn('No modal defined for tab:', this.selectedTab);
    return;
  }

  this.modalController.create({
    component: componentToLoad,
    cssClass: 'create-account-modal',
    componentProps: {
       editData: this.weekId
    }
  }).then((modal) => {
    modal.present();
    modal.onDidDismiss().then((data) => {
      console.log('Modal dismissed with data:', data);
    });
  });
}

  // onSubmit() {
  //   if (this.weeklysprintUpdateForm.valid) {
  //     this.sprintStore.updateWeeklyUpdateSprint(this.weeklysprintUpdateForm.value);
  //   }
  //   console.log("Form Submitted", this.weeklysprintUpdateForm.value);
  // }


  // createIncient() {
  //   if (this.weeklyIncidentForm.valid) {
  //     this.sprintStore.createIncident(this.weeklyIncidentForm.value);
  //     this.setOpen(false);
  //     this.weeklyIncidentForm.reset();
  //   }


  // }
}
