import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GemeniAiService } from '../../services/gemeni-ai/gemeni-ai.service';
// Assuming GemeniUpdatedAIService and GENAI are not directly used in this component for the current flow
// import { GemeniUpdatedAIService } from '../../services/gemeni-ai/gemeni-updated-ai-service';
// import { GENAI } from '../../services/gemeni-ai/gemeni-geni-service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MarkdownService } from '../../services/markdown/markdown.service';


interface ChatMessage {
  displayHtml: SafeHtml;
  type: 'user' | 'ai';
}

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './ai-chatbot.component.html',
  styleUrl: './ai-chatbot.component.scss'
})
export class AiChatbotComponent {

  userInput: string = '';
  messages: ChatMessage[] = [];
  hasStartedChat: boolean = false;
  constructor(
    private aiService: GemeniAiService,
    private sanitizer: DomSanitizer,
    private markdownService: MarkdownService
  ) { }

  async submitQuestion() {
    if (!this.userInput.trim()) {
      return; // Prevent sending empty messages
    }

    const userText = this.userInput;
    this.messages.push({
      displayHtml: this.sanitizer.bypassSecurityTrustHtml(`<p><strong>You:</strong> ${userText}</p>`),
      type: 'user'
    });
    this.userInput = '';
    this.hasStartedChat = true; // Set to true when the user sends the first message
    const aiRawResponseHtml = await this.aiService.sendUserInput(userText);
    const aiSafeHtmlResponse = this.markdownService.convertToHtml(aiRawResponseHtml);
    // const aiSafeHtmlResponse = this.sanitizer.bypassSecurityTrustHtml(aiRawResponseHtml);
    this.messages.push({
      displayHtml: aiSafeHtmlResponse,
      type: 'ai'
    });

    // Optional: Scroll to bottom of chat if you have a scrollable container
    // You'd need a @ViewChild and ElementRef for this.
    // E.g., this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }
}