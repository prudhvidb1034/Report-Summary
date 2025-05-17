import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

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
    // this.router.events.subscribe((val:any) => {
    //   console.log(val.url)
    //   // this.showLogout = !this.route.snapshot.firstChild?.data['hideLogout'];
    // });
  }

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.subscribe((val: any) => {
      console.log(val.url)
      if (val.url !== '/login' && val.url !== '/sign-up') {
        this.showLogout = true;
      } else {
        this.showLogout = false;
      }
    });
  }

  onLogout() {
    // Add your logout logic here
    this.router.navigate(['/login']);
  }
}
