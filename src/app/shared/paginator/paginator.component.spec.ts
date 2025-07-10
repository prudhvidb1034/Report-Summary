import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPaginatorComponent } from './paginator.component';

describe('TestPaginatorComponent', () => {
  let component: TestPaginatorComponent;
  let fixture: ComponentFixture<TestPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestPaginatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
