import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.scss'
})
export class ReusableTableComponent {
  @Input() data: any;
  @Input() columns: any[] | undefined;
  @Output() rowAction: EventEmitter<any> = new EventEmitter<any>();
  @Input() theme = '';
  @Input() label: string = 'Item';
  @Input() showHeader = true;


  trackByFn(index: number, item: any): any {
    return item ? item['id'] : undefined; // Adjust 'id' based on your data structure
  }

  ngOnInit() {
    //  this.loadTheme(this.theme);
  }

  action(type: string, item: any) {
    console.log(type,item)
    this.rowAction.emit({ type: type, item: item })
  }


  //   loadTheme(theme:any){
  //    switch(theme){
  //    case 'projects':
  //     this.
  // }
  //   }
  // onSelect(s: any) {
  //   console.log(s)
  //   this.rowAction.emit(s)
  // }
}
