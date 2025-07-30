import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-resourses',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, ],
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


  constructor(private fb: FormBuilder, private modalCtrl: ModalController) { }


  ngOnInit() {
    this.resourceForm = this.fb.group({

      type: ['', Validators.required],
      name: ['', Validators.required],
      onsite:['', Validators.required],
      offsite:['', Validators.required],

    });
  }


onTypeChange(event: any) {
  const selectedType = event.detail.value;

  if (selectedType === 'techstack') {
    this.filteredNames = [
      { id: 1, name: 'Angular' },
      { id: 2, name: 'React' },
      { id: 3, name: 'Node.js' },
    ];
  } else if (selectedType === 'projects') {
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

SubmitForm(){

}


  setOpen(isOpen: boolean) {
    // this.isModalOpen = isOpen;

    // if (!isOpen) {
    //   this.isEditMode = false; // Only reset on close
    //   this.sprintresourceForm.reset();
    // }
    this.modalCtrl.dismiss(isOpen);

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
