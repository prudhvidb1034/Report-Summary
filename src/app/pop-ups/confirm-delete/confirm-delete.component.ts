import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

interface ConfirmDeleteData {
  id: string | number;
  name:string
}

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss'
})
export class ConfirmDeleteComponent {
  private modalCtrl = inject(ModalController);

  @Input() data!: ConfirmDeleteData;

  ngOnInit() {

    console.log('Selected row data:', this.data.id);
    console.log('Selected row data:Prudhvi varma', this.data);
  }

  setOpen() {
    this.modalCtrl.dismiss();



  }

 confirm() {
    this.modalCtrl.dismiss({
      confirmed: true,
      id: this.data?.id,       // ✅ return ID to parent
      // data: this.data          // (optional) pass full data back if needed
    });
  }
}
