import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiProgressComponent } from './pi-progress.component';

describe('PiProgressComponent', () => {
  let component: PiProgressComponent;
  let fixture: ComponentFixture<PiProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PiProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
