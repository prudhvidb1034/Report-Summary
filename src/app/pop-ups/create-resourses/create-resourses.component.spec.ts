import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateResoursesComponent } from './create-resourses.component';

describe('CreateResoursesComponent', () => {
  let component: CreateResoursesComponent;
  let fixture: ComponentFixture<CreateResoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateResoursesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateResoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
