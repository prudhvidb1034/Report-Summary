import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [IonicModule,CommonModule],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss'
})
export class ConfirmDeleteComponent {
 private modalCtrl = inject(ModalController);

  setOpen(isOpen: boolean) {
    this.modalCtrl.dismiss();

   

  }

  onDelete(){
    
  }
}
