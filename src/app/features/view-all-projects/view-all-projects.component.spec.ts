import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllProjectsComponent } from './view-all-projects.component';

describe('ViewAllProjectsComponent', () => {
  let component: ViewAllProjectsComponent;
  let fixture: ComponentFixture<ViewAllProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllProjectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAllProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
