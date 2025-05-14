import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    IonicModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  isModalOpen = false;

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  
  projects = [
    {
      id: 'P001',
      name: 'Zira Clone',
      location: 'Hyderabad',
      startDate: '2024-05-01',
      endDate: '2024-08-01'
    },
    {
      id: 'P002',
      name: 'iTraceu',
      location: 'Bangalore',
      startDate: '2024-02-15',
      endDate: null // Optional
    },
    {
      id: 'P003',
      name: 'Onboarding System',
      location: 'Chennai',
      startDate: null, // Optional
      endDate: null
    }
  ];

 
}
