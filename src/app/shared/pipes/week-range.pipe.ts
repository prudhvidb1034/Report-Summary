import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weekRange',
  standalone: true
})
export class WeekRangePipe implements PipeTransform {

    transform(value:any): string {
      console.log(value)
    if (!value || !value.weekStartDate || !value.weekEndDate) {
      return '';
    }
    return `WEEK: ${value.weekStartDate} To ${value.weekEndDate}`;
  }


}
