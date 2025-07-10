import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastService } from '../../shared/toast.service';
import { provideHttpClient } from '@angular/common/http';

import { LoginComponent } from './login.component';
import { LoginStore } from '../../state/login.store';
import { provideRouter } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let loginStoreSpy:jasmine.SpyObj<LoginStore>


  beforeEach(async () => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    loginStoreSpy=jasmine.createSpyObj('LoginStore',['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers:[provideHttpClient(), provideRouter([]),
      { provide: ToastService, useValue: toastServiceSpy },
      { provide:LoginStore,useValue:loginStoreSpy}]
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
    userName: 'testuser@example.com',
    password: 'TestPassword123'
  };
  component.form.controls['userName'].setValue(credentials.userName);
  component.form.controls['password'].setValue(credentials.password);
  component.submit();
  expect(loginStoreSpy.login).toHaveBeenCalledWith(credentials);
});


it("should call method for togglePw",()=>{
  component.togglePw();
  expect(component.showPwd).toBe(!(component.showPwd));
})
  


  // it('should call when form is valid',()=>{
  //   component.loginForm.controls['username'].setValue('sarath@qentelli.com');
  //   component.loginForm.controls['password'].setValue('Sarath11@');
  //   console.log('Form value before login call:', component.loginForm.value);
  //   component.onSubmit();
  //   expect(loginStoreSpy.login).toHaveBeenCalledWith(component.loginForm.value);
  // })    

});

