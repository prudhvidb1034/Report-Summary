import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { BreadcrumbComponent } from '../../shared/bread-crumb/bread-crumb.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IonicModule, CommonModule, BreadcrumbComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() showLogoutIcon: boolean = false;
  @Input() fullName: any = '';
  @Input() role: any = '';

  constructor(private router: Router, private route: ActivatedRoute, private menuCtrl: MenuController) {

  }


  ngOnInit() {
    console.log(this.showLogoutIcon);

    // if ((this.fullName || this.role) === undefined || null) {
    //    this.router.navigate(['/login']).then(() => {
    //     this.menuCtrl.close();
    //   });
    //   this.showLogoutIcon = false;

    // }
    // else {
    //   this.showLogoutIcon = true;
    // }

  }


  toggleMenu() {
    this.menuCtrl.toggle();
  }

  onLogout() {
    this.router.navigate(['/login']);
    this.showLogoutIcon = false;
    localStorage.clear()
  }
}
