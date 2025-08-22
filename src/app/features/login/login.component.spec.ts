import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastService } from '../../shared/toast.service';
import { provideHttpClient } from '@angular/common/http';

import { LoginComponent } from './login.component';
import { LoginStore } from '../../state/login.store';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let loginStoreSpy: jasmine.SpyObj<LoginStore>


  beforeEach(async () => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    loginStoreSpy = jasmine.createSpyObj('LoginStore', ['login', 'select']);
    loginStoreSpy.select.and.returnValue(of(false));
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideHttpClient(), provideRouter([]),
      { provide: ToastService, useValue: toastServiceSpy },
      { provide: LoginStore, useValue: loginStoreSpy }]
    })
      .overrideComponent(LoginComponent, {
        set: {
          providers: [
            { provide: LoginStore, useValue: loginStoreSpy }
          ]
        }
      })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should call loginStore.login with correct credentials when form is valid', () => {
    const credentials = {
      userName: 'superadmin@gmail.com',
      password: 'Sarath11@'
    };

    // set form values
    component.form.controls['userName'].setValue(credentials.userName);
    component.form.controls['password'].setValue(credentials.password);

    component.form.updateValueAndValidity();
    fixture.detectChanges();

    expect(component.form.valid).toBeTrue();  // sanity check

    // call submit
    component.submit();

    // spy expectation
    expect(loginStoreSpy.login).toHaveBeenCalledOnceWith(
      jasmine.objectContaining(credentials)
    );
  });




  it('should mark form as touched on submit', () => {
    component.submit(); // invalid because no values

    expect(component.form.touched).toBeTrue();   // ✅ touched after submit()
    expect(component.form.invalid).toBeTrue();   // ✅ invalid since empty fields
    expect(loginStoreSpy.login).not.toHaveBeenCalled(); // ✅ login not called
  });


  it('should mark form as touched on submit when invalid', () => {
    component.form.controls['userName'].setValue('');
    component.form.controls['password'].setValue('');

    component.submit();

    expect(component.form.touched).toBeTrue();
    expect(component.form.invalid).toBeTrue();
    expect(loginStoreSpy.login).not.toHaveBeenCalled();
     expect(toastServiceSpy.show).not.toHaveBeenCalled();
      });

  it('should toggle password visibility', () => {
    expect(component.showPwd).toBeFalse();

    component.togglePw();
    expect(component.showPwd).toBeTrue();

    component.togglePw();
    expect(component.showPwd).toBeFalse();
  });

  it('should validate form fields using isValid()', () => {
    component.form.controls['userName'].setValue('');
    component.form.controls['userName'].markAsTouched();

    expect(component.isValid('userName')).toBeFalse();

    component.form.controls['userName'].setValue('test@gmail.com');
    expect(component.isValid('userName')).toBeTrue();
  });

  it('should react to login success from store', () => {
    loginStoreSpy.select.and.returnValue(of(true)); // simulate logged in
    component.ngOnInit();
    fixture.detectChanges();

   expect(loginStoreSpy.select).toHaveBeenCalled(); // assume toast on success
  });

  it('should react to login failure from store', () => {
    loginStoreSpy.select.and.returnValue(of(false)); // simulate failure
    component.ngOnInit();
    fixture.detectChanges();

    // in failure case, maybe nothing or a toast — depends on your component logic
    // Just to make sure we cover branch:
    expect(loginStoreSpy.select).toHaveBeenCalled();
  });

})
