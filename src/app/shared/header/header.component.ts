import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { BreadcrumbComponent } from '../bread-crumb/bread-crumb.component';

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


  ngOnInit() {

  }

  constructor(private router: Router, private route: ActivatedRoute, private menuCtrl: MenuController) {
    this.router.events.subscribe((val: any) => {
      if (val.url !== '/login' ) {
        this.showLogout = true;
      } else {
        this.showLogout = false;
      }
    });
  }


  toggleMenu() {
    this.menuCtrl.toggle();
  }

  onLogout() {
    this.router.navigate(['/login']);
    localStorage.clear()
  }
}
