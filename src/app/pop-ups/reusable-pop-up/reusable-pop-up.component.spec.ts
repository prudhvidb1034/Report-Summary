import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusablePopUpComponent } from './reusable-pop-up.component';

describe('ReusablePopUpComponent', () => {
  let component: ReusablePopUpComponent;
  let fixture: ComponentFixture<ReusablePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusablePopUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReusablePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
