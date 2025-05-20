import { Component, EventEmitter, inject, Input, Output, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RegisterStore } from '../../state/register.store';
import { SignUpService } from '../../services/sign-up/sign-up.service';
import { Router } from '@angular/router';
import { createTeam } from '../../models/project.model';
import { TeamStore } from '../../state/team.store';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  providers: [RegisterStore,TeamStore],
})
export class SignUpComponent {
  teamList = signal<createTeam[]>([]);
  private teamStore=inject(TeamStore);
  teamList$ = this.teamStore.team$;
  @Input() heading: string = 'Sign Up';
  @Input() includeProjectFields: boolean = false
   @Input() customMargin: string = 'auto';
   @Output() closeModal = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly store = inject(RegisterStore);
  private signup = inject(SignUpService)
  private router = inject(Router)
  registrationForm !: FormGroup;
  error$ = this.store.error$;
  loading$ = this.store.loading$;
  register$ = this.store.register$;

  constructor() {
   
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      employeeId: ['', [Validators.required]],
      role: ['Manager'],
      userEntry:['new']
    },{ validators: this.passwordMatchValidator }
    )
  }
ngOnInit(){
  this.registrationForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    employeeId: ['', [Validators.required]],
    role: ['Manager']
  },{ validators: this.passwordMatchValidator }
  )
  if(this.includeProjectFields){
    this.registrationForm.addControl('projectName', this.fb.control(''))
    this.registrationForm.get('role')?.setValue('Employee');
  }

  console.log('prudhvi',this.teamList$)
  this.teamStore.team$.subscribe((data:any)=>{
    console.log(data)
  })
  console.log('varma', this.teamStore.team$)
}

  passwordMatchValidator(formGroup: AbstractControl): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
  
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }
  

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log('Submitting:', this.registrationForm.value);
      this.store.addregister(this.registrationForm.value);
  
      if (this.includeProjectFields ) {
        this.onCloseClick();
      } else {
        this.router.navigateByUrl('login');
      }
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }
  
  onCloseClick(){
    this.closeModal.emit();
  }
}

