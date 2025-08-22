import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ResourcesStore } from '../../state/resources.store';
import { CommonStore } from '../../state/common.store';
import { map, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-create-resourses',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  providers: [ResourcesStore],
  templateUrl: './create-resourses.component.html',
  styleUrl: './create-resourses.component.scss'
})
export class CreateResoursesComponent {
  @Input() isEditMode = false;
  loading = false;
  resourceForm!: FormGroup;
  projectSearch = '';
  employeeSearch = '';
  projectId = [];
  filteredProjects: any = [];
  projectSelected: boolean = false;
  private commonStore = inject(CommonStore);
  private router = inject(ActivatedRoute)
  personId = '';
  filteredNames: any[] = [];
  types = [
    { id: 'TECHSTACK', name: 'Technologies' },
    { id: 'PROJECT', name: 'Projects' }
  ];
  technologies: any;
  projects: any[] = [];

  suggestions: string[] = [];
  @Input() editData: any;
  resourceStore = inject(ResourcesStore)
  private toast = inject(ToastService);
  list$: any = '';
  selectedType = '';
  sprintId: any;
  rawProjects: any[] = []
  technologies$ = this.commonStore.allTechnologies$;
  projects$ = this.commonStore.allProjects$

  isLoading$ = this.resourceStore.loading$;

  //   .pipe(
  //   map(projects => projects.map((p:any) => p.projectName))
  // );
  suggestions$: any;
  searchTerm = '';

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) { }

  readonly accountStatusEffect = effect(() => {
    const status = this.resourceStore.accountCreateStatus();

    if (status === 'success') {
      this.setOpen(false);
      this.toast.show('success', 'resource created successfully!');
    } else if (status === 'update') {
      this.setOpen(false);
      this.toast.show('success', 'resource updated successfully!');
    } else if (status === 'deleted') {
      this.toast.show('success', 'resource deleted successfully!');
    } else if (status === 'error') {
      this.toast.show('error', 'Something went wrong!');
    }


    if (status) {
      this.resourceStore['_resourcesCreateStatus'].set(null);
    }
  });


  ionSelectChange() {
    const selectedType = this.resourceForm.get('resourceType')?.value;
    console.log('Selected type:', this.selectedType);
    this.searchTerm = '';
    this.updateSuggestions();
  }

  ngOnInit() {

    this.sprintId = this.router.snapshot.paramMap.get('id')
    this.createForm();
    // this.commonStore.getAllProjects();
    // this.commonStore.getTechnologies()
    this.resourceForm.get('resourceType')!.valueChanges.subscribe(type => {
      const tech = this.resourceForm.get('techStack')!;
      const proj = this.resourceForm.get('projectId')!;

      if (type === 'TECHSTACK') {
        tech.setValidators([Validators.required]);
        proj.clearValidators();
        proj.reset();
      } else if (type === 'PROJECT') {
        proj.setValidators([Validators.required]);
        tech.clearValidators();
        tech.reset();
      } else {
        tech.clearValidators();
        proj.clearValidators();
        tech.reset();
        proj.reset();
      }

      tech.updateValueAndValidity();
      proj.updateValueAndValidity();
    });

    if (this.editData) {
      console.log(this.editData);
      this.resourceForm.patchValue(this.editData);
      this.isEditMode = true;
       console.log(this.resourceForm.value);
      this.selectedType = this.editData.resourceType?.toUpperCase();
      // this.searchTerm="FRONTEND"
      this.searchTerm = this.editData.name;
      this.resourceForm.patchValue(this.editData);
      this.resourceForm.patchValue({
        resourceType: this.editData.resourceType?.toUpperCase() || '', // convert to uppercase
        // techStack: this.editData.name || '',
        // name: this.editData.name || '',
        onsite: this.editData.onsite,
        offsite: this.editData.offsite,

      });
        if(this.resourceForm.get('resourceType')?.value === 'TECHSTACK') {
        this.resourceForm.get('techStack')?.setValue(this.editData.techStack?.toUpperCase() || '');
      }
      else if(this.resourceForm.get('resourceType')?.value === 'PROJECT') {
        this.resourceForm.get('techStack')?.setValue(this.editData.name || '');
      }
      console.log('res', this.resourceForm.value,this.editData);
    }


    this.technologies$.subscribe((val: any) => {
      this.technologies = val;
      console.log("techlk", val);
      // console.log(this.technologies);

    })
    // this.projects$.subscribe(val => {
    //   this.rawProjects = val;
    //   this.projects = val.map((p: any) => p.projectName);
    // });


  }


  createForm() {
    this.resourceForm = this.fb.group({
      resourceType: ['', Validators.required],
      sprintId: parseInt(this.sprintId),
      techStack: ['', Validators.required],
      projectId: ['', Validators.required],
      onsite: ['', Validators.required],
      offsite: ['', Validators.required],
      name: ['', Validators.required],
      // type: ['', Validators.required]
    });

  }


  updateSuggestions() {
    const selectedType = this.resourceForm.get('resourceType')?.value;
    console.log(selectedType);
    const term = (this.resourceForm.get('techStack')?.value || '').toLowerCase();
    console.log(this.selectedType, term);
    this.list$ = selectedType === 'TECHSTACK'
      ? this.technologies$
      : selectedType === 'PROJECT'
        ? this.projects$
        : of([]);
    console.log("seleted type", selectedType)
    this.list$.subscribe((data: any) => {
      console.log("list", data)
    })
    this.suggestions$ = this.list$.pipe(
      map((list: any[]) =>
        list
          .map(item => {
            console.log(selectedType, item);

            if (typeof item === 'string') {
              return { id: item, display: item }; // for technologies
            }
            if (selectedType === 'PROJECT') {
              return { id: item.projectId, display: item.projectName };
            }
            return { id: item.techId, display: item.techName };
          })
          .filter(obj => obj.display.toLowerCase().includes(term))
      )
    );
  }




  onInput(event: any) {
    console.log(event);

    this.searchTerm = event.detail.value;
    setTimeout(() => {

    }, 300)
    this.updateSuggestions();
  }

  choose(selected: { id: any; display: string }) {
    this.resourceForm.patchValue({
      techStack: selected.display,
      projectId: this.resourceForm.get('resourceType')?.value === 'PROJECT'
        ? selected.id
        : null
    });
    this.suggestions$ = of([]);
  }

  onSearchClicked() {
    console.log('Searching:', this.selectedType, this.searchTerm);
    // handle search logic here
  }


  

  SubmitForm() {
    //  console.log('edit', this.editData, this.resourceForm.valid, this.resourceForm.value);

    if (this.resourceForm.value) {
      const resourceType = this.resourceForm.get('resourceType')?.value;
      const name = this.resourceForm.get('techStack')?.value;
      const type = this.resourceForm.get('resourceType')?.value;

      const formValue: any = {
        resourceType: this.resourceForm.get('resourceType')?.value,
        onsite: this.resourceForm.get('onsite')?.value,
        offsite: this.resourceForm.get('offsite')?.value,
        sprintId: this.sprintId
      };

      // console.log(formValue);

      if (resourceType === 'PROJECT') {
        formValue.projectId = this.resourceForm.get('projectId')?.value;

      } else if (resourceType === 'TECHSTACK') {
        formValue.techStack = name;
        console.log(name, formValue.techStack,resourceType);
        
      }

      console.log('Final form value:', formValue);
      if (this.isEditMode && this.editData) {
        this.resourceStore.updateResource({ id: this.editData.resourceId, data: formValue });
      } else {
        // this.toast.show('error', 'Please fill in all required fields.')
        this.resourceStore.createResource(formValue);
      }
    } else {
      this.resourceForm.markAllAsTouched();
    }
  }



  setOpen(isOpen: boolean) {

    this.modalCtrl.dismiss(isOpen);

  }

  copyFromPreviousSprint() {
    this.modalCtrl.dismiss();
  }
  isInvalid(controlName: string): boolean {
    const control = this.resourceForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  isValid(controlName: string): boolean {
    const control = this.resourceForm.get(controlName);
    return !!(control && control.valid && control.touched);
  }
}
