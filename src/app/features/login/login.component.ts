import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginStore } from '../../state/login.store';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../shared/toast.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule,  CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  loginStore = inject(LoginStore);
  private toast = inject(ToastService)
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    // this.loginForm.controls['username'].setValue(localStorage.getItem('username'));
    // this.loginForm.controls['password'].setValue(localStorage.getItem('password'))

  }


  onSubmit() {
    // localStorage.setItem('username',this.loginForm.value.username);
    // localStorage.setItem('password',this.loginForm.value.password);
    console.log(this.loginForm.value)
    if (this.loginForm.valid) {
      this.loginStore.login(this.loginForm.value);
    } else {
      this.toast.show('error', 'Please fill in all required fields.')
    }
  }

}
