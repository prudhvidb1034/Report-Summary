import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastMessage, ToastService } from '../toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  messages: ToastMessage[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toast$.subscribe(msg => {
      this.messages.push(msg);
      setTimeout(() => this.removeToast(msg), 3000); 
    });
  }

  removeToast(msg: ToastMessage) {
    this.messages = this.messages.filter(m => m !== msg);
  }
}
