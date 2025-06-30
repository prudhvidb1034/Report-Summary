import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss'
})
export class ConfirmDeleteComponent {
  private modalCtrl = inject(ModalController);

  @Input() data!: any;

  ngOnInit() {

    console.log('Selected row data:', this.data.id);
    console.log('Selected row data:Prudhvi varma', this.data);
  }

  setOpen(isOpen: boolean) {
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
