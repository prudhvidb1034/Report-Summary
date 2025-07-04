import { Component, effect, EventEmitter, inject, Input, Output, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RegisterStore } from '../../state/register.store';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { createProject } from '../../models/project.model';
import { ProjectStore } from '../../state/project.store';
import { ToastService } from '../../shared/toast.service';
import { SummaryService } from '../../services/summary/summary.service';
import { RegistrationForm } from '../../models/register.mode';
import { ValidationsService } from '../../services/validation/validations.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [RegisterStore, ProjectStore],
})
export class RegisterComponent {
  teamList = signal<createProject[]>([]);
  teamListData: createProject[] = []
  private projectStore = inject(ProjectStore);
  projectList$ = this.projectStore.team$;
  private readonly fb = inject(FormBuilder);
  @Input() editData: any;
  role: string | undefined;
  roles: string | undefined;
  isEditMode: boolean = false;
  // @Input() title: string = 'Manager';
  teamRegisterList = signal<RegistrationForm[]>([]);
  private getRegisterStore = inject(RegisterStore);
  teamRegisterList$ = this.getRegisterStore.register$;
  projectid: any;
  public validationService = inject(ValidationsService)
  private readonly store = inject(RegisterStore);
  projects: createProject[] = [];
  isModalOpen: boolean = false;
  private summary = inject(SummaryService);
  private toast = inject(ToastService)
  private router = inject(Router)
  registrationForm !: FormGroup;
  error$ = this.store.error$;
  loading$ = this.store.loading$;
  private modalCtrl = inject(ModalController);
  register$ = this.store.register$;
  isLoading$ = this.store.select(state => state.loading);
  private routering = inject(ActivatedRoute)
  constructor(private navParams: NavParams) { }

  readonly accountStatusEffect = effect(() => {
    const status = this.store.accountCreateStatus();

    if (status === 'success') {
      // this.accountStore.getAccounts();
      this.setOpen(false);
      this.toast.show('success', 'Account created successfully!');

    } else if (status === 'update') {
      this.setOpen(false);
      this.toast.show('success', 'Account updated successfully!');

    } else if (status === 'deleted') {
      this.toast.show('success', 'Account deleted successfully!');

    } else if (status === 'error') {
      this.toast.show('error', 'Something went wrong!');
    }
  });
  ngOnInit() {
    this.role = this.navParams?.get('role');
    this.roles = this.role?.toUpperCase();
    this.projectStore.getTeam();
    this.createForm();
    if (this.editData) {
      this.registrationForm?.patchValue(this.editData);
      console.log('TechStack in editData:', this.editData.techStack[0]);
      this.isEditMode = true;
    }
  }
  createForm() {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      employeeCode: ['', [Validators.required]],
      role: [{ value: this.roles, disabled: true }],
      // userEntry: ['new'],
      projectIds: ['', [Validators.required]],
      techStack: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }


  passwordMatchValidator(formGroup: AbstractControl): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }
  onModalDismiss() {
    this.isModalOpen = false;
    this.registrationForm.reset();
  }
  onCloseClick() {
    this.isModalOpen = false;
    this.registrationForm.reset();
  }


  onSubmit() {
    if (this.registrationForm.valid) {
      const formData = { ...this.registrationForm.getRawValue() };
      if (this.isEditMode && this.editData?.personId) {
        this.store.updateperson({ id: this.editData.personId, data: formData });
      } else {
        this.store.addregister(formData);
      }
      } else {
        this.registrationForm.markAllAsTouched();
      }
    }

   
    setOpen(isOpen: boolean) {
      this.modalCtrl.dismiss();

      this.registrationForm.reset()

    }

    openModal() {
      this.router.navigate(['view-all-projects']);
    }
    //   isInvalid(controlName: string): boolean {
    //   const control = this.registrationForm.get(controlName);
    //   return !!(control && control.invalid && control.touched);
    // }

    // isValid(controlName: string): boolean {
    //   const control = this.registrationForm.get(controlName);
    //   return !!(control && control.valid && control.touched);
    // }
  }

