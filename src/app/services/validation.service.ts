import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {


//creating a common method for creating formGroup for the validation

constructor(private fb: FormBuilder) { }

// Common method to create a FormGroup with validation rules
createFormGroup(controlsConfig: { [key: string]: any }): FormGroup {
  const group: { [key: string]: any } = {};
  for (const key in controlsConfig) {
    if (controlsConfig.hasOwnProperty(key)) {
      const config = controlsConfig[key];
      group[key] = [
        config.value || '',
        config.validators || []
      ];
    }
  }
  return this.fb.group(group);
}
}