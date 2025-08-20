import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginStore } from './login.store';
import { SharedService } from '../services/shared/shared.service';
import { ToastService } from '../shared/toast.service';
import { CommonStore } from './common.store';
import { urls } from '../constants/string-constants';

describe('LoginStore', () => {
  let store: LoginStore;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;
  let toastSpy: jasmine.SpyObj<ToastService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let commonStoreSpy: jasmine.SpyObj<CommonStore>;

  beforeEach(() => {
    sharedServiceSpy = jasmine.createSpyObj('SharedService', ['postData']);
    toastSpy = jasmine.createSpyObj('ToastService', ['show']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    commonStoreSpy = jasmine.createSpyObj('CommonStore', ['getAllProjects']);

    TestBed.configureTestingModule({
      providers: [
        LoginStore,
        { provide: SharedService, useValue: sharedServiceSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: Router, useValue: routerSpy },
        { provide: CommonStore, useValue: commonStoreSpy }
      ]
    });

    store = TestBed.inject(LoginStore);
    localStorage.clear();
  });

  it('should create the store with initial state', (done) => {
    store.user$.subscribe(user => {
      expect(user).toBeNull();
      done();
    });
  });

  it('should login successfully and update state', (done) => {
    const mockUser:any = {
      data: { id: 1, name: 'Prudhvi', acessToken: 'abc123' }
    };

    sharedServiceSpy.postData.and.returnValue(of(mockUser));

    store.login({ userName: 'test', password: '1234' });

    setTimeout(() => {
      expect(sharedServiceSpy.postData)
        .toHaveBeenCalledWith(urls.LOGIN_DETAILS, { username: 'test', password: '1234' });

      expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser.data));
      expect(localStorage.getItem('token')).toBe('abc123');

      expect(commonStoreSpy.getAllProjects).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
      expect(toastSpy.show).toHaveBeenCalledWith('success', 'Login successfully!');

      store.user$.subscribe(user => {
        expect(user).toEqual(mockUser);
        done();
      });
    }, 0);
  });

  it('should handle login failure and set error state', (done) => {
    sharedServiceSpy.postData.and.returnValue(throwError(() => new Error('Invalid login')));

    store.login({ userName: 'wrong', password: 'wrong' });

    setTimeout(() => {
      expect(sharedServiceSpy.postData).toHaveBeenCalled();
      expect(toastSpy.show).toHaveBeenCalledWith('error', 'Login failed. Please try again.');

      store.loading$.subscribe(loading => {
        expect(loading).toBeFalse();
      });

      done();
    }, 0);
  });

  it('should clear state when clearAll is called', (done) => {
    store.clearAll();

    store.user$.subscribe(user => {
      expect(user).toBeNull();
      done();
    });
  });
});
