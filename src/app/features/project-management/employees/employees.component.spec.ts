import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpListComponent } from './employees.component';

describe('EmpListComponent', () => {
  let component: EmpListComponent;
  let fixture: ComponentFixture<EmpListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
