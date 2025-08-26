import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { map, Observable } from 'rxjs';
import { LoginStore } from '../../state/login.store';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared/shared.service';
import { urls } from '../../constants/string-constants';
import { PaginatorComponent } from '../paginator/paginator.component';
import { WeekRangePipe } from '../pipes/week-range.pipe';
import { RouterModule } from '@angular/router';
import { CommonStore } from '../../state/common.store';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [IonicModule, CommonModule, PaginatorComponent, WeekRangePipe, FormsModule, RouterModule],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.scss'
})
export class ReusableTableComponent {
  @Input() data!: Observable<any>;
  @Input() columns: any[] | undefined;
  @Output() rowAction: EventEmitter<any> = new EventEmitter<any>();
  @Input() label: string = '';
  @Input() showSearchandButton = false;
  @Input() weekLabel: string = '';
  @Input() showHeader = true;
  @Input() searchTerm: string = '';
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() searchTermChanged = new EventEmitter<string>();
  @Input() createEnableFlag: any;
  totalItems = 100;
  itemsPerPage = 5;
  currentPage = 0;

  loadPage(event: { pageIndex: number; pageSize: number }) {
  }


  private loginStore = inject(LoginStore)
  private sharedservice = inject(SharedService);

  userRole$ = this.loginStore.user$.pipe(
    map(res => res?.role?.toLocaleLowerCase())
  );
  trackByFn(index: number, item: any): any {
    return item ? item['id'] : undefined;
  }

  ngOnInit() {
    console.log("createEnableFlag", this.createEnableFlag)
  }

  onSearchTermChange() {
    console.log(this.searchTerm);
    this.rowAction.emit({ type: 'search', item: this.searchTerm });
    // const urlWithParams = `${urls.PROJECT_SEARCH}?name=${this.searchTerm}`;
    // this.sharedservice.getData(urlWithParams).subscribe();
    // this.searchTermChanged.emit(this.searchTerm);
    // this.data.subscribe((data:any)=>{
    //   console.log(data)
    // })
  }

  action(type: string, item: any) {
    this.rowAction.emit({ type: type, item: item })
  }

  toggleEvent(event: any, item: any) {
    this.rowAction.emit({ type: 'toggle-status', value: event.detail.checked === true ? 'Active' : 'InActive', item: item })
  }

  onPageSizeChange(event: any) {
    this.rowAction.emit({ type: 'pageSize', item: event });

  }

  onPageChange(event: any) {
    this.rowAction.emit({ type: 'nextPage', item: event })
  }

  navigation(type: string, item: any, columnName: string) {
    this.rowAction.emit({ type: type, item: item, columnName: columnName });
  }
}
