import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuaterlyStandingComponent } from './quaterly-standing.component';

describe('QuaterlyStandingComponent', () => {
  let component: QuaterlyStandingComponent;
  let fixture: ComponentFixture<QuaterlyStandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuaterlyStandingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuaterlyStandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
