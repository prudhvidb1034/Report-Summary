import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RegisterStore } from '../../state/register.store';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [IonicModule,CommonModule,ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  providers: [RegisterStore],
})
export class SignUpComponent {

 private readonly fb = inject(FormBuilder);
  private readonly store = inject(RegisterStore);

      registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      employeeId: ['', [Validators.required]],
      role: ['Manager', Validators.requiredTrue]
    }
  )
  


  // Observable state from the store
  isLoading$ = this.store.isLoading$;
  error$ = this.store.error$;
  isSuccess$ = this.store.isSuccess$;


  // ngOnInit() {}

  // Custom validator to check if passwords match
  // mustMatch(controlName: string, matchingControlName: string) {
  //   return (formGroup: FormGroup) => {
  //     const control = formGroup.controls[controlName];
  //     const matchingControl = formGroup.controls[matchingControlName];

  //     if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
  //       return;
  //     }

  //     if (control.value !== matchingControl.value) {
  //       matchingControl.setErrors({ mustMatch: true });
  //     } else {
  //       matchingControl.setErrors(null);
  //     }
  //   };
  // }

  // get formControls() {
  //   return this.registrationForm.controls;
  // }

  ngOnInit() {
    // Sync form with store
    this.store.form$.subscribe((form) => {
      this.registrationForm.patchValue(form, { emitEvent: false });
    });

    // Update store when form changes
    this.registrationForm.valueChanges.subscribe((formValue) => {
      // this.store.updateForm(formValue);
    });
  }

  onSubmit() {
       if (this.registrationForm.valid) {
      this.store.submitForm();
      console.log(this.store);
      
    }
  }
  
}
