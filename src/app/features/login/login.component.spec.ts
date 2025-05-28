import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastService } from '../../shared/toast.service';
import { provideHttpClient } from '@angular/common/http';

import { LoginComponent } from './login.component';
import { LoginStore } from '../../state/login.store';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
 // let mockLoginStore: MockLoginStore;

 //let mockLoginStore: jasmine.SpyObj<LoginStore>; // Type your mock
 let loginStore = jasmine.createSpyObj(LoginStore, ['login']);


  beforeEach(async () => {
    //mockLoginStore = jasmine.createSpyObj('LoginStore', ['login']); // Mock the login method

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers:[provideHttpClient(),{ provide: LoginStore, useValue: loginStore }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error toast when form is invalid', () => {
    const toasterService=new ToastService();
    component.loginForm.controls['username'].setValue('');
    component.loginForm.controls['password'].setValue('');
    fixture.detectChanges();
  
    component.onSubmit();
  
    expect(toasterService.show).toHaveBeenCalledWith('error','Please fill in all required fields')
  });

  // it('should call loginStore.login when form is valid', () => {
  //   // Arrange
  //   const credentials = { username: 'testuser', password: 'password123' };
  //   component.loginForm.setValue(credentials);
  //   fixture.detectChanges();
  //   spyOn(loginStore, 'login');
  
  //   // Act
  //   component.onSubmit();
  
  //   // Assert
  //   expect(loginStore.login).toHaveBeenCalledWith(credentials);
    
  // });
  
    

});

