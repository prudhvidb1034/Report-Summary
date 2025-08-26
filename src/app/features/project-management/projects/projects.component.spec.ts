import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListComponent } from './projects.component';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ProjectStore } from '../../../state/project.store';
import { ToastService } from '../../../shared/toast.service';
import { ModalController } from '@ionic/angular/standalone';
import { of } from 'rxjs';
import { CommonStore } from '../../../state/common.store';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  const routerSpy = {
    navigate: jasmine.createSpy('navigate')
  };
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let mockProjectStoreSpy: jasmine.SpyObj<ProjectStore>;
  let commonStoreSpy:jasmine.SpyObj<CommonStore>;
  const action = {
    item: {
      projectId: 2,
      projectName: "customer-361",
      createdAt: "2025-08-20T13:37:49.843952",
      createdBy: "Sarath Tenneti",
      updatedAt: "2025-08-20T11:32:19.297157",
      updatedBy: "Sarath Tenneti",
      accountId: 1,
      accountName: "TCB"
    }
  }



  beforeEach(async () => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    mockProjectStoreSpy = jasmine.createSpyObj(
      'ProjectStore',
      ['getTeam', 'deleteProject', 'select'],
      {
        team$: of([]),
        loading$: of(false)
      }
    );
    commonStoreSpy = jasmine.createSpyObj(
      'CommonStore',
      ['getSearch','select'],{
        list$:of([]),
        isLoadingCommon$:of(false)
      }
    )
   

    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);
        


    await TestBed.configureTestingModule({
      imports: [ProjectListComponent],
      providers: [provideHttpClient(), provideRouter([]),
      { provide: Router, useValue: routerSpy },
      { provide: ProjectStore, useValue: mockProjectStoreSpy },
      { provide: ModalController, useValue: modalControllerSpy },
      { provide: ToastService, useValue: toastServiceSpy },
      {provide:CommonStore,useValue:commonStoreSpy}]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should create a method for navigate case in  handleRowClick', () => {
    component.handleRowAction({ type: 'navigate', item: action.item });
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/projects/employees', action.item.projectId],
      { state: { name: action.item.projectName } }
    );

  });

  it('should create a method for create case in handleRowClick', () => {
    component.handleRowAction({ type: 'create', item: action.item });
    spyOn(component, 'openCreateModal');
  });

  it('should create a method for edit case in handleRowClick', () => {
    spyOn(ProjectListComponent.prototype, 'openEditModal').and.callThrough();
    component.handleRowAction({ type: 'edit', item: action.item });
    expect(ProjectListComponent.prototype.openEditModal).toHaveBeenCalledWith(action.item);
  });

  it('should create a method for delete case in handleRowClick', () => {
    spyOn(ProjectListComponent.prototype, 'openDeleteModal').and.callThrough();
    component.handleRowAction({ type: 'delete', item: action.item });
    expect(ProjectListComponent.prototype.openDeleteModal).toHaveBeenCalledWith(action.item);
  });

  it('should create a method for nextPage case in handleRowClick ',()=>{
   spyOn(component, 'loadProjects');
   const pageNumber = 3;
   component.handleRowAction({ type: 'nextPage', item: pageNumber });
   expect(component.page).toBe(pageNumber);
   expect(component.loadProjects).toHaveBeenCalledWith(pageNumber, component.pageSize);
  });

  it('should create a method for pageSize case in handleRowClick ', () => {
    spyOn(component, 'loadProjects');
    component.pageSize = 10;
    component.page = 3;
    component.handleRowAction({ type: 'pageSize', item: component.pageSize });
    expect(component.loadProjects).toHaveBeenCalledWith(3, 10);
  });

  it('should create a method for search case in handleRowClick ', () => {
    component.page = 3;
    component.pageSize = 10;
    component.handleRowAction({ type: 'search', item: 'initio' });
    expect(commonStoreSpy.getSearch).toHaveBeenCalledWith({
      type: 'projects',
      searchName: 'initio',
      page: 3,
      size: 10,
      sortBy: 'projectName'
    });
        expect(component.projectList$).toBe(commonStoreSpy.list$);

  });

    it('should create a method for search case if item is apart from string  handleRowClick ', () => {
    component.page = 3;
    component.pageSize = 10;
    component.handleRowAction({ type: 'search', item: 3 });
    expect(commonStoreSpy.getSearch).toHaveBeenCalledWith({
      type: 'projects',
      searchName: '',
      page: 3,
      size: 10,
      sortBy: 'projectName'
    });
    expect(component.projectList$).toBe(commonStoreSpy.list$);
  });


  // it('should handle row actions correctly', async () => {
  //   const fakeModal: any = {
  //     present: jasmine.createSpy('present'),
  //     dismiss: jasmine.createSpy('dismiss'),
  //     onDidDismiss: jasmine.createSpy('onDidDismiss')
  //       .and.returnValue(Promise.resolve({ data: {} }))
  //   };

  //   modalControllerSpy.create.and.returnValue(Promise.resolve(fakeModal));


  //   await component.openCreateModal();

  //   expect(modalControllerSpy.create).toHaveBeenCalledWith({
  //     component: jasmine.anything(),
  //     componentProps: {
  //       editData: action.item
  //     }

  //   });

  //   expect(fakeModal.present).toHaveBeenCalled();
  //   expect(fakeModal.onDidDismiss).toHaveBeenCalled();
  // });  //   const fakeModal: any = {
  //     present: jasmine.createSpy('present'),
  //     dismiss: jasmine.createSpy('dismiss'),
  //     onDidDismiss: jasmine.createSpy('onDidDismiss')
  //       .and.returnValue(Promise.resolve({ data: {} }))
  //   };

  //   modalControllerSpy.create.and.returnValue(Promise.resolve(fakeModal));

  //       await component.openCreateModal();

  //   expect(modalControllerSpy.create).toHaveBeenCalledWith({
  //     component: jasmine.any(Function),
  //     cssClass: 'create-project-modal'
  //   });

  //   expect(modalControllerSpy.create).toHaveBeenCalledWith({
  //     component: jasmine.anything(),
  //     componentProps: {
  //       editData: action.item
  //     }

  //   });

  //   expect(fakeModal.present).toHaveBeenCalled();
  //   expect(fakeModal.onDidDismiss).toHaveBeenCalled();
  // });




});
