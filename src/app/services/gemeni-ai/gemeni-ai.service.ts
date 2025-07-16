import { Injectable } from '@angular/core';
import {
  GoogleGenAI,
  FunctionDeclaration,
  FunctionCallingConfigMode,
  Type
} from '@google/genai';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

interface EnhancedText {
  summary: string;
  keyAccomplishments: string[];
  weekId?: string;
  projectId?: string;
  employeeId?: string;
}

interface ProcessResult {
  status: 'success' | 'error';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class GemeniAiService {
  private ai = new GoogleGenAI({ apiKey: 'AIzaSyAaGaav8HmOznjdOazOUNuSz-ZiBKgmSUA' }); // <--- REMEMBER TO REPLACE THIS WITH YOUR ACTUAL API KEY
  private history: any[] = [];
  private currentEnhancedText?: EnhancedText;

  // Added a flag to indicate if we are awaiting explicit confirmation from the user
  private awaitingConfirmation: boolean = false;

  constructor(private http: HttpClient) {}

  private sanitizeHistoryForApi() {
    return this.history.map(item => ({
      ...item,
      role: item.role === 'user' ? 'user' : 'model'
    }));
  }

  private async processEmployeeInfo(data: EnhancedText): Promise<ProcessResult> {
    const body = { userName: 'superadmin@gmail.com', password: 'Sarath11@' };
    try {
      // Assuming this login call is required before making the actual save API call
      // You might want to make an actual save API call here instead of just logging in
      await lastValueFrom(this.http.post('https://emp-tcb1.onrender.com/auth/login', body));
      console.log('Saving enhanced info:', data);
      return {
        status: 'success',
        message: `
✅ **Profile Updated!**
**Summary:** ${data.summary}
**${data.keyAccomplishments.length} accomplishment(s) saved.**
${data.weekId ? `**Week ID:** ${data.weekId}` : ''}
${data.projectId ? `**Project ID:** ${data.projectId}` : ''}
${data.employeeId ? `**Employee ID:** ${data.employeeId}` : ''}
`
      };
    } catch (err: any) {
      return {
        status: 'error',
        message: `❌ **Update Failed:** ${err.message || 'Unknown error'}`
      };
    }
  }

  private determineMissingIdAndPrompt(): string {
    if (!this.currentEnhancedText) {
      this.awaitingConfirmation = false; // Reset if no profile data to process
      return `❌ Error: No profile data. Please provide summary & accomplishments first.`;
    }
    if (!this.currentEnhancedText.weekId) {
      this.awaitingConfirmation = false; // Reset if we need an ID
      return `__PROMPT_WEEK_ID__I can enhance your profile, but need the **Week ID**. Please select it.`;
    }
    if (!this.currentEnhancedText.projectId) {
      this.awaitingConfirmation = false; // Reset if we need an ID
      return `__PROMPT_PROJECT_ID__Great! Now I need the **Project ID**. Please select it.`;
    }
    if (!this.currentEnhancedText.employeeId) {
      this.awaitingConfirmation = false; // Reset if we need an ID
      return `__PROMPT_EMPLOYEE_ID__Almost there! Please provide your **Employee ID**.`;
    }
    
    // If all IDs are present, set awaitingConfirmation to true and return the confirmation prompt
    this.awaitingConfirmation = true;
    return `
Summary: ${this.currentEnhancedText.summary}

Accomplishments:
${this.currentEnhancedText.keyAccomplishments.map(a => `- ${a}`).join('\n')}

**Week ID:** ${this.currentEnhancedText.weekId}
**Project ID:** ${this.currentEnhancedText.projectId}
**Employee ID:** ${this.currentEnhancedText.employeeId}

*All IDs present. Reply "Looks good" to save, or tell me what to refine.*`;
  }

  async sendUserInput(
    text: string,
    contextIdType: 'weekId' | 'projectId' | 'employeeId' | null = null,
    contextIdValue: string = ''
  ): Promise<string> {
    this.history.push({ role: 'user', parts: [{ text }] });

    // Handle ID selection from dropdowns
    // If contextIdType and contextIdValue are provided, it means a dropdown selection was made.
    if (contextIdType && contextIdValue && this.currentEnhancedText) {
      this.currentEnhancedText[contextIdType] = contextIdValue;
      // After an ID is set, determine if all are present or if another is needed
      const prompt = this.determineMissingIdAndPrompt();
      // Add the AI's response to history immediately for ID prompts
      this.history.push({ role: 'assistant', parts: [{ text: prompt }] });
      return prompt;
    }

    // If we are awaiting confirmation and the user explicitly confirms
    // This handles the user typing "Looks good" after all IDs are collected.
    if (this.awaitingConfirmation && /looks good|confirm|save|yes|proceed/i.test(text)) {
      if (this.currentEnhancedText && this.currentEnhancedText.weekId && this.currentEnhancedText.projectId && this.currentEnhancedText.employeeId) {
        const result = await this.processEmployeeInfo(this.currentEnhancedText);
        this.history.push({ role: 'assistant', parts: [{ text: result.message }] });
        this.currentEnhancedText = undefined; // Clear the stored data after saving
        this.awaitingConfirmation = false; // Reset confirmation flag
        return result.message;
      } else {
        // Fallback: If for some reason currentEnhancedText is incomplete but awaitingConfirmation is true
        const prompt = this.determineMissingIdAndPrompt();
        this.history.push({ role: 'assistant', parts: [{ text: prompt }] });
        return prompt;
      }
    }

    // Prepare history for API call by removing previous system prompts and adding the current one
    this.history = this.history.filter(item => item.role !== 'system');
 // Inside gemeni-ai.service.ts
this.history.unshift({
  role: 'system',
  parts: [{ text: `
    You are an AI assistant for a professional corporate environment, specializing in employee profile management.
    All your responses should maintain a **formal, concise, and professional tone**, akin to typical corporate communication.
    Use business-appropriate vocabulary and avoid overly casual language.
    When asked to enhance an employee's summary and accomplishments, extract the summary, key accomplishments, and any provided Week ID, Project ID, and Employee ID.
    If any IDs are missing after an an enhancement request, you must explicitly prompt the user for them using the prefixes:
    - __PROMPT_WEEK_ID__ for Week ID
    - __PROMPT_PROJECT_ID__ for Project ID
    - __PROMPT_EMPLOYEE_ID__ for Employee ID
    Once all IDs are gathered and the profile is ready for saving, present the full enhanced information clearly and formally, and explicitly ask the user to confirm by stating "Please confirm if this information is accurate for saving." or similar formal confirmation.
    Do not proceed with saving until explicit confirmation is received (e.g., "confirm", "looks good", "save", "yes", "proceed").
    Upon confirmation, you will proceed to save the data using the 'processEmployeeInfo' method.
    If a request is for general text formatting, use the 'formatText' tool and ensure the formatted output is presented professionally.
    `
  }]
});

    const enhanceFn: FunctionDeclaration = {
      name: 'enhanceEmployeeInfo',
      description: `Enhance a summary and accomplishments for an employee profile.`,
      parameters: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: 'Polished summary in Markdown.' },
          keyAccomplishments: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Polished list of accomplishments.'
          },
          weekId: { type: Type.STRING, description: 'Week ID (e.g., "Week 3")' },
          projectId: { type: Type.STRING, description: 'Project ID (e.g., "PROJ-ALPHA")' },
          employeeId: { type: Type.STRING, description: 'Employee ID (e.g., "EMP001")' }
        },
        required: ['summary', 'keyAccomplishments']
      }
    };

    const formatFn: FunctionDeclaration = {
      name: 'formatText',
      description: `General text formatting.`,
      parameters: {
        type: Type.OBJECT,
        properties: {
          originalText: { type: Type.STRING, description: 'Original.' },
          formattedText: { type: Type.STRING, description: 'Formatted.' }
        },
        required: ['originalText', 'formattedText']
      }
    };

    const confirmFn: FunctionDeclaration = {
      name: 'confirmEnhancement',
      description: `Confirm & save enhanced profile. This tool should be called by the AI only after the user has explicitly confirmed saving the data, and all weekId, projectId, and employeeId are present.`,
      parameters: {
        type: Type.OBJECT,
        properties: {
          weekId: { type: Type.STRING, description: 'Week ID' },
          projectId: { type: Type.STRING, description: 'Project ID' },
          employeeId: { type: Type.STRING, description: 'Employee ID' }
        },
        required: ['weekId', 'projectId', 'employeeId']
      }
    };

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: this.sanitizeHistoryForApi(),
      config: {
        tools: [{ functionDeclarations: [enhanceFn, formatFn, confirmFn] }],
        toolConfig: { functionCallingConfig: { mode: FunctionCallingConfigMode.AUTO } }
      }
    });

    const fc = response.functionCalls?.[0];
    console.log("Function Call:", fc);

    if (fc) {
      const args: any = fc.args;
      switch (fc.name) {
        case 'enhanceEmployeeInfo':
          this.currentEnhancedText = {
            summary: args.summary,
            keyAccomplishments: args.keyAccomplishments || [],
            weekId: args.weekId,
            projectId: args.projectId,
            employeeId: args.employeeId
          };
          // After extracting initial info, determine the next step (ask for missing IDs or confirmation)
          const promptForEnhance = this.determineMissingIdAndPrompt();
          this.history.push({ role: 'function', name: fc.name, parts: [{ functionResponse: { name: fc.name, response: this.currentEnhancedText } }] });
          this.history.push({ role: 'assistant', parts: [{ text: promptForEnhance }] });
          return promptForEnhance;

        case 'formatText':
          const formattedText = args.formattedText;
          this.history.push({ role: 'function', name: fc.name, parts: [{ functionResponse: { name: fc.name, response: { formattedText } } }] });
          const replyMd = `**Here's the formatted text:**\n\n${formattedText}`;
          this.history.push({ role: 'assistant', parts: [{ text: replyMd }] });
          this.currentEnhancedText = undefined; // Clear the state if it's just formatting
          this.awaitingConfirmation = false; // Reset confirmation flag
          return replyMd;

        case 'confirmEnhancement':
          // This case should ideally be hit if the model itself decides to call confirmEnhancement
          // after a user's confirmation (e.g., "Looks good").
          // However, our direct text-matching logic above is more robust for user confirmation.
          // We'll process it here as a fallback or for model-initiated calls.
          if (!this.currentEnhancedText || !this.currentEnhancedText.weekId || !this.currentEnhancedText.projectId || !this.currentEnhancedText.employeeId) {
            this.awaitingConfirmation = false;
            return `❌ Cannot confirm: Missing some IDs. Please provide all details or re-enter the profile.`;
          }
          // The currentEnhancedText should already have the latest IDs from previous steps
          const resultConfirm = await this.processEmployeeInfo(this.currentEnhancedText);
          this.history.push({ role: 'function', name: fc.name, parts: [{ functionResponse: { name: fc.name, response: this.currentEnhancedText } }] }); // Log tool call
          this.history.push({ role: 'assistant', parts: [{ text: resultConfirm.message }] });
          this.currentEnhancedText = undefined;
          this.awaitingConfirmation = false;
          return resultConfirm.message;

        default:
          break;
      }
    }

    // Fallback for general text responses from the AI
    const textResp = response.text || '';
    this.history.push({ role: 'assistant', parts: [{ text: textResp }] });
    
    // If AI provides a general response while we were awaiting confirmation, 
    // it implies the user might be refining, so we don't automatically clear context yet.
    // Only clear if the conversation clearly shifts away from enhancement or IDs.
    if (this.currentEnhancedText && !this.awaitingConfirmation && !/summary|accomplishments|profile|week id|project id|employee id/i.test(text)) {
      // If we are not awaiting confirmation, and the user's input isn't related to the enhancement flow,
      // then clear the currentEnhancedText. This prevents carrying over old context unnecessarily.
      this.currentEnhancedText = undefined;
    }
    return textResp;
  }
}