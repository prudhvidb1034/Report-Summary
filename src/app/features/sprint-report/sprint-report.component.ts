import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Chart } from 'chart.js/auto';
import PptxGenJS from 'pptxgenjs';
import html2canvas from 'html2canvas';
import { SprintStore } from '../../state/sprint.store';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-sprint-report',
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [SprintStore],
  templateUrl: './sprint-report.component.html',
  styleUrl: './sprint-report.component.scss'
})
export class SprintReportComponent {

  private sprintSore = inject(SprintStore);

  SprintList$ = this.sprintSore.sprintReport$;
  incidentList$ = this.sprintSore.incidentReport$;
  isLoading$ = this.sprintSore.select((state: { loading: any; }) => state.loading);
  private router = inject(ActivatedRoute);
  ngOnInit() {
    const sprintId = this.router.snapshot.paramMap.get('id');

    if (sprintId !== null) {
      this.sprintSore.getReportById(sprintId);
      this.sprintSore.getIndicentById(sprintId);
    }

  }
  techSummary = [
    { tech: 'UX', onsite: 1, offshore: 3, ratio: '25% : 75%' },
    { tech: 'UI', onsite: 1, offshore: 7, ratio: '13% : 87%' },
    { tech: 'Java', onsite: 2, offshore: 7, ratio: '22% : 78%' },
    { tech: 'RPA', onsite: 0, offshore: 2, ratio: '0% : 100%' },
    { tech: 'Total', onsite: 4, offshore: 19, ratio: '17% : 83%' },

  ];

  projectSummary = [
    { project: 'C360', onsite: 2, offshore: 6, ratio: '25% :75%' },
    { project: 'Innovation', onsite: 0, offshore: 3, ratio: '0% : 100%' },
    { project: 'Onboarding', onsite: 1, offshore: 4, ratio: '20% : 80%' },
    { project: 'Core Tex', onsite: 0, offshore: 1, ratio: '0% :100%' },
    { project: 'RPA', onsite: 0, offshore: 2, ratio: '0% :100%' },
    { project: 'Total', onsite: 3, offshore: 16, ratio: '16% : 84%' },
  ];


  sprintHealth = [
    { name: 'Customer 360', est: 'G', groom: 'G', completion: '77.8%', inDev: '0', inQA: '0', blocked: '2(4)', atRisk: '0' },
    { name: 'Onboarding', est: 'G', groom: 'G', completion: '25%', inDev: '1(3)', inQA: '1(3)', blocked: '0', atRisk: '0' },
    { name: 'Innovation', est: 'G', groom: 'G', completion: '100%', inDev: '0', inQA: '8(28)', blocked: '0', atRisk: '0' },
    { name: 'RPA', est: 'G', groom: 'G', completion: '71.4%', inDev: '6(14)', inQA: '3(9)', blocked: '0', atRisk: '0' },
    { name: 'CoreTex', est: 'G', groom: 'G', completion: '100%', inDev: '0', inQA: '0', blocked: '0', atRisk: '0' },
    { name: 'UX', est: 'G', groom: 'G', completion: '100%', inDev: 'N/A', inQA: 'N/A', blocked: '0', atRisk: '0' },
  ];

  releaseData = [
    { team: 'Customer 360', major: 0, minor: 0, incident: 0 },
    { team: 'Onboarding', major: 0, minor: 0, incident: 0 },
    { team: 'Innovation', major: 0, minor: 0, incident: 0 },
    { team: 'RPA', major: 0, minor: 0, incident: 0 },
    { team: 'CoreTex', major: 0, minor: 1, incident: 0 },
  ];

  ngAfterViewInit() {
    this.renderBarChart();
    this.renderBarChart2()
  }

  renderBarChart() {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['C360', 'Innovation', 'Onboarding', 'Core Tex', 'RPA', 'UX', 'Total'],
        datasets: [
          {
            label: 'UI',
            data: [5, 2, 1, 0, 2, 4, 14],
            backgroundColor: '#007bff'
          },
          {
            label: 'Backend',
            data: [3, 1, 4, 1, 0, 0, 9],
            backgroundColor: '#fd7e14'
          },
          {
            label: 'Total',
            data: [8, 3, 5, 1, 2, 4, 23],
            backgroundColor: '#adb5bd'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: false }
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true }
        }
      }
    });
  }
    renderBarChart2() {
    const ctx = document.getElementById('barChart2') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['C360', 'Innovation', 'Onboarding', 'Core Tex', 'RPA', 'UX', 'Total'],
        datasets: [
          {
            label: 'UI',
            data: [5, 2, 1, 0, 2, 4, 14],
            backgroundColor: '#007bff'
          },
          {
            label: 'Backend',
            data: [3, 1, 4, 1, 0, 0, 9],
            backgroundColor: '#fd7e14'
          },
          {
            label: 'Total',
            data: [8, 3, 5, 1, 2, 4, 23],
            backgroundColor: '#adb5bd'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: false }
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true }
        }
      }
    });
  }
  async downloadAsPptx(): Promise<void> {
    this.sprintSore.patchState({ loading: true });
    try {
      const pptx = new PptxGenJS();
      const pageSections = document.querySelectorAll('.container') as NodeListOf<HTMLElement>;

      // Wait for fonts to be fully loaded
      await document.fonts.ready;

      const totalPages = pageSections.length;

      for (const [index, page] of Array.from(pageSections).entries()) {
        // Force consistent font styling
        page.style.fontFamily = "'Poppins', sans-serif";
        page.style.fontSize = '12px';

        const canvas = await html2canvas(page, {
          scale: 3,
          useCORS: true
        });

        const fullWidth = canvas.width;
        const fullHeight = canvas.height;
        const aspectRatio = fullHeight / fullWidth;
        const imgData = canvas.toDataURL('image/png');

        const slide = pptx.addSlide();

        // Add image to slide
        slide.addImage({
          data: imgData,
          x: 0,
          y: 0,
          w: 10,
          h: 10 * aspectRatio
        });

        // Add bottom-right page number (e.g. "1 of 7")
        const pageNumber = `${index + 1} of ${totalPages}`;
        slide.addText(pageNumber, {
          x: '85%', // 85% from left (approximate bottom-right)
          y: '90%', // 90% from top
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