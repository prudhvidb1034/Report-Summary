import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSummaryComponent } from './create-summary.component';

describe('CreateSummaryComponent', () => {
  let component: CreateSummaryComponent;
  let fixture: ComponentFixture<CreateSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
