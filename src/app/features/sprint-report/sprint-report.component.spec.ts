import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintReportComponent } from './sprint-report.component';

describe('SprintReportComponent', () => {
  let component: SprintReportComponent;
  let fixture: ComponentFixture<SprintReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SprintReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
