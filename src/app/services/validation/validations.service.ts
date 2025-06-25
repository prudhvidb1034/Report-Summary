import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {

  constructor() { }

 isInvalid(controlName: string, form: FormGroup): boolean {
    const control: AbstractControl | null = form.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  isValid(controlName: string, form: FormGroup): boolean {
    const control: AbstractControl | null = form.get(controlName);
    return !!(control && control.valid && control.touched);
  }

  //create a common method for creating formGroup
}
