import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { createTeam } from '../../models/project.model';
import { TeamStore } from '../../state/team.store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reusable-pop-up',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  providers: [TeamStore],
  templateUrl: './reusable-pop-up.component.html',
  styleUrl: './reusable-pop-up.component.scss'
})
export class ReusablePopUpComponent {
  isModalOpen = false;
  private modalCtrl = inject(ModalController);
  @Input() teamList$!: Observable<any[]>;

  projectList = signal<createTeam[]>([]);

  ngOnInit() {
    this.teamList$.subscribe(data => {
      this.projectList.set(data)
    });
  }
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;

    this.modalCtrl.dismiss();

  }

  locationSearch = '';
  projectSearch = '';

  locations = ['Cairo', 'Geneva', 'London', 'New York'];
  filteredLocations = [...this.projectList()];

  projects = ['Alpha', 'Beta', 'Gamma', 'Delta', 'delsss'];
  filteredProjects = [...this.projects];

  filterLocations(event: any) {
    const val = event.target.value.toLowerCase();
    this.filteredLocations = this.projectList().filter(item => item.projectname.toLowerCase().includes(val));
  }

  filterProjects(event: any) {
    const val = event.target.value.toLowerCase();
    this.filteredProjects = this.projects.filter(proj => proj.toLowerCase().includes(val));
  }

  selectLocation(item: string) {
    this.locationSearch = item;
    this.filteredLocations = [];
  }

  selectProject(proj: string) {
    this.projectSearch = proj;
    this.filteredProjects = [];
  }

  clearLocationSearch() {
    this.locationSearch = '';
    this.filteredLocations = [...this.projectList()];
  }

  clearProjectSearch() {
    this.projectSearch = '';
    this.filteredProjects = [...this.projects];
  }
}
