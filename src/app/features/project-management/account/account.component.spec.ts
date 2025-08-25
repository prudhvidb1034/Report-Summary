import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountCreateComponent } from './account.component';
import { ModalController } from '@ionic/angular';
import { AccountStore } from '../../../state/account.store';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { CommonStore } from '../../../state/common.store';


describe('AccountCreateComponent', () => {
  let component: AccountCreateComponent;
  let fixture: ComponentFixture<AccountCreateComponent>;
  let mockAccountStore: jasmine.SpyObj<AccountStore>;
  let modalController: jasmine.SpyObj<ModalController>;
  let mockCommonStore: jasmine.SpyObj<CommonStore>;

  beforeEach(async () => {
    // account$: of([]), // mock observable
    // getAccounts: jasmine.createSpy('getAccounts'), // spy-able method
    // deleteAccount: jasmine.createSpy('deleteAccount'),
    mockAccountStore = jasmine.createSpyObj(
      'AccountStore',
      ['getAccounts', 'deleteAccount', 'select'], // <-- include select as spy
      { account$: of([]),
        loading$: of(false)
       } // properties only
    );

   

    mockCommonStore = jasmine.createSpyObj(
      'CommonStore',
      ['getSearch', 'select'], // <-- make select spy too
      { list$: of([]),
        isLoadingCommon$: of(false)
      }
    );
    modalController = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);

    // mockAccountStore.select.and.returnValue(of(false));
    await TestBed.configureTestingModule({
      imports: [AccountCreateComponent],
      providers: [provideHttpClient(), provideRouter([]),
      { provide: AccountStore, useValue: mockAccountStore },
      { provide: ModalController, useValue: modalController },
      { provide: CommonStore, useValue: mockCommonStore }
      ]
    })
      .overrideComponent(AccountCreateComponent, {
        set: {
          providers: [
            { provide: AccountStore, useValue: mockAccountStore },
            { provide: ModalController, useValue: modalController },
            { provide: CommonStore, useValue: mockCommonStore }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(AccountCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
  

  it('should call getAccounts with default pagination on init', () => {
    expect(mockAccountStore.getAccounts).toHaveBeenCalledWith({
      page: component.page,
      size: component.pageSize,
      sortBy: 'accountName'
    });
  })

  
  
  it('should set loading to true when store emits true', async () => {
    mockCommonStore.select.and.returnValue(of(true)); // ✅ emit true

    fixture = TestBed.createComponent(AccountCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const value = await firstValueFrom(component.isLoadingCommon$);
    expect(value).toBeTrue();
  });

  it('should set loading to false when store emits false', async () => {
      mockCommonStore.select.and.returnValue(of(false)); // ✅ emit false

      fixture = TestBed.createComponent(AccountCreateComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const value = await firstValueFrom(component.isLoadingCommon$);
      expect(value).toBeFalse();
    });

  it('should set loading to true when store emits true', async () => {
    mockAccountStore.select.and.returnValue(of(true)); // ✅ now works

    fixture = TestBed.createComponent(AccountCreateComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const value = await firstValueFrom(component.isLoading$);
    expect(value).toBeTrue();
  });

  it('should set loading to false when store emits false', async () => {
    mockAccountStore.select.and.returnValue(of(false)); // ✅ emit false

    fixture = TestBed.createComponent(AccountCreateComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const value = await firstValueFrom(component.isLoading$);
    expect(value).toBeFalse();
  });


  //  it('should emit true from isLoadingCommon$ when commonStore.select emits true', async () => {
  //   mockCommonStore.select.and.returnValue(of(true));

  //   const value = await firstValueFrom(component.isLoadingCommon$);

  //   expect(value).toBeTrue();
  //   // expect(mockCommonStore.select).toHaveBeenCalledWith(jasmine.any(Function));
  // });

  // it('should emit false from isLoadingCommon$ when commonStore.select emits false', async () => {
  //   mockCommonStore.select.and.returnValue(of(false));

  //   const value = await firstValueFrom(component.isLoadingCommon$);

  //   expect(value).toBeFalse();
  // });


  it('should load accounts on init', () => {
    fixture.detectChanges();
    expect(component.accountList$).toBeDefined();
    // expect(component.isLoading$).toBeDefined();
  });
  it('should handle row actions correctly', async () => {
    const fakeModal: any = {
      present: jasmine.createSpy('present'),
      dismiss: jasmine.createSpy('dismiss'),
      onDidDismiss: jasmine.createSpy('onDidDismiss')
        .and.returnValue(Promise.resolve({ data: {} }))
    };

    modalController.create.and.returnValue(Promise.resolve(fakeModal));

    const event = {
      type: 'edit',
      item: {
        accountEndDate: "2025-12-31",
        accountId: 1,
        accountName: "TCB",
        accountStatus: true,
        accountStartDate: "2025-08-20",
        createdAt: "2025-08-20T13:29:48.447658",
        createdBy: "Sarath Tenneti",
        updatedAt: "2025-08-20T13:35:22.069318",
        updatedBy: "Sarath Tenneti"
      }
    };

    component.handleRowAction(event);

    expect(modalController.create).toHaveBeenCalledWith({
      component: jasmine.anything(),
      cssClass: 'create-account-modal',
      componentProps: {
        editData: event.item
      }
    });

  });

  // expect(fakeModal.present).toHaveBeenCalled();
  // expect(fakeModal.onDidDismiss).toHaveBeenCalled();
  it('should handle create action correctly', async () => {
    const fakeModal: any = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      dismiss: jasmine.createSpy('dismiss'),
      onDidDismiss: jasmine.createSpy('onDidDismiss')
        .and.returnValue(Promise.resolve({ data: {} }))
    };

    modalController.create.and.returnValue(Promise.resolve(fakeModal));

    const event = {
      type: 'create',
      item: {
        accountEndDate: "2025-12-31",
        accountId: 1,
        accountName: "TCB",
        accountStatus: true,
        accountStartDate: "2025-08-20",
        createdAt: "2025-08-20T13:29:48.447658",
        createdBy: "Sarath Tenneti",
        updatedAt: "2025-08-20T13:35:22.069318",
        updatedBy: "Sarath Tenneti"
      }
    };

    // 👇 await the async method
    await component.handleRowAction(event);

    expect(modalController.create).toHaveBeenCalledWith({
      component: jasmine.anything(),
      cssClass: 'create-account-modal',
      componentProps: {}
    });

    expect(fakeModal.present).toHaveBeenCalled();
    expect(fakeModal.onDidDismiss).toHaveBeenCalled();

    expect(mockAccountStore.getAccounts).toHaveBeenCalledWith({
      page: component.page,
      size: component.pageSize,
      sortBy: 'accountName'
    });
  });

  it('should handle delete action and refresh data when confirmed', async () => {
    const fakeModal: any = {
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(
        Promise.resolve({ data: { confirmed: true, id: '1' } })
      )
    };
    modalController.create.and.returnValue(Promise.resolve(fakeModal));

    const item = {
      accountId: '1',
      accountName: 'TCB'
    } as any;
    await component.handleRowAction({ type: 'delete', item });

    // 👇 force promises inside deleteModal to resolve
    await Promise.resolve();

    expect(mockAccountStore.deleteAccount).toHaveBeenCalledWith('1');
  });
  it('should handle pagination actions correctly', () => {
    // Test nextPage action
    const nextPageEvent: any = {
      type: 'nextPage',
      item: 2
    };

    component.handleRowAction(nextPageEvent);
    expect(component.page).toBe(2);
    expect(mockAccountStore.getAccounts).toHaveBeenCalledWith({
      page: 2,
      size: component.pageSize,
      sortBy: 'accountName',
      // url: Constants.ROLE_MANAGER
    });

    // Test pageSize action
    const pageSizeEvent: any = {
      type: 'pageSize',
      item: 20
    };

    component.handleRowAction(pageSizeEvent);
    expect(component.pageSize).toBe(20);
    expect(mockAccountStore.getAccounts).toHaveBeenCalledWith({
      page: component.page,
      size: 20,
      sortBy: 'accountName',
      // url: Constants.ROLE_MANAGER
    });
  });
it('should log unknown action type for unrecognized events', () => {
  spyOn(console, 'log');

  component.handleRowAction({ type: 'randomType', item: {} as any });

  expect(console.log).toHaveBeenCalledWith('Unknown action type:', 'randomType');
});

it('should handle search action and refresh data', () => {
  const item = { accountName: 'TCB' } as any;

  component.handleRowAction({ type: 'search', item });

  expect(mockCommonStore.getSearch).toHaveBeenCalledWith({
    type: 'Account',
    searchName: 'TCB',
    page: component.page,
    size: component.pageSize,
    sortBy: 'accountName'
  });

  // ✅ also verify it reassigns the observable
  expect(component.accountList$).toBe(mockCommonStore.list$);
});

});


