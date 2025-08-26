import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagersComponent } from './managers.component';
import { RegisterStore } from '../../state/register.store';
import { firstValueFrom, of } from 'rxjs';
import { ModalController } from '@ionic/angular/standalone';
import { Constants } from '../../constants/string-constants';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ManagersComponent', () => {
  let component: ManagersComponent;
  let fixture: ComponentFixture<ManagersComponent>;
  let registerStoreSpy: jasmine.SpyObj<RegisterStore>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    registerStoreSpy = jasmine.createSpyObj<RegisterStore>('RegisterStore', ['select', 'getRegisterData','deleteProject'], {
      register$: of([]),
      loading$: of(false)
    });
   

    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);

    registerStoreSpy.select.and.returnValue(of(false));
    await TestBed.configureTestingModule({
      imports: [ManagersComponent,
      ],
      providers: [provideHttpClient(), provideRouter([]),

      { provide: RegisterStore, useValue: registerStoreSpy },
      { provide: ModalController, useValue: modalControllerSpy }
      ]
    })

      // .overrideComponent(ManagersComponent, {
      //   set: {
      //     providers: [
      //       { provide: RegisterStore, useValue: registerStoreSpy },
      //       { provide: ModalController, useValue: modalControllerSpy }
      //     ]
      //   }
      // })
      .compileComponents();

    fixture = TestBed.createComponent(ManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getRegisterData with default pagination on init', () => {
    expect(registerStoreSpy.getRegisterData).toHaveBeenCalledWith({
      page: component.page,
      size: component.pageSize,
      sortBy: 'firstName',
      url: Constants.ROLE_MANAGER
    });
  });

  it('should set loading to true when store emits true', async () => {
    registerStoreSpy.select.and.returnValue(of(true)); // ✅ emit true

    fixture = TestBed.createComponent(ManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const value = await firstValueFrom(component.isLoading$);
    expect(value).toBeTrue();
  });

  it('should set loading to false when store emits false', async () => {
    registerStoreSpy.select.and.returnValue(of(false)); // ✅ emit false

    fixture = TestBed.createComponent(ManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const value = await firstValueFrom(component.isLoading$);
    expect(value).toBeFalse();
  });

  it('should load managers on init', () => {
    fixture.detectChanges();
    expect(component.managerList$).toBeDefined();
    expect(component.isLoading$).toBeDefined();
  });


  it('should handle row actions correctly', async () => {
    const fakeModal: any = {
      present: jasmine.createSpy('present'),
      dismiss: jasmine.createSpy('dismiss'),
      onDidDismiss: jasmine.createSpy('onDidDismiss')
        .and.returnValue(Promise.resolve({ data: {} }))
    };

    modalControllerSpy.create.and.returnValue(Promise.resolve(fakeModal));

    const event = {
      type: 'edit',
      item: {
        personId: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'prudhviv.java@gmail.com',
        projectNames: ['Project A'],
        confirmPassword: 'password123',
        username: 'johndoe',
        employeeId: 'EMP001',
        password: 'password123',
        phoneNumber: '1234567890',
        role: 'manager'
      }
    };

    await component.handleRowAction(event);

    expect(modalControllerSpy.create).toHaveBeenCalledWith({
      component: jasmine.anything(),
      componentProps: {
        role: 'manager',
        editData: event.item
      }

    });

    expect(fakeModal.present).toHaveBeenCalled();
    expect(fakeModal.onDidDismiss).toHaveBeenCalled();
  });
  it('should handle create action correctly', async () => {
    const fakeModal: any = {
      present: jasmine.createSpy('present'),
      dismiss: jasmine.createSpy('dismiss'),
      onDidDismiss: jasmine.createSpy('onDidDismiss')
        .and.returnValue(Promise.resolve({ data: {} }))
    };

    modalControllerSpy.create.and.returnValue(Promise.resolve(fakeModal));

    const event = {
      type: 'create',


      item: {
        personId: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'prudhviv.java@gmail.com',
        projectNames: ['Project A'],
        confirmPassword: 'password123',
        username: 'johndoe',
        employeeId: 'EMP001',
        password: 'password123',
        phoneNumber: '1234567890',
        role: 'manager'
      }
    };

    await component.handleRowAction(event);

    expect(modalControllerSpy.create).toHaveBeenCalledWith({
      component: jasmine.anything(),
      componentProps: { role: 'manager' }
    });

    expect(fakeModal.present).toHaveBeenCalled();
    expect(fakeModal.onDidDismiss).toHaveBeenCalled();

    expect(registerStoreSpy.getRegisterData).toHaveBeenCalledWith({
      page: component.page,
      size: component.pageSize,
      sortBy: 'firstName',
      url: Constants.ROLE_MANAGER
    });

  })
  // it('should handle delete action correctly', async () => {
  //   const fakeModal: any = {
  //     present: jasmine.createSpy('present'),
  //     dismiss: jasmine.createSpy('dismiss'),
  //     onDidDismiss: jasmine.createSpy('onDidDismiss')
  //       .and.returnValue(Promise.resolve({ data: {} }))
  //   };

  //   modalControllerSpy.create.and.returnValue(Promise.resolve(fakeModal));

  //   const event = {
  //     type: 'delete',
  //     item: {
  //       personId: '1',
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       email: 'prudhviv.java@gmail.com',
  //       projectNames: ['Project A'],
  //       confirmPassword: 'password123',
  //       username: 'johndoe',
  //       employeeId: 'EMP001',
  //       password: 'password123',
  //       phoneNumber: '1234567890',
  //       role: 'manager'
  //     }
  //   };
  //   await component.handleRowAction(event);
  //   expect(modalControllerSpy.create).toHaveBeenCalledWith({
  //     component: jasmine.anything(),
  //     cssClass: 'custom-delete-modal',
  //     componentProps: {
  //       role: 'delete',
  //       data: {
  //         id: event.item.personId,
  //         name: event.item.firstName,

  //       }
  //     }
  //   });
  // })


it('should handle delete action and refresh data when confirmed', async () => {
  const fakeModal: any = {
    present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
    onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(
      Promise.resolve({ data: { confirmed: true, id: '1' } })
    )
  };
  modalControllerSpy.create.and.returnValue(Promise.resolve(fakeModal));

  const item = { personId: '1', firstName: 'John' } as any;
  await component.handleRowAction({ type: 'delete', item });

  // 👇 force promises inside deleteModal to resolve
  await Promise.resolve();

  expect(registerStoreSpy.deleteProject).toHaveBeenCalledWith('1');
});




  // it('should handle pagination actions correctly', () => {
  //   // Test nextPage action
  //   const nextPageEvent: any = {
  //     type: 'nextPage',
  //     item: 2
  //   };

  //   component.handleRowAction(nextPageEvent);
  //   expect(component.page).toBe(2);
  //   expect(registerStoreSpy.getRegisterData).toHaveBeenCalledWith({
  //     page: 2,
  //     size: component.pageSize,
  //     sortBy: 'firstName',
  //     url: Constants.ROLE_MANAGER
  //   });

  //   // Test pageSize action
  //   const pageSizeEvent: any = {
  //     type: 'pageSize',
  //     item: 20
  //   };

  //   component.handleRowAction(pageSizeEvent);
  //   expect(component.pageSize).toBe(20);
  //   expect(registerStoreSpy.getRegisterData).toHaveBeenCalledWith({
  //     page: component.page,
  //     size: 20,
  //     sortBy: 'firstName',
  //     url: Constants.ROLE_MANAGER
  //   });
  // });
it('should log unknown action type for unrecognized events', () => {
  spyOn(console, 'log');

  component.handleRowAction({ type: 'randomType', item: {} as any });

  expect(console.log).toHaveBeenCalledWith('Unknown action type:');
});


});
