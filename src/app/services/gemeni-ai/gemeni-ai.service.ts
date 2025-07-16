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
  private ai = new GoogleGenAI({ apiKey: 'AIzaSyAaGaav8HmOznjdOazOUNuSz-ZiBKgmSUA' });
  private history: any[] = [];
  private currentEnhancedText?: EnhancedText;

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
      return `❌ Error: No profile data. Please provide summary & accomplishments first.`;
    }
    if (!this.currentEnhancedText.weekId) {
      return `__PROMPT_WEEK_ID__I can enhance your profile, but need the **Week ID**. Please select it.`;
    }
    if (!this.currentEnhancedText.projectId) {
      return `__PROMPT_PROJECT_ID__Great! Now I need the **Project ID**. Please select it.`;
    }
    if (!this.currentEnhancedText.employeeId) {
      return `__PROMPT_EMPLOYEE_ID__Almost there! Please provide your **Employee ID**.`;
    }
    return `__PROMPT_WEEK_ID__I still need some IDs. Please provide the Week ID.`;
  }

  async sendUserInput(
    text: string,
    contextIdType: 'weekId' | 'projectId' | 'employeeId' | null = null,
    contextIdValue: string = ''
  ): Promise<string> {
    this.history.push({ role: 'user', parts: [{ text }] });

    if (contextIdType && contextIdValue && this.currentEnhancedText) {
      this.currentEnhancedText[contextIdType] = contextIdValue;
      if (
        this.currentEnhancedText.weekId &&
        this.currentEnhancedText.projectId &&
        this.currentEnhancedText.employeeId
      ) {
        const result = await this.processEmployeeInfo(this.currentEnhancedText);
        this.history.push({ role: 'assistant', parts: [{ text: result.message }] });
        this.currentEnhancedText = undefined;
        return result.message;
      } else {
        return this.determineMissingIdAndPrompt();
      }
    }

    this.history = this.history.filter(item => item.role !== 'system');
    this.history.unshift({
      role: 'system',
      parts: [{ text: `... your system prompt here ...` }]
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
      description: `Confirm & save enhanced profile. Requires all IDs.`,
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
          if (
            this.currentEnhancedText.weekId &&
            this.currentEnhancedText.projectId &&
            this.currentEnhancedText.employeeId
          ) {
            const md = `
Summary: ${this.currentEnhancedText.summary}

Accomplishments:
${this.currentEnhancedText.keyAccomplishments.map(a => `- ${a}`).join('\n')}

**Week ID:** ${this.currentEnhancedText.weekId}
**Project ID:** ${this.currentEnhancedText.projectId}
**Employee ID:** ${this.currentEnhancedText.employeeId}

*All IDs present. Reply "Looks good" to save, or tell me what to refine.*`;
            this.history.push({ role: 'function', name: fc.name, parts: [{ functionResponse: { name: fc.name, response: this.currentEnhancedText } }] });
            this.history.push({ role: 'assistant', parts: [{ text: md }] });
            return md;
          }
          return this.determineMissingIdAndPrompt();

        case 'formatText':
          const formattedText = args.formattedText;
          this.history.push({ role: 'function', name: fc.name, parts: [{ functionResponse: { name: fc.name, response: { formattedText } } }] });
          const replyMd = `**Here's the formatted text:**\n\n${formattedText}`;
          this.history.push({ role: 'assistant', parts: [{ text: replyMd }] });
          this.currentEnhancedText = undefined;
          return replyMd;

        case 'confirmEnhancement':
          if (!this.currentEnhancedText) {
            return `❌ No enhanced profile to confirm. Please provide summary first.`;
          }
          this.currentEnhancedText = {
            ...this.currentEnhancedText,
            weekId: args.weekId,
            projectId: args.projectId,
            employeeId: args.employeeId
          };
          const result = await this.processEmployeeInfo(this.currentEnhancedText);
          this.history.push({ role: 'assistant', parts: [{ text: result.message }] });
          this.currentEnhancedText = undefined;
          return result.message;

        default:
          break;
      }
    }

    // fallback
    const textResp = response.text || '';
    this.history.push({ role: 'assistant', parts: [{ text: textResp }] });
    if (this.currentEnhancedText && !/summary|accomplishments|profile|week id|project id|employee id/i.test(text)) {
      this.currentEnhancedText = undefined;
    }
    return textResp;
  }
}
