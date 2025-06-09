import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RegisterStore } from '../../state/register.store';

@Component({
  selector: 'app-manager-emp-list',
  standalone: true,
  imports: [CommonModule,IonicModule],
  providers:[RegisterStore],
  templateUrl: './manager-emp-list.component.html',
  styleUrl: './manager-emp-list.component.scss'
})
export class ManagerEmpListComponent {
  @Input() title: string = 'Manager';
   private getRegisterStore = inject(RegisterStore);
   teamRegisterList$ = this.getRegisterStore.register$;

}
