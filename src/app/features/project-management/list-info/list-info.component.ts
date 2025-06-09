import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-list-info',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './list-info.component.html',
  styleUrl: './list-info.component.scss'
})
export class ListInfoComponent {

  constructor(private route: Router){
  }
  ngOninit(){
    console.log(this.route.routerState.snapshot.root)
  }

}
