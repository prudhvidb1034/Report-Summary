import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { fromEvent, Subscription, timer } from 'rxjs';
import { throttleTime, switchMap, map } from 'rxjs/operators';

interface DailyUpdate {
  startDate: string;
  endDate: string;
  task: string;
  status: string;
  keyAccomplishments: string[];
}

interface Employee {
  employee_id: string;
  project_id: string;
  employee_name: string;
  summary: string;
  daily_updates: DailyUpdate[];
  projectName: string;
  techstack: string;
}

interface Project {
  id: string;
  project_name: string;
  start_date: string;
  end_date: string;
  upcomingTasks: string;
  employees: Employee[];
}

interface ProjectStatus {
  projectId: string;
  projectName: string;
  status: string;
  summary: string[]; // Aggregated from employees
  lastUpdated: Date; // Latest date from updates
  details: string; // upcomingTasks
  employees: Employee[]; // For detailed display
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-status.component.html',
  styleUrl: './project-status.component.scss',

})
export class ProjectStatusComponent extends ComponentStore<State> implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('statusContainer') statusContainer!: ElementRef<HTMLElement>;
  @ViewChild('projectList') projectList!: ElementRef<HTMLElement>;

  projects: Project[] = [];
  loadedProjectStatuses: ProjectStatus[] = [];
  selectedProjectIndex = 0;
  isLoading = false;

  private scrollSub?: Subscription;

  // Updated sample projects data
  private sampleProjects: Project[] = [
    {
      id: "7ae6",
      project_name: "customer365",
      start_date: "2025-05-13",
      end_date: "2025-05-20",
      upcomingTasks: "Setup monitoring dashboards",
      employees: [
        {
          employee_id: "8369",
          project_id: "7ae6",
          employee_name: "Sarath",
          summary: "TCB data",
          daily_updates: [
            {
              startDate: "2025-05-26",
              endDate: "2025-05-30",
              task: "TCB screen design",
              status: "Completed",
              keyAccomplishments: [
                "Designed the TCB screen layout, enhancing user navigation and accessibility.",
                "Collaborated with the backend team to ensure seamless data integration.",
                "Conducted user testing sessions, gathering feedback to refine the design."
              ]
            }
          ],
          projectName: "customer365",
          techstack: "Frontend"
        },
        {
          employee_id: "8370",
          project_id: "7ae6",
          employee_name: "Anjali",
          summary: "API integration",
          daily_updates: [
            {
              startDate: "2025-05-26",
              endDate: "2025-05-30",
              task: "Integrate payment gateway",
              status: "In Progress",
              keyAccomplishments: [
                "Successfully integrated the Stripe payment gateway, enabling secure transactions.",
                "Developed error handling mechanisms to manage payment failures.",
                "Collaborated with the QA team to test the integration across different scenarios."
              ]
            }
          ],
          projectName: "customer365",
          techstack: "Backend"
        },
        {
          employee_id: "8371",
          project_id: "7ae6",
          employee_name: "Vikram",
          summary: "Testing & QA",
          daily_updates: [
            {
              startDate: "2025-05-26",
              endDate: "2025-05-30",
              task: "Conduct unit tests",
              status: "Pending",
              keyAccomplishments: [
                "Prepared test cases for the TCB screen functionalities.",
                "Set up the testing environment to simulate real user interactions.",
                "Coordinated with developers to ensure timely delivery of testable modules."
              ]
            }
          ],
          projectName: "customer365",
          techstack: "QA"
        }
      ]
    },
    {
      id: "8b7d",
      project_name: "INITIO",
      start_date: "2025-06-01",
      end_date: "2025-06-15",
      upcomingTasks: "Develop core modules",
      employees: [
        {
          employee_id: "9274",
          project_id: "8b7d",
          employee_name: "Aarav",
          summary: "Backend architecture",
          daily_updates: [
            {
              startDate: "2025-06-02",
              endDate: "2025-06-06",
              task: "API design",
              status: "In Progress",
              keyAccomplishments: [
                "Drafted API endpoints for user authentication and data retrieval.",
                "Ensured API security by implementing JWT token-based authentication.",
                "Documented API specifications for frontend integration."
              ]
            }
          ],
          projectName: "INITIO",
          techstack: "Node.js, MongoDB"
        },
        {
          employee_id: "9275",
          project_id: "8b7d",
          employee_name: "Isha",
          summary: "Database optimization",
          daily_updates: [
            {
              startDate: "2025-06-02",
              endDate: "2025-06-06",
              task: "Indexing strategies",
              status: "Pending",
              keyAccomplishments: [
                "Analyzed query performance to identify bottlenecks.",
                "Proposed indexing strategies to improve data retrieval times.",
                "Collaborated with the DBA team to implement and test the proposed indexes."
              ]
            }
          ],
          projectName: "INITIO",
          techstack: "PostgreSQL"
        },
        {
          employee_id: "9276",
          project_id: "8b7d",
          employee_name: "Ravi",
          summary: "Cloud deployment",
          daily_updates: [
            {
              startDate: "2025-06-02",
              endDate: "2025-06-06",
              task: "Set up AWS infrastructure",
              status: "In Progress",
              keyAccomplishments: [
                "Provisioned EC2 instances for application deployment.",
                "Configured S3 buckets for static file storage.",
                "Implemented IAM roles to manage access permissions."
              ]
            }
          ],
          projectName: "INITIO",
          techstack: "AWS, Docker"
        }
      ]
    },
    {
      id: "9c8e",
      project_name: "UX",
      start_date: "2025-06-05",
      end_date: "2025-06-20",
      upcomingTasks: "User testing and feedback",
      employees: [
        {
          employee_id: "10284",
          project_id: "9c8e",
          employee_name: "Priya",
          summary: "UI/UX design",
          daily_updates: [
            {
              startDate: "2025-06-06",
              endDate: "2025-06-10",
              task: "Wireframe creation",
              status: "Completed",
              keyAccomplishments: [
                "Developed wireframes for the homepage and dashboard.",
                "Incorporated feedback from stakeholders to refine designs.",
                "Presented wireframes to the development team for implementation."
              ]
            }
          ],
          projectName: "UX",
          techstack: "Figma, Adobe XD"
        },
        {
          employee_id: "10285",
          project_id: "9c8e",
          employee_name: "Ravi",
          summary: "Usability testing",
          daily_updates: [
            {
              startDate: "2025-06-06",
              endDate: "2025-06-10",
              task: "User interviews",
              status: "In Progress",
              keyAccomplishments: [
                "Conducted interviews with 10 users to gather feedback.",
                "Identified key pain points in the current design.",
                "Collaborated with designers to address user concerns."
              ]
            }
          ],
          projectName: "UX",
          techstack: "UserZoom"
        },
        {
          employee_id: "10286",
          project_id: "9c8e",
          employee_name: "Neha",
          summary: "Prototyping",
          daily_updates: [
            {
              startDate: "2025-06-06",
              endDate: "2025-06-10",
              task: "Interactive prototype",
              status: "Pending",
              keyAccomplishments: [
                "Planned the structure for the interactive prototype.",
                "Selected tools and technologies for prototype development.",
                "Coordinated with the design team to align on features."
              ]
            }
          ],
          projectName: "UX",
          techstack: "InVision"
        }
      ]
    },
    {
      id: "10d9",
      project_name: "SALESFORCE",
      start_date: "2025-06-10",
      end_date: "2025-06-25",
      upcomingTasks: "CRM customization",
      employees: [
        {
          employee_id: "11394",
          project_id: "10d9",
          employee_name: "Ananya",
          summary: "Salesforce development",
          daily_updates: [
            {
              startDate: "2025-06-11",
              endDate: "2025-06-15",
              task: "Apex triggers",
              status: "Pending",
              keyAccomplishments: [
                "Reviewed business requirements for automation.",
                "Designed Apex triggers to automate lead assignment.",
                "Prepared test cases for trigger validation."
              ]
            }
          ],
          projectName: "SALESFORCE",
          techstack: "Salesforce, Apex"
        },
        {
          employee_id: "11395",
          project_id: "10d9",
          employee_name: "Vikram",
          summary: "CRM integration",
          daily_updates: [
            {
              startDate: "2025-06-11",
              endDate: "2025-06-15",
              task: "Third-party API integration",
              status: "In Progress",
              keyAccomplishments: [
                "Initiated integration with external marketing platform.",
                "Mapped data fields between Salesforce and the external system.",
                "Collaborated with the external vendor to resolve API issues."
              ]
            }
          ],
          projectName: "SALESFORCE",
          techstack: "Salesforce, REST API"
        },
        {
          employee_id: "11396",
          project_id: "10d9",
          employee_name: "Meera",
          summary: "Data migration",
          daily_updates: [
            {
              startDate: "2025-06-11",
              endDate: "2025-06-15",
              task: "Migrate legacy data",
              status: "Pending",
              keyAccomplishments: [
                "Assessed data quality of legacy systems.",
                "Developed data mapping strategy for migration.",
                "Coordinated with IT team for data extraction."
              ]
            }
          ],
          projectName: "SALESFORCE",
          techstack: "Salesforce Data Loader"
        }
      ]
    },
    {
      id: "11e0",
      project_name: "RPA",
      start_date: "2025-06-12",
      end_date: "2025-06-30",
      upcomingTasks: "Develop automation scripts",
      employees: []
    }
  ];

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
            return { state, nextProjects };
          }),
          switchMap(({ state, nextProjects }) => 
            timer(1500).pipe(
              map(() => {
                const newStatuses = nextProjects.map(p => {
                  // Aggregate summary from employees' summaries
                  const summary = p.employees.flatMap(e => e.summary ? [e.summary] : []);
                  // Determine the latest lastUpdated from employee daily_updates
                  let latestDate = new Date(p.start_date);
                  p.employees.forEach(e => {
                    e.daily_updates.forEach(update => {
                      const updateEnd = new Date(update.endDate);
                      if (updateEnd > latestDate) {
                        latestDate = updateEnd;
                      }
                    });
                  });
                  // Default status - can be customized
                  let status = 'Active';
                  // If end_date in past, mark completed or retired accordingly
                  const now = new Date();
                  const endDate = new Date(p.end_date);
                  if (now > endDate) {
                    status = 'Completed';
                  }

                  return {
                    projectId: p.id,
                    projectName: p.project_name,
                    status,
                    lastUpdated: latestDate,
                    details: p.upcomingTasks,
                    summary,
                    employees: p.employees
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

