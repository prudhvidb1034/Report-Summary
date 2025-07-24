import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklySprintUpdateComponent } from './weekly-sprint-update.component';

describe('WeeklySprintUpdateComponent', () => {
  let component: WeeklySprintUpdateComponent;
  let fixture: ComponentFixture<WeeklySprintUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklySprintUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeeklySprintUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
