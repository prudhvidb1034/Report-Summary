import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginStore } from '../../state/login.store';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../shared/toast.service';
import { RouterLink } from '@angular/router';

interface LoginCredentials {
  username: string;
  password: string;
}


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule,  CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
   constructor(private fb: FormBuilder) {}
      loginStore = inject(LoginStore);

  // loginForm: FormGroup;
  // loginStore = inject(LoginStore);
  // private toast = inject(ToastService)
  // constructor(private fb: FormBuilder) {
  //   this.loginForm = this.fb.group({
  //     username: ['', [Validators.required, Validators.email]],
  //     password: ['', [Validators.required, Validators.minLength(6)]]
  //   });
  //   // this.loginForm.controls['username'].setValue(localStorage.getItem('username'));
  //   // this.loginForm.controls['password'].setValue(localStorage.getItem('password'))

  // }


  // onSubmit() {
  //   // localStorage.setItem('username',this.loginForm.value.username);
  //   // localStorage.setItem('password',this.loginForm.value.password);
  //   console.log(this.loginForm.value)
  //   if (this.loginForm.valid) {
  //     this.loginStore.login(this.loginForm.value);
  //   } else {
  //     this.toast.show('error', 'Please fill in all required fields.')
  //   }
  // }
showPwd = false;
form = this.fb.group({
  username: ['', [Validators.required, Validators.email]],
  password: ['', Validators.required]
});

togglePw() {
  this.showPwd = !this.showPwd;
}
submit() {
  if (this.form.valid) {
    console.log(this.form.value);
    const fv=this.form.value
      const creds: LoginCredentials = {
    username: fv.username?fv.username:'',
    password: fv.password?fv.password:''
  };
    this.loginStore.login(creds);
    // your API call here
  }
}

isInvalid(controlName: string): boolean {
  const control = this.form.get(controlName);
  return !!(control && control.invalid && control.touched);
}

isValid(controlName: string): boolean {
  const control = this.form.get(controlName);
  return !!(control && control.valid && control.touched);
}

googleSignIn() {
  // call Capacitor GoogleAuth or Firebase login
}
forgot() { /* nav to forgot */ }
signUp() { /* nav to sign-up */ }
}
