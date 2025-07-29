import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-resourses',
  standalone: true,
  imports: [IonicModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './create-resourses.component.html',
  styleUrl: './create-resourses.component.scss'
})
export class CreateResoursesComponent {
  @Input() isEditMode = false;
  loading = false;

  types = [
    { id: 'technologies', name: 'Technologies' },
    { id: 'projects', name: 'Projects' }
  ];
  technologies = ['Angular', 'React', 'Vue', 'Ionic', 'Node.js'];
  projects = ['Apollo', 'Zeus', 'Hermes', 'Athena', 'Poseidon'];

  suggestions: string[] = [];

  form = this.fb.group({
    type: ['', Validators.required],
    name: ['', Validators.required],
    onsite: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    offshore: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],

  });

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {}

  onTypeChange() {
    this.form.patchValue({ name: '' });
    this.suggestions = [];
  }

  onSearchInput() {
    const val = this.form.get('name')?.value?.toLowerCase() || '';
    const list = this.form.get('type')?.value === 'technologies'
      ? this.technologies
      : this.projects;
    this.suggestions = list.filter(i => i.toLowerCase().includes(val));
  }

  selectName(s: string) {
    this.form.patchValue({ name: s });
    this.suggestions = [];
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const data = this.form.value;
    console.log('Submit', data);
    // your save/update logic here
    await this.modalCtrl.dismiss(data);
  }

  
  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  isValid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.valid && control.touched);
  }
}
