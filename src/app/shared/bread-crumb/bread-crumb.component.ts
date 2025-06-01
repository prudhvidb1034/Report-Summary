import { Component, OnInit } from '@angular/core';
import { BreadcrumbStore } from '../../state/breadcrumb.store';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss'],
  standalone:true,
  imports:[IonicModule,CommonModule],
  providers:[BreadcrumbStore]
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs$ = this.breadcrumbStore.breadcrumbs$;

  constructor(private breadcrumbStore: BreadcrumbStore) {}

  ngOnInit(): void {}
}
