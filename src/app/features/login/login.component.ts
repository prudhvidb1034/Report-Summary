  import { Component, inject } from '@angular/core';
  import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
  import { IonicModule } from '@ionic/angular';
  import { LoginStore } from '../../state/login.store';
  import { CommonModule } from '@angular/common';

  interface LoginCredentials {
    userName: string;
    password: string;
  }


  @Component({
    selector: 'app-login',
    standalone: true,
    imports: [IonicModule, ReactiveFormsModule, CommonModule],
    providers: [LoginStore],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
  })
  export class LoginComponent {
    constructor(private fb: FormBuilder) { }
    loginStore = inject(LoginStore);


    isLoading$ = this.loginStore.select(state => state.loading);

    showPwd = false;

   
    form = this.fb.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    ngOnInit() {

    }

    togglePw() {
      this.showPwd = !this.showPwd;
    }
  submit() {
  console.log('Submit called, form.valid =', this.form.valid, 'value =', this.form.value);
  if (this.form.valid) {
    const fv = this.form.value;
    const creds: LoginCredentials = {
      userName: fv.userName ? fv.userName : '',
      password: fv.password ? fv.password : ''
    };
    console.log('Calling loginStore.login with', creds);
    this.loginStore.login(creds);
  } else {
    this.form.markAllAsTouched();
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

  
  }
