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

      const gridElement = document.querySelector('.grid-layout') as HTMLElement;

      if (!gridElement) {
        console.error('Grid layout section not found!');
        return;
      }
      const canvas = await html2canvas(gridElement, {
        scale: 2,
        useCORS: true,
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
        h: height,
      });

      await pptx.writeFile({ fileName: 'Resource_Summary_Presentation.pptx' });


      console.log('PowerPoint file successfully generated!');
    } catch (error) {
      console.error('Error generating PPT:', error);
    }
  }

}