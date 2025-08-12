import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListComponent } from './projects.component';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ProjectStore } from '../../../state/project.store';
import { ToastService } from '../../../shared/toast.service';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  const router = {
    navigate: jasmine.createSpy('navigate')
  };
  let teamStoreSpy: jasmine.SpyObj<ProjectStore>;
    let toastServiceSpy: jasmine.SpyObj<ToastService>;
  

  beforeEach(async () => {
    teamStoreSpy = jasmine.createSpyObj('TeamStore', ['addTeam']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [ProjectListComponent],
      providers: [provideHttpClient(), provideRouter([]),
      { provide: Router, useValue: router },
      { provide: ProjectStore, useValue: teamStoreSpy },
     { provide: ToastService, useValue: toastServiceSpy }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a method to goToProject', () => {
    const id = '0123';
    component.goToProject(id);
    expect(router.navigate).toHaveBeenCalledWith(['/project', id]);
  })

  it('should create a method to open a model', () => {
    const isOpen = true;
    component.setOpen(isOpen);
    expect(component.isModalOpen).toBe(isOpen);
  })

  // it('should create a method for the submit button when form is valid', () => {
  //   component.teamForm.controls['projectname'].setValue('customer365');
  //   component.teamForm.controls['projectlocation'].setValue('Hyderabad');
  //   component.teamForm.controls['startDate'].setValue('2025-05-26');
  //   component.teamForm.controls['endDate'].setValue(null);
  //   const response = component.teamForm.value;
  //   component.SubmitForm();
  //   console.log(component.teamForm.value,component.teamForm.valid)
  //   expect(teamStoreSpy.addTeam).toHaveBeenCalledWith(response);
  //   // expect(component.setOpen).toHaveBeenCalledWith(false);
  //   // component.teamForm.reset();
  //   // expect(toastServiceSpy.show).toHaveBeenCalledWith('success', 'Project created successfully!');
  // })

    it('should create a method for the submit button when form is invalid', () => {
    const response = component.teamForm.value;
    component.SubmitForm();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('error', 'Please fill in all required fields.');
  })

});
