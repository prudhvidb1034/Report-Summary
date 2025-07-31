import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDependenciesListComponent } from './create-dependencies-list.component';

describe('CreateDependenciesListComponent', () => {
  let component: CreateDependenciesListComponent;
  let fixture: ComponentFixture<CreateDependenciesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDependenciesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateDependenciesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
