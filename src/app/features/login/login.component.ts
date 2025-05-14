import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginStore } from '../../state/login.store';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [LoginStore]
})
export class LoginComponent {
  loginForm: FormGroup;
  loginStore = inject(LoginStore);

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }


  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value)
      this.loginStore.login(this.loginForm.value);
      console.log(this.loginStore);
      
    }
    // else{
    //   alert('Please Register')
    // }
  }
  // get error$() {
  //   return this.loginStore.select((state) => state.error);
  // }

  signUp() {
  this.router.navigateByUrl('sign-up')
  }
}
