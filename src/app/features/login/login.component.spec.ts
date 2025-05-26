import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastService } from '../../shared/toast.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers:[{ provide: ToastService, useValue: toastServiceSpy }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

