import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [IonicModule,CommonModule,ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  registrationForm: FormGroup;
  isSubmitted = false;

  constructor(private formBuilder: FormBuilder) {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      employeeId: ['', [Validators.required]],
      role: ['Manager', Validators.requiredTrue]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });
  }

  ngOnInit() {}

  // Custom validator to check if passwords match
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  get formControls() {
    return this.registrationForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    
    // if (this.registrationForm.invalid) {
    //   return;
    // }

    // Form is valid, proceed with registration
    console.log('Registration form submitted', this.registrationForm.value);
    // Here you would typically call your authentication service
    // this.register.register(this.registrationForm.value).subscribe((response:any)=>{
    //   console.log(response)
    // })
    
    // Reset form after submission
    this.registrationForm.reset();
    this.isSubmitted = false;
  }

}
