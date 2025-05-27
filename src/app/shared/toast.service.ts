import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
export interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private totalSubject = new Subject<ToastMessage>();
  toast$ = this.totalSubject.asObservable();


  show(type: ToastMessage['type'], text: string) {
    this.totalSubject.next({ type, text });
  }



}
