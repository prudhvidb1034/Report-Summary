import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IonicModule, ModalController } from '@ionic/angular';
import { ResourcesStore } from '../../state/resources.store';

@Component({
  selector: 'app-create-resourses',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule,],
  providers:[ResourcesStore],
  templateUrl: './create-resourses.component.html',
  styleUrl: './create-resourses.component.scss'
})
export class CreateResoursesComponent {
  @Input() isEditMode = false;
  loading = false;
  resourceForm!: FormGroup;
  //  projectSearch = '';
  // employeeSearch = '';
  // projectId = [];
  // filteredProjects: any = [];
  // projectSelected: boolean = false;
  // personId = '';
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
}



  onTypeChange(event: any) {
    const selectedType = event.detail.value;

    if (selectedType === 'TECH_STACK') {
      this.filteredNames = [
        { id: 'TESTING', name: 'Angular' },
        { id: 'React', name: 'React' },
        { id: 3, name: 'Node.js' },
      ];
    } else if (selectedType === 'PROJECT') {
      this.filteredNames = [
        { id: 10, name: 'Project Alpha' },
        { id: 11, name: 'Project Beta' },
      ];
    }
  }

  // selectProject(name: any) {
  //   console.log(name)
  //   this.projectSearch = name.projectName;
  //   this.projectId = name.projectId;
  //   this.projectSelected = true;
  // }

  // clearProjectSearch() {
  //   this.projectSearch = '';
  //   this.projectSelected = false;
  //   this.filteredProjects = this.projectList;
  // }

  //   onProjectTyping() {
  //   this.projectSelected = false;
  //   const search = this.projectSearch.toLowerCase();
  //   this.filteredProjects = this.projectList.filter((project: any) =>
  //     project.projectName.toLowerCase().includes(search)
  //   );
  // }

  //   filterItems<T>(items: T[], search: string, key: keyof T, selected: boolean): T[] {
  //   console.log(items, search, key);
  //   if (!search || selected) return [];
  //   return items.filter(item =>
  //     item[key]?.toString().toLowerCase().includes(search.toLowerCase())
  //   );
  // }

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
