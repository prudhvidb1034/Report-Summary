  import { CommonModule } from '@angular/common';
  import { Component } from '@angular/core';
  import { IonicModule } from '@ionic/angular';
  import { Chart } from 'chart.js/auto';
  import PptxGenJS from 'pptxgenjs';
  import html2canvas from 'html2canvas';
  @Component({
    selector: 'app-sprint-report',
    standalone: true,
    imports: [IonicModule, CommonModule],
    templateUrl: './sprint-report.component.html',
    styleUrl: './sprint-report.component.scss'
  })
  export class SprintReportComponent {
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
  async downloadAsPptx(): Promise<void> {
    try {
      const pptx = new PptxGenJS();
      const pageSections = document.querySelectorAll('.container') as NodeListOf<HTMLElement>;

      for (let page of Array.from(pageSections)) {
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true
        });

        const imageData = canvas.toDataURL('image/png');
        const slide = pptx.addSlide();
        const aspectRatio = canvas.width / canvas.height;
        const maxWidth = 9;
        const width = maxWidth;
        const height = width / aspectRatio;

        slide.addImage({
          data: imageData,
          x: 0.5,
          y: 0.5,
          w: width,
          h: height
        });
      }

      await pptx.writeFile({ fileName: 'Sprint_Report_Slides.pptx' });
      console.log('PowerPoint generated with multiple pages!');
    } catch (error) {
      console.error('Error while generating PPT:', error);
    }
  }


  }