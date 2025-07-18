import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-test-paginator',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  @Input() itemsPerPage = 5;
  @Input() currentPage = 0;
  @Input() totalItems = 100;
  @Input() pageSizeOptions = [5, 10, 20, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  getStartIndex(): number {
    return this.currentPage * this.itemsPerPage;
  }

  getEndIndex(): number {
    const end = this.getStartIndex() + this.itemsPerPage;
    return end > this.totalItems ? this.totalItems : end;
  }

  changePage(index: number) {
    console.log("index",index);
    this.pageChange.emit(index);
  }

  changePageSize(size: number) {
    this.pageSizeChange.emit(size);
    this.pageChange.emit(0); // Reset to first page on page size change
  }
}
