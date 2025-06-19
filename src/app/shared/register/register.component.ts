import { Component, EventEmitter, inject, Input, Output, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RegisterStore } from '../../state/register.store';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { createTeam } from '../../models/project.model';
import { TeamStore } from '../../state/team.store';
import { ToastService } from '../../shared/toast.service';
import { SummaryService } from '../../services/summary/summary.service';
import { RegistrationForm } from '../../models/register.mode';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [RegisterStore, TeamStore],
})
export class RegisterComponent {
  teamList = signal<createTeam[]>([]);
  teamListData: createTeam[] = []
  private teamStore = inject(TeamStore);
  teamList$ = this.teamStore.team$;
  private readonly fb = inject(FormBuilder);

  role: string;

  // @Input() title: string = 'Manager';
  teamRegisterList = signal<RegistrationForm[]>([]);
  private getRegisterStore = inject(RegisterStore);
  teamRegisterList$ = this.getRegisterStore.register$;
  projectid: any;

  private readonly store = inject(RegisterStore);
  projects: createTeam[] = [];
  private summary = inject(SummaryService);
  private toast = inject(ToastService)
  private router = inject(Router)
  registrationForm !: FormGroup;
  error$ = this.store.error$;
  loading$ = this.store.loading$;
  private modalCtrl = inject(ModalController);
  register$ = this.store.register$;
  private routering = inject(ActivatedRoute)
  isModalOpen: boolean = false;
  constructor(private navParams: NavParams) {
    this.role = this.navParams?.get('role');
    console.log('Received role:', this.navParams, this.role);
  }

  ngOnInit() {

    this.routering.paramMap.subscribe((params: ParamMap) => {
      this.projectid = params.get('id');

    });

    // if (this.title === 'Manager') {
    //   this.getRegisterStore.getRegisterData({ role: 'Manager' });
    // } else {
    //   this.getRegisterStore.getRegisterData({ projectId: this.projectid, role: this.title });
    // }

    this.teamStore.getTeam();
    this.createForm();
    console.log('prudhvi', this.teamList$)
    this.teamStore.team$.subscribe((data: any) => {
      this.teamListData = data
      console.log('Sarath', this.teamListData,)
    })
    console.log('varma', this.teamStore.team$)

    this.getProjects()
  }
  ngAfterViewInit() {
    this.projectid = this.routering.snapshot.paramMap.get('id')
  }
  createForm() {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      employeeId: ['', [Validators.required]],
       role: [{ value: this.role, disabled: true }],
      userEntry: ['new'],
      projectName: [''],
      techstack: ['']
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
      const teamid = this.projectid
      // if (teamid && this.title === 'Employee') {
      //   formData.teamId = teamid;
      // }


      console.log('Submitting:', formData);
      this.store.addregister(formData);
      this.toast.show('success', 'Registration completed successfully!');
      this.onCloseClick();
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




  getProjects() {
    this.summary.getProjectTitles().subscribe((val: any) => {

      this.projects = val.map((project: any) => project.projectname);

    })
  }
}

