import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWeeklyReportComponent } from './create-weekly-report.component';

describe('CreateWeeklyReportComponent', () => {
  let component: CreateWeeklyReportComponent;
  let fixture: ComponentFixture<CreateWeeklyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWeeklyReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateWeeklyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
