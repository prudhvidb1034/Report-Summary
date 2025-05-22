import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { Constants } from '../../constants/string-constants';
import { createTeam } from '../../models/project.model';
import { LoginService } from '../../services/login-service/login.service';
import { TeamListService } from '../../services/team-list/team-list.service';
import { ToastService } from '../../shared/toast.service';
import { LoginStore } from '../../state/login.store';
import { TeamStore } from '../../state/team.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,RouterModule,
    IonicModule, CommonModule, ReactiveFormsModule, RouterModule],
    providers:[TeamStore],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private url = "http://localhost:3000/teamslist"
  isModalOpen = false;
  teamForm !: FormGroup;
  private fb = inject(FormBuilder)
  private toast = inject(ToastService)
  private shareservice = inject(TeamListService)
  private router= inject(Router)
  teamList = signal<createTeam[]>([]);
  private teamStore=inject(TeamStore);
  private loginService=inject(LoginService);
  teamList$ = this.teamStore.team$;
  ngOnInit() {
    this.CreateForm();
    this.teamStore.getTeam();
    console.log(this.loginService.userList)
     }

  goToProject(id: string) {
    this.router.navigate(['/project', id]);
  }
  

  setOpen(isOpen: boolean) {
    // this.teamList$.subscribe((data:any)=>{
    //   console.log(data)
    // })
    this.isModalOpen = isOpen;
    this.teamForm.reset()
  }


  CreateForm() {
    this.teamForm = this.fb.group({
      projectname: ['', [Validators.required, Validators.minLength(3)]],
      projectlocation: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']

    })
  }


  SubmitForm() {
    const response = this.teamForm.value;
    if (this.teamForm.valid) {
      this.teamStore.addTeam(response);
        this.setOpen(false);
        this.teamForm.reset();
     
        this.toast.show('success','Project created successfully!')
     
    } else {

     
        this.toast.show('error','Please fill in all required fields.')
      
      this.teamForm.markAllAsTouched()
    }
  }
 


  // deleteproject(item: any) {
  //   const fullUrl = `${this.url}/${item.id}`;
  //   this.shareservice.deleteData(fullUrl).subscribe(() => {
  //     alert('item deleted');
  //     // this.getTeamList()
  //   })
  // }


}
