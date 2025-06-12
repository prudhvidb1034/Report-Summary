import { Component, ElementRef, inject, QueryList, ViewChildren, HostListener, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';



@Component({
  selector: 'app-project-status',
  templateUrl: './project-status.component.html',
  styleUrls: ['./project-status.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ProjectStatusComponent implements AfterViewInit {

  private http = inject(HttpClient);
  projects: any[] = [];
  activeProjectIndex = 0;

  @ViewChildren('projectSection') projectSections!: QueryList<ElementRef>;

  ngOnInit() {
    this.http.get('http://localhost:3000/projects').subscribe((projects: any) => {
      this.projects = projects;
      console.log(this.projects)
    });
  }

  ngAfterViewInit() {
    // Scroll to default project on load
    setTimeout(() => this.scrollToProject(0), 0);
  }

  scrollToProject(index: number) {
    const section = this.projectSections.get(index);
    if (section) {
      section.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeProjectIndex = index;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.projectSections.forEach((section, index) => {
      const rect = section.nativeElement.getBoundingClientRect();
      if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
        this.activeProjectIndex = index;
      }
    });
  }
}
