import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.scss'
})
export class ReusableTableComponent {
  @Input() data!: Observable<any>;

  @Input() columns: any[] | undefined;
  @Output() rowAction: EventEmitter<any> = new EventEmitter<any>();
  @Input() label: string = '';
  @Input() showHeader = true;


  trackByFn(index: number, item: any): any {
    return item ? item['id'] : undefined;
  }

  ngOnInit() {
  }

  action(type: string, item: any) {
    this.rowAction.emit({ type: type, item: item })
  }

  toggleEvent(event: any, item: any) {
    this.rowAction.emit({ type: 'toggle-status', value: event.detail.checked === true ? 'Active' : 'InActive', item: item })
    console.log(event.detail.checked)
  }
}
