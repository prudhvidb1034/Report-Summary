import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { fromEvent, Subscription, timer } from 'rxjs';
import { throttleTime, switchMap, map } from 'rxjs/operators';

interface Project {
  id: number;
  name: string;
}

interface ProjectStatus {
  projectId: number;
  projectName: string;
  status: string;
  lastUpdated: Date;
  details: string;
}

interface State {
  projects: Project[];
  loadedProjectStatuses: ProjectStatus[];
  selectedProjectIndex: number;
  isLoading: boolean;
}

@Component({
  selector: 'app-project-status',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './project-status.component.html',
    styleUrl: './project-status.component.scss',


  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectStatusComponent extends ComponentStore<State> implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('statusContainer') statusContainer!: ElementRef<HTMLElement>;

  @ViewChild('projectList') projectList!: ElementRef<HTMLElement>;

  projects: Project[] = [];
  loadedProjectStatuses: ProjectStatus[] = [];
  selectedProjectIndex = 0;
  isLoading = false;

  private scrollSub?: Subscription;

  // Sample JSON data for projects
  private sampleProjects: Project[] = [
    { id: 1, name: 'Apollo Mission' },
    { id: 2, name: 'Gemini Flight' },
    { id: 3, name: 'Mercury Project' },
    { id: 4, name: 'Skylab Station' },
    { id: 5, name: 'Space Shuttle' },
    { id: 6, name: 'International Space Station' },
    { id: 7, name: 'Mars Rover' },
    { id: 8, name: 'James Webb Telescope' },
    { id: 9, name: 'Voyager Probe' },
    { id: 10, name: 'Hubble Telescope' }
  ];

  // Sample JSON status data keyed by project id
  private sampleStatusData: { [projectId: number]: ProjectStatus } = {
    1: {
      projectId: 1,
      projectName: 'Apollo Mission',
      status: 'Completed',
      lastUpdated: new Date('2023-07-15T10:00:00'),
      details: 'The Apollo missions successfully landed humans on the Moon and returned them safely to Earth.'
    },
    2: {
      projectId: 2,
      projectName: 'Gemini Flight',
      status: 'Completed',
      lastUpdated: new Date('2023-06-20T15:30:00'),
      details: 'Gemini missions developed space travel techniques to support Apollo’s goal of landing astronauts on the Moon.'
    },
    3: {
      projectId: 3,
      projectName: 'Mercury Project',
      status: 'Completed',
      lastUpdated: new Date('2023-05-01T11:45:00'),
      details: 'The Mercury program was America’s first manned spaceflight program, proving human spaceflight capabilities.'
    },
    4: {
      projectId: 4,
      projectName: 'Skylab Station',
      status: 'Completed',
      lastUpdated: new Date('2023-07-01T09:20:00'),
      details: 'Skylab was the United States\' first space station, orbiting Earth from 1973 to 1979.'
    },
    5: {
      projectId: 5,
      projectName: 'Space Shuttle',
      status: 'Retired',
      lastUpdated: new Date('2023-08-10T14:00:00'),
      details: 'The Space Shuttle program helped develop reusable spacecraft with 135 missions completed.'
    },
    6: {
      projectId: 6,
      projectName: 'International Space Station',
      status: 'Active',
      lastUpdated: new Date('2023-09-05T18:10:00'),
      details: 'The ISS is a habitable artificial satellite in low Earth orbit, used for scientific research and technology demonstrations.'
    },
    7: {
      projectId: 7,
      projectName: 'Mars Rover',
      status: 'Active',
      lastUpdated: new Date('2023-09-03T16:45:00'),
      details: 'Mars rovers explore the surface of Mars to study geology and search for signs of past life.'
    },
    8: {
      projectId: 8,
      projectName: 'James Webb Telescope',
      status: 'Active',
      lastUpdated: new Date('2023-09-10T21:00:00'),
      details: 'The James Webb Telescope is the premier observatory of the next decade, studying the origins of the universe.'
    },
    9: {
      projectId: 9,
      projectName: 'Voyager Probe',
      status: 'Active',
      lastUpdated: new Date('2023-07-25T12:30:00'),
      details: 'The Voyager spacecraft study the outer Solar System and continue to send data from beyond the heliosphere.'
    },
    10: {
      projectId: 10,
      projectName: 'Hubble Telescope',
      status: 'Active',
      lastUpdated: new Date('2023-08-28T17:15:00'),
      details: 'Hubble has provided unprecedented images and insights into the cosmos since its launch in 1990.'
    }
  };

  constructor() {
    super({
      projects: [],
      loadedProjectStatuses: [],
      selectedProjectIndex: 0,
      isLoading: false,
    });

    this.setProjects(this.sampleProjects);

    this.loadMoreProjectStatuses(); // load initial batch
  }

  readonly setProjects = this.updater((state: State, projects: Project[]) => ({
    ...state,
    projects
  }));

  readonly appendProjectStatuses = this.updater((state: State, statuses: ProjectStatus[]) => ({
    ...state,
    loadedProjectStatuses: [...state.loadedProjectStatuses, ...statuses]
  }));

  readonly setLoading = this.updater((state: State, isLoading: boolean) => ({
    ...state,
    isLoading
  }));

  readonly setSelectedProjectIndex = this.updater((state: State, index: number) => ({
    ...state,
    selectedProjectIndex: index
  }));

  readonly loadMoreProjectStatuses = this.effect<void>(trigger$ =>
    trigger$.pipe(
      throttleTime(500),
      switchMap(() => {
        this.setLoading(true);
        return this.select(state => state).pipe(
          map(state => {
            const currentCount = state.loadedProjectStatuses.length;
            const nextProjects = state.projects.slice(currentCount, currentCount + 3);
            return {state, nextProjects};
          }),
          switchMap(({state, nextProjects}) => 
            timer(1500).pipe(
              map(() => {
                const newStatuses = nextProjects.map(p => {
                  const status = this.sampleStatusData[p.id];
                  return {
                    projectId: p.id,
                    projectName: p.name,
                    status: status?.status ?? 'Unknown',
                    lastUpdated: status?.lastUpdated ?? new Date(),
                    details: status?.details ?? 'Details unknown.'
                  } as ProjectStatus;
                });
                this.appendProjectStatuses(newStatuses);
                this.setLoading(false);
              })
            )
          )
        );
      })
    )
  );

  ngOnInit() {
    this.subscribeToStore();
  }

  ngAfterViewInit(): void {
    if (this.statusContainer) {
      this.scrollSub = fromEvent(this.statusContainer.nativeElement, 'scroll')
        .pipe(throttleTime(100))
        .subscribe(() => this.onScroll());
    }
  }

  override ngOnDestroy(): void {
    this.scrollSub?.unsubscribe();
  }

  onProjectClick(index: number): void {
    if (index === this.selectedProjectIndex) {
      return;
    }
    this.setSelectedProjectIndex(index);

    const statusCard = this.statusContainer.nativeElement.querySelector(`#project-status-${index}`) as HTMLElement;
    if (statusCard) {
      statusCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onScroll(): void {
    if (!this.statusContainer) {
      return;
    }
    const container = this.statusContainer.nativeElement;
    const cards = Array.from(container.querySelectorAll('.project-status-card')) as HTMLElement[];
    if (cards.length === 0) {
      return;
    }

    const containerTop = container.scrollTop;
    let closestIndex = 0;
    let minDistance = Number.MAX_VALUE;

    cards.forEach((card, idx) => {
      const offsetTop = card.offsetTop;
      const distance = Math.abs(containerTop - offsetTop);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    if (closestIndex !== this.selectedProjectIndex) {
      this.setSelectedProjectIndex(closestIndex);
    }

    const threshold = 150;
    this.select(state => state).pipe(throttleTime(100), map(state => {
      if (container.scrollHeight - container.scrollTop - container.clientHeight < threshold) {
        if (!state.isLoading) {
          const loadedCount = state.loadedProjectStatuses.length;
          if (loadedCount < state.projects.length) {
            this.loadMoreProjectStatuses();
          }
        }
      }
    })).subscribe();
  }

  private subscribeToStore() {
    this.projects$.subscribe(projects => this.projects = projects);
    this.loadedProjectStatuses$.subscribe(statuses => this.loadedProjectStatuses = statuses);
    this.selectedProjectIndex$.subscribe(index => this.selectedProjectIndex = index);
    this.isLoading$.subscribe(loading => this.isLoading = loading);
  }

  readonly projects$ = this.select(state => state.projects);
  readonly loadedProjectStatuses$ = this.select(state => state.loadedProjectStatuses);
  readonly selectedProjectIndex$ = this.select(state => state.selectedProjectIndex);
  readonly isLoading$ = this.select(state => state.isLoading);
}

