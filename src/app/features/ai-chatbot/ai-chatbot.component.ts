import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonContent } from '@ionic/angular';
import { GemeniAiService } from '../../services/gemeni-ai/gemeni-ai.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MarkdownService } from '../../services/markdown/markdown.service';

interface SelectOption {
  id: string;
  name: string;
}

interface ChatMessage {
  displayHtml: SafeHtml;
  type: 'user' | 'ai';
  showWeekIdSelection?: boolean;
  showProjectIdSelection?: boolean; // New flag
  showEmployeeIdSelection?: boolean; // New flag
}

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './ai-chatbot.component.html',
  styleUrl: './ai-chatbot.component.scss'
})
export class AiChatbotComponent implements AfterViewChecked {

  @ViewChild(IonContent) content!: IonContent;

  userInput: string = '';
  messages: ChatMessage[] = [];
  hasStartedChat: boolean = false;
  isLoading: boolean = false;

  selectedWeekId: string = '';
  selectedProjectId: string = ''; // New property
  selectedEmployeeId: string = ''; // New property

  // Changed to Array of SelectOption objects
 // weekIds: SelectOption[] = Array.from({ length: 52 }, (_, i) => ({ id: `Week ${i + 1}`, name: `Week ${i + 1}` }));


  weekIds: SelectOption[]=[
 {id:'week1',name:'WEEK 01-June-2025 To 07-June-2025'},
 {id:'week2',name:'WEEK 08-June-2025 To 14-June-2025'},
 {id:'week3',name:'WEEK 15-June-2025 To 22-June-2025'}
  ]
  projectIds: SelectOption[] = [
    { id: 'PROJ-ALPHA', name: 'Deloitte' },
    { id: 'PROJ-BETA', name: 'TCB' },
    { id: 'PROJ-GAMMA', name: 'South west airlines' },
    { id: 'PROJ-DELTA', name: 'Adobe' }
  ];

  employeeIds: SelectOption[] = [
    { id: 'EMP001', name: 'prudhvivarma (EMP001)' },
    { id: 'EMP002', name: 'Sarath (EMP002)' },
    { id: 'EMP003', name: 'Madhu (EMP003)' },
    { id: 'EMP004', name: 'Anil Kumar (EMP004)' },
    { id: 'EMP005', name: 'Abhi Ram (EMP005)' }
  ];

  // State to track which ID we're currently awaiting selection for
  awaitingIdSelectionFor: 'weekId' | 'projectId' | 'employeeId' | null = null;

  constructor(
    private aiService: GemeniAiService,
    private sanitizer: DomSanitizer,
    private markdownService: MarkdownService
  ) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.content) {
      this.content.scrollToBottom(300);
    }
  }

  async submitQuestion() {
    if (!this.userInput.trim() && this.awaitingIdSelectionFor === null) {
      return; // Prevent sending empty messages unless we are awaiting a selection
    }

    const userText = this.userInput;
    this.userInput = ''; // Clear input immediately
    this.hasStartedChat = true;

    // If we're awaiting an ID selection and the user types, treat it as a continuation
    // The service will implicitly handle if an ID is still missing for confirmation.
    if (this.awaitingIdSelectionFor !== null) {
      this.messages.push({
        displayHtml: this.sanitizer.bypassSecurityTrustHtml(`<p> ${userText}</p>`),
        type: 'user'
      });
      const currentAwaitingType = this.awaitingIdSelectionFor;
      this.awaitingIdSelectionFor = null; // Reset state before processing
      // Pass the typed text as contextIdValue as well, in case the AI can parse it
      this.processAiResponse(userText, currentAwaitingType, userText);
      return;
    }

    // Normal user message submission
    this.messages.push({
      displayHtml: this.sanitizer.bypassSecurityTrustHtml(`<p> ${userText}</p>`),
      type: 'user'
    });
    this.isLoading = true;

    this.processAiResponse(userText);
  }

  // Unified method to handle ID selection from the AI's prompt
  async selectIdFromChat(idType: 'weekId' | 'projectId' | 'employeeId') {
    let selectedValue: string = '';
    let selectedName: string = ''; // To display in chat for clarity

    // Determine the selected value and the message to send back based on idType
    switch (idType) {
      case 'weekId':
        selectedValue = this.selectedWeekId;
        selectedName = this.weekIds.find(w => w.id === selectedValue)?.name || selectedValue;
        break;
      case 'projectId':
        selectedValue = this.selectedProjectId;
        selectedName = this.projectIds.find(p => p.id === selectedValue)?.name || selectedValue;
        break;
      case 'employeeId':
        selectedValue = this.selectedEmployeeId;
        selectedName = this.employeeIds.find(e => e.id === selectedValue)?.name || selectedValue;
        break;
      default:
        console.error('Unknown ID type selected:', idType);
        return;
    }

    if (!selectedValue) {
      return; // Ensure a value is selected
    }

    this.isLoading = true;
    this.awaitingIdSelectionFor = null; // No longer awaiting, selection made

    // Find the AI message that prompted for this ID and remove its dropdown
    const lastAiMessageIndex = this.messages.length - 1;
    if (lastAiMessageIndex >= 0 && (
      (idType === 'weekId' && this.messages[lastAiMessageIndex].showWeekIdSelection) ||
      (idType === 'projectId' && this.messages[lastAiMessageIndex].showProjectIdSelection) ||
      (idType === 'employeeId' && this.messages[lastAiMessageIndex].showEmployeeIdSelection)
    )) {
      this.messages[lastAiMessageIndex].showWeekIdSelection = false;
      this.messages[lastAiMessageIndex].showProjectIdSelection = false;
      this.messages[lastAiMessageIndex].showEmployeeIdSelection = false;

    }

    const confirmationMessage = `Selected ${selectedName} for ${idType.replace('Id', ' ID')}.`;
    this.messages.push({
      displayHtml: this.sanitizer.bypassSecurityTrustHtml(`<p> ${confirmationMessage}</p>`),
      type: 'user'
    });

    // Send to AI service, this is where the magic happens for ID handling
    this.processAiResponse(confirmationMessage, idType, selectedValue);
  }

  private async processAiResponse(message: string, contextIdType: 'weekId' | 'projectId' | 'employeeId' | null = null, contextIdValue: string = '') {
    try {
      let aiResponse: string;

      // If we are currently responding to an ID selection, send the context to the service
      if (contextIdType && contextIdValue) {
        aiResponse = await this.aiService.sendUserInput(message, contextIdType, contextIdValue);
      } else {
        aiResponse = await this.aiService.sendUserInput(message);
      }

      // Check for special instructions from the service to show an ID selection
      if (aiResponse.startsWith('__PROMPT_WEEK_ID__')) {
        const promptText = aiResponse.replace('__PROMPT_WEEK_ID__', '').trim();
        this.messages.push({
          displayHtml: this.sanitizer.bypassSecurityTrustHtml(this.markdownService.convertToHtml(promptText) as string),
          type: 'ai',
          showWeekIdSelection: true
        });
        this.awaitingIdSelectionFor = 'weekId';
      } else if (aiResponse.startsWith('__PROMPT_PROJECT_ID__')) {
        const promptText = aiResponse.replace('__PROMPT_PROJECT_ID__', '').trim();
        this.messages.push({
          displayHtml: this.sanitizer.bypassSecurityTrustHtml(this.markdownService.convertToHtml(promptText) as string),
          type: 'ai',
          showProjectIdSelection: true
        });
        this.awaitingIdSelectionFor = 'projectId';
      } else if (aiResponse.startsWith('__PROMPT_EMPLOYEE_ID__')) {
        const promptText = aiResponse.replace('__PROMPT_EMPLOYEE_ID__', '').trim();
        this.messages.push({
          displayHtml: this.sanitizer.bypassSecurityTrustHtml(this.markdownService.convertToHtml(promptText) as string),
          type: 'ai',
          showEmployeeIdSelection: true
        });
        this.awaitingIdSelectionFor = 'employeeId';
      }
      else {
        // Normal AI response, convert markdown to HTML
        const aiSafeHtmlResponse = this.sanitizer.bypassSecurityTrustHtml(this.markdownService.convertToHtml(aiResponse) as string);
        this.messages.push({
          displayHtml: aiSafeHtmlResponse,
          type: 'ai'
        });
        this.awaitingIdSelectionFor = null; // Ensure it's off for normal responses
      }
    } catch (error) {
      console.error('AI chat error:', error);
      this.messages.push({
        displayHtml: this.sanitizer.bypassSecurityTrustHtml(`<p><strong>AI:</strong> Sorry, something went wrong.</p>`),
        type: 'ai'
      });
      this.awaitingIdSelectionFor = null;
    } finally {
      this.isLoading = false;
      this.scrollToBottom();
    }
  }
}