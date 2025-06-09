import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerEmpListComponent } from './manager-emp-list.component';

describe('ManagerEmpListComponent', () => {
  let component: ManagerEmpListComponent;
  let fixture: ComponentFixture<ManagerEmpListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerEmpListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManagerEmpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
