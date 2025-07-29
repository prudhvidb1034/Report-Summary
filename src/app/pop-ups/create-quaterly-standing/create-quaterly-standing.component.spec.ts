import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuaterlyStandingComponent } from './create-quaterly-standing.component';

describe('CreateQuaterlyStandingComponent', () => {
  let component: CreateQuaterlyStandingComponent;
  let fixture: ComponentFixture<CreateQuaterlyStandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateQuaterlyStandingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateQuaterlyStandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
