import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ResourcesStore } from '../../state/resources.store';
import { CommonStore } from '../../state/common.store';
import { map, of } from 'rxjs';

@Component({
  selector: 'app-create-resourses',
  standalone: true,
  imports: [IonicModule, CommonModule,FormsModule, ReactiveFormsModule],
  providers:[ResourcesStore],
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
    private commonStore=inject(CommonStore);
  personId = '';
  filteredNames: any[] = [];
  types = [
    { id: 'technologies', name: 'Technologies' },
    { id: 'projects', name: 'Projects' }
  ];
  technologies = ['Angular', 'React', 'Vue', 'Ionic', 'Node.js'];
  projects = ['Apollo', 'Zeus', 'Hermes', 'Athena', 'Poseidon'];

  suggestions: string[] = [];
 @Input() editData: any;
   resourceStore = inject(ResourcesStore)
  list$: any;
  selectedType='';
   technologies$ = this.commonStore.allTechnologies$;
    projectNames$ = this.commonStore.allProjects$.pipe(
    map(projects => projects.map((p:any) => p.projectName))
  );
  suggestions$: any;
 
  constructor(private fb: FormBuilder, private modalCtrl: ModalController) { }

ngOnInit() {

  this.resourceForm = this.fb.group({
    resourceType: ['', Validators.required],
    techStack: ['', Validators.required],
    projectId: ['', Validators.required],
    onsite: ['', Validators.required],
    offsite: ['', Validators.required],
  });

  this.resourceForm.get('resourceType')!.valueChanges.subscribe(type => {
    const tech = this.resourceForm.get('techStack')!;
    const proj = this.resourceForm.get('projectId')!;

    if (type === 'TECH_STACK') {
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
      this.resourceForm.patchValue(this.editData.item);
      this.isEditMode = true;
    }
}

   ionSelectChange() {
    this.projectSearch = '';
    //this.selectedType=
    this.updateSuggestions();
  }

  
  updateSuggestions() {
     this.list$ = this.selectedType === 'TECH_STACK'
      ? this.technologies$
      : this.selectedType === 'PROJECT'
        ? this.projectNames$
        : of([]);
       const term = this.projectSearch.toLowerCase();
         this.suggestions$ = this.list$.pipe(
          map((list: any[]) =>
         list.filter(item =>
            item.toLowerCase().includes(this.projectSearch.toLowerCase())
        )
      )
    );
  }

  selectProject(name: any) {
    console.log(name)
    this.projectSearch = name.name;
    this.projectId = name.id;
    this.projectSelected = true;
  }

  clearProjectSearch() {
    this.projectSearch = '';
    this.projectSelected = false;
    this.filteredProjects = this.filteredNames;
  }

  // onProjectTyping() {
  //   this.projectSelected = false;
  //   const search = this.projectSearch.toLowerCase();
  //   this.filteredProjects = this.filteredNames.filter((project: any) =>
  //     project.name.toLowerCase().includes(search)
  //   );
  // }
    onProjectTyping(event: any) {
    this.projectSearch = event.detail.value;
    setTimeout(()=>{

    },300)
    this.updateSuggestions();
  }

  choose(s:any){
    this.projectSearch = s;
    this.suggestions$ = of([] as string[]);

  }

  filterItems<T>(items: T[], search: string, key: keyof T, selected: boolean): T[] {
    console.log(items, search, key);
    if (!search || selected) return [];
    return items.filter(item =>
      item[key]?.toString().toLowerCase().includes(search.toLowerCase())
    );
  }

  SubmitForm() {
    console.log(this.resourceForm.valid,this.resourceForm.value)
    if (this.resourceForm.valid) {
      const formValue = this.resourceForm.value;
      console.log(formValue);
      if (this.isEditMode && this.editData?.accountId) {
        this.resourceStore.updateDependencies({ id: this.editData.accountId, data: formValue });
      } else {
        this.resourceStore.createResource(formValue);
      }
    } else {
      this.resourceForm.markAllAsTouched();
    }
  }


  setOpen(isOpen: boolean) {
    // this.isModalOpen = isOpen;

    // if (!isOpen) {
    //   this.isEditMode = false; // Only reset on close
    //   this.sprintresourceForm.reset();
    // }
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
