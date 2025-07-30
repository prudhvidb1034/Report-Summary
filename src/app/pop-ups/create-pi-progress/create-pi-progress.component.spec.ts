import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePiProgressComponent } from './create-pi-progress.component';

describe('CreatePiProgressComponent', () => {
  let component: CreatePiProgressComponent;
  let fixture: ComponentFixture<CreatePiProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePiProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatePiProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
