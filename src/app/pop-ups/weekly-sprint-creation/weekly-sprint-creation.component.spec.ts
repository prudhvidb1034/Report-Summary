import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklySprintCreationComponent } from './weekly-sprint-creation.component';

describe('WeeklySprintCreationComponent', () => {
  let component: WeeklySprintCreationComponent;
  let fixture: ComponentFixture<WeeklySprintCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklySprintCreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeeklySprintCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
