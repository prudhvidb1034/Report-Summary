import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showLogout: boolean = false;
  // @Input() showLogout = true;
  // showLogout: boolean = false

  
  ngOnInIt() {

  }

  constructor(private router: Router, private route: ActivatedRoute, private menuCtrl: MenuController) {
    this.router.events.subscribe((val: any) => {
      if (val.url !== '/login' && val.url !== '/sign-up') {
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
    // localStorage.removeItem('userRole');
 localStorage.clear()
  }
}
