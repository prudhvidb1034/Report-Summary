import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklySprintReleasesComponent } from './weekly-sprint-releases.component';

describe('WeeklySprintReleasesComponent', () => {
  let component: WeeklySprintReleasesComponent;
  let fixture: ComponentFixture<WeeklySprintReleasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklySprintReleasesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeeklySprintReleasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
