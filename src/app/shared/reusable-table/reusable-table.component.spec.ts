import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableTableComponent } from './reusable-table.component';
import { LoginStore } from '../../state/login.store';
import { SharedService } from '../../services/shared/shared.service';
import { of } from 'rxjs';

fdescribe('ReusableTableComponent', () => {
  let component: ReusableTableComponent;
  let fixture: ComponentFixture<ReusableTableComponent>;
  let loginStoreSpy: jasmine.SpyObj<LoginStore>;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;
  beforeEach(async () => {
    loginStoreSpy = jasmine.createSpyObj<LoginStore>('LoginStore', ['select'], {
      user$: of(null),
      loading$: of(false)

    });
    sharedServiceSpy = jasmine.createSpyObj<SharedService>('SharedService', ['getData', 'postData']);
    loginStoreSpy.select.and.returnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [ReusableTableComponent],
      providers: [
        { provide: LoginStore, useValue: loginStoreSpy },
        { provide: SharedService, useValue: sharedServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReusableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should emit search event on search term change', () => {
    spyOn(component.rowAction, 'emit');
    component.searchTerm = 'test';
    component.onSearchTermChange();
    expect(component.rowAction.emit).toHaveBeenCalledWith({ type: 'search', item: 'test' });
  });

  it('should emit action event', () => {
    spyOn(component.rowAction, 'emit');
    const actionType = 'edit';
    const item = { id: 1, name: 'Item 1' };
    component.action(actionType, item);
    expect(component.rowAction.emit).toHaveBeenCalledWith({ type: actionType, item: item });
  });
  it('should log createEnableFlag on init', () => {
    spyOn(console, 'log');
    component.createEnableFlag = true;
    component.ngOnInit();
    expect(console.log).toHaveBeenCalledWith("createEnableFlag", true);
  });
  it('should track by item id', () => {
    const item = { id: 1, name: 'Item 1' };
    const result = component.trackByFn(0, item);
    expect(result).toBe(1);
  });
  it('should return undefined for trackByFn if item is null', () => {
    const result = component.trackByFn(0, null);
    expect(result).toBeUndefined();
  });

  it('should emit pageSize event on page size change', () => {
    spyOn(component.rowAction, 'emit');
    const event = { pageSize: 10 };
    component.onPageSizeChange(event);
    expect(component.rowAction.emit).toHaveBeenCalledWith({ type: 'pageSize', item: event });
  });
  it('should emit toggle-status event on toggleEvent', () => {
    spyOn(component.rowAction, 'emit');
    const event = { detail: { checked: true } };
    const item = { id: 1, name: 'Item 1' };
    component.toggleEvent(event, item);
    expect(component.rowAction.emit).toHaveBeenCalledWith({ type: 'toggle-status', value: 'Active', item: item });
  });
  it('should emit nextPage event on page change', () => {
    spyOn(component.rowAction, 'emit');
    const event = { pageIndex: 1, pageSize: 10 };
    component.onPageChange(event);
    expect(component.rowAction.emit).toHaveBeenCalledWith({ type: 'nextPage', item: event });
  });
  it('should emit navigation event', () => {
    spyOn(component.rowAction, 'emit');
    const type = 'view';
    const item = { id: 1, name: 'Item 1' };
    const columnName = 'name';
    component.navigation(type, item, columnName);
    expect(component.rowAction.emit).toHaveBeenCalledWith({ type: type, item: item, columnName: columnName });
  });
});
