import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { BreadcrumbComponent } from '../bread-crumb/bread-crumb.component';
import { LoginStore } from '../../state/login.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IonicModule, CommonModule,BreadcrumbComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showLogout: boolean = false;
  @Input() fullName: any = '';
  @Input() role: any = '';

  private  loginStore = inject(LoginStore)

  ngOnInit() {

  }

  constructor(public router: Router, private route: ActivatedRoute, private menuCtrl: MenuController) {
  }


  toggleMenu() {
    this.menuCtrl.toggle();
  }

  onLogout() {
    this.router.navigate(['/login']);
    localStorage.clear();
     this.loginStore.clearAll();
  }
}
