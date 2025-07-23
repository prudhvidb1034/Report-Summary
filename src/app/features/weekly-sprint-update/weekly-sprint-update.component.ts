import { CommonModule } from '@angular/common';
import { Component, effect, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, IonTabs, ModalController } from '@ionic/angular';
import { CommonStore } from '../../state/common.store';
import { ValidationsService } from '../../services/validation/validations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SprintStore } from '../../state/sprint.store';
import { ReusableTableComponent } from "../../shared/reusable-table/reusable-table.component";
import { of, map } from 'rxjs';
import { WeeklySprintCreationComponent } from '../../pop-ups/weekly-sprint-creation/weekly-sprint-creation.component';
import { WeeklySprintReleasesComponent } from '../../pop-ups/weekly-sprint-releases/weekly-sprint-releases.component';
import { ToastService } from '../../shared/toast.service';
import { SprintReleaseStore } from '../../state/Sprint-release.store';
import { ConfirmDeleteComponent } from '../../pop-ups/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-weekly-sprint-update',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule, ReusableTableComponent],
  providers: [SprintStore,SprintReleaseStore],
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
  sprintstore$ = this.sprintStore.weeklySprint$;
  private sprintReleaseStore = inject(SprintReleaseStore);
  sprintlistStore$ = this.sprintReleaseStore.select(state => state.Sprintrelease);
  weeklyReportById$: any;
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
  ngOnInit() {
    this.weekId = this.routering.snapshot.paramMap.get('id');
    // console.log('Week ID:', this.weekId);
    this.sprintStore.getWeeklyReportById(this.weekId);
   this.sprintReleaseStore.getReleaseByWeekId(this.weekId);
  }

  columnsWeekly = [
    { header: 'Week', field: 'weekSprintId' },
    { header: 'Assigned Points', field: 'assignedPoints' },
    { header: 'Assigned Stores', field: 'assignedStoriesCount' },
    { header: 'In Dev Stories', field: 'inDevStoriesCount' },
    { header: 'QA Stories', field: 'inQaStoriesCount' },
    { header: 'Dev Stories', field: 'inDevStoriesCount' },
    // { header: 'Comments', field: 'comments' },
    // { header: 'Injections', field: 'injections' },
    { header: 'Action', field: 'action', type: ['edit', 'delete'] }
  ];

  columnsReleases = [
    { header: 'Project', field: 'projectName' },
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



  

  setOpen(isOpen: boolean) {
    this.weeklysprintUpdateForm.reset()
  }

 


 handleRowAction(event: any) {
  switch (event.type) {
    case 'create':
      this.loadCreateModalByTab(this.weekId);
      break;
     case 'edit':
      this.loadCreateModalByTab(event);
      break;
     case 'delete':
      this.deleteModal(event);
     break; 

    default:
      console.log('Unknown action type:', event);
  }
}
loadCreateModalByTab(item:any) {
  let componentToLoad: any;
  let cssClass = '';

  if (this.selectedTab === 'active') {
    componentToLoad = WeeklySprintCreationComponent;
    cssClass = 'weekly-sprint-creation-modal';
  } else if (this.selectedTab === 'link') {
    componentToLoad = WeeklySprintReleasesComponent;
    cssClass = 'weekly-sprint-releases-modal';
  } else {
    console.warn('No modal defined for tab:', this.selectedTab);
    return;
  }

  this.modalController.create({
    component: componentToLoad,
    cssClass: cssClass, 
    componentProps: {
      editData: item
    }
  }).then(modal => {
    modal.present(); 
  });
}

  deleteModal(item: any) {
    this.modalController.create({
      component: ConfirmDeleteComponent,
      cssClass: 'custom-delete-modal',
      componentProps: {
        role: 'delete',
        data: {
          id: item.item.releaseId?item.item.releaseId:item.item.weekSprintId,
          name: item.item.projectName,

        }
      }
    }).then((modal) => {
      modal.present();
      modal.onDidDismiss().then((result) => {
        if (result?.data?.confirmed) {
          item.item.releaseId? this.sprintReleaseStore.deleteRelease(result.data.id):this.sprintStore.deleteWeeklySprintById(result.data.id);
        }
         
      });
    });
  }


}

