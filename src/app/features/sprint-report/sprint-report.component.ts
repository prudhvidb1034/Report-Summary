import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Chart } from 'chart.js/auto';
import PptxGenJS from 'pptxgenjs';
import html2canvas from 'html2canvas';
import { SprintStore } from '../../state/sprint.store';
import { ActivatedRoute } from '@angular/router';
import { PiPgrogressStore } from '../../state/pi-progress.store';
@Component({
  selector: 'app-sprint-report',
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [SprintStore, PiPgrogressStore],
  templateUrl: './sprint-report.component.html',
  styleUrl: './sprint-report.component.scss'
})
export class SprintReportComponent {

  private sprintSore = inject(SprintStore);
  private piprogresstore = inject(PiPgrogressStore)
  piprogresstore$ = this.piprogresstore.piprogressReport$
  SprintList$ = this.sprintSore.sprintReport$;
  incidentList$ = this.sprintSore.incidentReport$;
  piStandingData$ = this.sprintSore.piStandingReport$
  dependencieslist$ = this.sprintSore.getdependencies$;
  resourcesbygraphlist$ = this.sprintSore.resourcesbygraph$;
  getresources$ = this.sprintSore.getresources$;
  isLoading$ = this.sprintSore.select((state: { loading: any; }) => state.loading);
  private router = inject(ActivatedRoute);
  ngOnInit() {
    const sprintId = this.router.snapshot.paramMap.get('id');
    this.piprogresstore.getPipgrogressReports()
    if (sprintId !== null) {
      this.sprintSore.getReportById(sprintId);
      this.sprintSore.getIndicentById(sprintId);
      this.sprintSore.getDependencybySprintID(sprintId)
      this.sprintSore.getResourceBySprintId(sprintId);
      this.sprintSore.getResourceByGrpahSprintId(sprintId);
    }
    this.sprintSore.getPIStandingData();
    this.piStandingData$.subscribe((res: any) => {
      console.log(res);
    })

  }

  ngAfterViewInit() {
    this.resourcesbygraphlist$.subscribe((res: any) => {
      if (res && res.techStackSummary) {
        this.renderBarChart(res.techStackSummary);
      }
    });

    this.resourcesbygraphlist$.subscribe((res: any) => {
      if (res && res.projectSummary) {
        this.renderBarChart2(res.projectSummary);
      }
    });

  }

  renderBarChart(techStackSummary: any[]) {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    const labels = techStackSummary.map(item => item.techStack);
    const onsiteData = techStackSummary.map(item => item.onsite);
    const offsiteData = techStackSummary.map(item => item.offsite);
    const totalData = techStackSummary.map(item => item.total);
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Onsite',
            data: onsiteData,
            backgroundColor: '#007bff'
          },
          {
            label: 'Offsite',
            data: offsiteData,
            backgroundColor: '#fd7e14'
          },
          {
            label: 'Total',
            data: totalData,
            backgroundColor: '#adb5bd'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: false
          }
        },
        scales: {
          x: { stacked: true 
            ,
             grid: {
              drawTicks: false,
              drawOnChartArea: false 
            }
          },
          y: {
            stacked: true,
            ticks: {
              stepSize: 5
            }
          }
        }
      }
    });
  }

  renderBarChart2(projectSummary: any[]) {
    const ctx = document.getElementById('barChart2') as HTMLCanvasElement;
    const labels = projectSummary.map(item => item.projectName);
    const onsiteData = projectSummary.map(item => item.onsite);
    const offsiteData = projectSummary.map(item => item.offsite);
    const totalData = projectSummary.map(item => item.total);
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Onsite',
            data: onsiteData,
            backgroundColor: '#007bff'
          },
          {
            label: 'Offsite',
            data: offsiteData,
            backgroundColor: '#fd7e14'
          },
          {
            label: 'Total',
            data: totalData,
            backgroundColor: '#adb5bd'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: false }
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              drawTicks: false,
              drawOnChartArea: false 
            }
          },
          y: {
            stacked: true,
            ticks: {
              stepSize: 5
            }
          }
        }
      }
    });
  }
  async downloadAsPptx(): Promise<void> {
    this.sprintSore.patchState({ loading: true });
    try {
      const pptx = new PptxGenJS();

      // wait 500ms to ensure charts are rendered
      await new Promise(res => setTimeout(res, 500));

      const pageSections = document.querySelectorAll('.container') as NodeListOf<HTMLElement>;

      await document.fonts.ready;

      const totalPages = pageSections.length;

      for (const [index, page] of Array.from(pageSections).entries()) {
        page.style.fontFamily = "'Poppins', sans-serif";
        page.style.fontSize = '12px';

        const canvas = await html2canvas(page, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#ffffff'
        });

        const fullWidth = canvas.width;
        const fullHeight = canvas.height;
        const aspectRatio = fullHeight / fullWidth;
        const imgData = canvas.toDataURL('image/png');

        const slide = pptx.addSlide();

        slide.addImage({
          data: imgData,
          x: 0,
          y: 0,
          w: 10,
          h: 10 * aspectRatio
        });

        const pageNumber = `${index + 1} of ${totalPages}`;
        slide.addText(pageNumber, {
          x: '85%',
          y: '90%',
          fontSize: 10,
          color: '666666',
          align: 'right',
          w: '15%',
          h: 0.3
        });
      }

      await pptx.writeFile({ fileName: 'Sprint_Report_Slides.pptx' });
      console.log('PowerPoint generated and downloaded successfully!');
    } catch (error) {
      console.error('Error while generating PPT:', error);
    } finally {
      this.sprintSore.patchState({ loading: false });
    }
  }



  getBgStyle(status: string): { [key: string]: string } {
    const colorMap: { [key: string]: string } = {
      'Green': '#28a745',
      'Amber': '#ffc107',
      'Red': '#dc3545'
    };

    return {
      'background-color': colorMap[status] || 'transparent',
      'color': 'white' // set text color to white
    };
  }


}