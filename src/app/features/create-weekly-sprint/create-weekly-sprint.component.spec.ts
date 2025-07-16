import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWeeklySprintComponent } from './create-weekly-sprint.component';

describe('CreateWeeklySprintComponent', () => {
  let component: CreateWeeklySprintComponent;
  let fixture: ComponentFixture<CreateWeeklySprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWeeklySprintComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateWeeklySprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
