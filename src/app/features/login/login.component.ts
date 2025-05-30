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
  imports: [IonicModule, ReactiveFormsModule, CommonModule, RouterLink],
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
  }


  onSubmit() {
    if (this.loginForm.valid) {
      this.loginStore.login(this.loginForm.value);
    } else {
      this.toast.show('error', 'Please fill in all required fields.')
    }
  }

}
