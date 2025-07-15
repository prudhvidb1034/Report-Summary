import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { map, Observable } from 'rxjs';
import { LoginStore } from '../../state/login.store';
import { PaginatorComponent } from '../paginator/paginator.component';
import { WeekRangePipe } from '../pipes/week-range.pipe';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [IonicModule, CommonModule,PaginatorComponent,WeekRangePipe],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.scss'
})
export class ReusableTableComponent {
  @Input() data!: Observable<any>;
  @Input() columns: any[] | undefined;
  @Output() rowAction: EventEmitter<any> = new EventEmitter<any>();
  @Input() label: string = '';
  @Input() showHeader = true;
  totalItems = 100;
  itemsPerPage = 5;
  currentPage = 0;

loadPage(event: { pageIndex: number; pageSize: number }) {
  console.log('Load data for:', event);
  // Your logic to fetch data based on event.pageIndex and event.pageSize
}


  private  loginStore = inject(LoginStore)

    userRole$ = this.loginStore.user$.pipe(
      map(res => res?.role?.toLocaleLowerCase())
    );
  trackByFn(index: number, item: any): any {
    return item ? item['id'] : undefined;
  }

  ngOnInit() {
    this.data.subscribe((data:any)=>{
      console.log(data)
    })
  }

  action(type: string, item: any) {
    this.rowAction.emit({ type: type, item: item })
  }

  toggleEvent(event: any, item: any) {
    this.rowAction.emit({ type: 'toggle-status', value: event.detail.checked === true ? 'Active' : 'InActive', item: item })
    console.log(event.detail.checked)
  }

  onPageSizeChange(event:any){
    console.log(event);

  }

  onPageChange(event:any){
    console.log(event);
  }
}
