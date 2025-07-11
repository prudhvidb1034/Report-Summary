import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintHealthComponent } from './sprint-health.component';

describe('SprintHealthComponent', () => {
  let component: SprintHealthComponent;
  let fixture: ComponentFixture<SprintHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintHealthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SprintHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
