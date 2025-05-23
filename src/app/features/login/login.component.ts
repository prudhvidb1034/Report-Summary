import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginStore } from '../../state/login.store';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../shared/toast/toast.component';
import { ToastService } from '../../shared/toast.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [LoginStore]
})
export class LoginComponent {
  loginForm: FormGroup;
  loginStore = inject(LoginStore);
private toast = inject(ToastService)
  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
     username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value)
      this.loginStore.login(this.loginForm.value);
      console.log(this.loginStore);
          }else{
      this.toast.show('error','Please fill in all required fields.')
    }
  }
 
  }
