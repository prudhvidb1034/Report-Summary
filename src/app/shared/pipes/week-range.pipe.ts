import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weekRange',
  standalone: true
})
export class WeekRangePipe implements PipeTransform {
  private datePipe = new DatePipe('en-GB'); // dd‑MM‑yyyy

  transform(range: { weekFromDate: string; weekToDate: string }): string {
    if (!range?.weekFromDate || !range?.weekToDate) return '';
    const from = new Date(range.weekFromDate);
    const to = new Date(range.weekToDate);
    const fromStr = this.datePipe.transform(from, 'dd-MMMM-yyyy');
    const toStr = this.datePipe.transform(to, 'dd-MMMM-yyyy');
    return `WEEK ${fromStr} To ${toStr}`;
  }
}

