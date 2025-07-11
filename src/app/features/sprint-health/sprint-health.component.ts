import { Component } from '@angular/core';
import { ReusableTableComponent } from '../../shared/reusable-table/reusable-table.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-sprint-health',
  standalone: true,
  imports: [CommonModule,IonicModule],
  templateUrl: './sprint-health.component.html',
  styleUrl: './sprint-health.component.scss'
})
export class SprintHealthComponent {


label = 'SprintHealth';
   sprintData = [
    {
      team: 'Customer 360',
      estimation: 'G',
      grooming: 'G',
      completion: '77.8%',
      inDev: '0',
      inQA: '0',
      blocked: '2(4)',
      atRisk: '0'
    },
    {
      team: 'Onboarding',
      estimation: 'G',
      grooming: 'G',
      completion: '25%',
      inDev: '1(3)',
      inQA: '1(3)',
      blocked: '0',
      atRisk: '0'
    },
    {
      team: 'Innovation',
      estimation: 'G',
      grooming: 'G',
      completion: '100%',
      inDev: '0',
      inQA: '8(28)',
      blocked: '0',
      atRisk: '0'
    },
    {
      team: 'RPA',
      estimation: 'G',
      grooming: 'G',
      completion: '71.4%',
      inDev: '6(14)',
      inQA: '3(9)',
      blocked: '0',
      atRisk: '0'
    },
    {
      team: 'CoreTex',
      estimation: 'G',
      grooming: 'G',
      completion: '100%',
      inDev: '0',
      inQA: '0',
      blocked: '0',
      atRisk: '0'
    },
    {
      team: 'UX',
      estimation: 'G',
      grooming: 'G',
      completion: '100%',
      inDev: 'N/A',
      inQA: 'N/A',
      blocked: '0',
      atRisk: '0'
    }
  ];

  releaseData = [
    { team: 'Customer 360', major: 0, minor: 0, incidents: 0 },
    { team: 'Onboarding', major: 0, minor: 0, incidents: 0 },
    { team: 'Innovation', major: 0, minor: 0, incidents: 0 },
    { team: 'RPA', major: 0, minor: 0, incidents: 0 },
    { team: 'CoreTex', major: 0, minor: 1, incidents: 0 }
  ];

  releaseInfo = 'CoreTex: Minor fixes released on 06/26 related to Party domain, external Nginx service and signature adapter.';
}