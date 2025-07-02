import { Injectable } from '@angular/core';
import {
  GoogleGenAI,
  FunctionDeclaration,
  FunctionCallingConfigMode,
  Type
} from '@google/genai';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

interface RewriteOption {
  summary: string;
  keyAccomplishments: string[];
}

@Injectable({ providedIn: 'root' })
export class GemeniAiService {
  private ai = new GoogleGenAI({ apiKey: 'AIzaSyAaGaav8HmOznjdOazOUNuSz-ZiBKgmSUA' });
  private history: any[] = [];
  private pendingOptions?: RewriteOption[];

  constructor(private http: HttpClient) {}


 private sanitizeHistoryForApi() {
    return this.history.map(item => ({
      ...item,
      role: item.role === 'user' ? 'user' : 'model'
    }));
  }

  private async processEmployeeInfo(option: RewriteOption) {
    const body = { userName: 'superadmin@gmail.com', password: 'Sarath11@' };
    try {
      await lastValueFrom(this.http.post('https://emp-tcb1.onrender.com/auth/login', body));
      return {
        status: 'success',
        message: `
          <div style="padding:12px; border:1px solid green; background:#eaffea; border-radius:4px;">
            ✅ <strong>Updated!</strong><br/>
            <p><strong>Summary:</strong> ${option.summary}</p>
            <p><strong>${option.keyAccomplishments.length} accomplishment(s) saved.</strong></p>
          </div>`
      };
    } catch (err: any) {
      return {
        status: 'error',
        message: `
          <div style="padding:12px; border:1px solid red; background:#ffeaea; border-radius:4px;">
            ❌ <strong>Update Failed:</strong> ${err.message || 'Unknown error'}
          </div>`
      };
    }
  }

  private formatOptionsAsHtml(options: RewriteOption[]) {
    return `
      <div style="text-align:left; margin:12px;">
        <p><strong>Select one option:</strong></p>
        ${options.map((opt, i) => `
        <div style="padding:8px; margin-bottom:8px; border:1px solid #ddd; border-radius:4px;">
          <h3 style="margin:0;border-bottom:1px solid #ddd;padding-bottom:4px;">Option ${i + 1}</h3>
          <p><strong>Summary:</strong> ${opt.summary}</p>
          <p><strong>Accomplishments:</strong></p>
          <ul>${opt.keyAccomplishments.map(a => `<li>${a}</li>`).join('')}</ul>
        </div>`).join('')}
        <p style="font-style:italic;">Type <code>Option N</code> to pick.</p>
      </div>`;
  }

  async sendUserInput(text: string): Promise<string> {
    this.history.push({ role: 'user', parts: [{ text }] });

    // 1️⃣ Handle option selection
    if (this.pendingOptions) {
      const match = text.match(/option\s*[-\s:]*?(\d+)/i);
      if (match) {
        const idx = parseInt(match[1], 10) - 1;
        const chosen = this.pendingOptions[idx];
        if (chosen) {
          const result = await this.processEmployeeInfo(chosen);
          this.pendingOptions = undefined;
          this.history.push({
            role: 'function',
            name: 'processEmployeeInfo',
            parts: [{ functionResponse: { name: 'processEmployeeInfo', response: result } }]
          });
          this.history.push({ role: 'assistant', parts: [{ text: result.message }] });
          return result.message;
        }
        return `<p style="color:red;">❌ Invalid option—please select Option 1, 2, 3, etc.</p>`;
      }
    }

    // 2️⃣ Initiate rewrite flow if input is structured
    if (/summary\s*[:]|key\s*accomplishments\s*[:]/i.test(text)) {
      this.history.unshift({
        role: 'system',
        parts: [{
          text: `
You are a corporate writing assistant. When given user's raw summary and key accomplishments, rewrite them into 4-5 polished corporate-tone variants formatted in HTML. Wrap each option in:
<div class="option"><h3>Option N</h3><p>Summary…</p><ul><li>…</li></ul></div>
Then return via function call generateRewriteOptions with JSON including rawSummary, rawAccomplishments, and options (array with summary & keyAccomplishments fields).`
        }]
      });

      const fnDecl: FunctionDeclaration = {
        name: 'generateRewriteOptions',
        description: 'Generate 4-5 polished rewrite options (HTML ready)',
        parameters: {
          type: Type.OBJECT,
          properties: {
            rawSummary: { type: Type.STRING },
            rawAccomplishments: { type: Type.ARRAY, items: { type: Type.STRING } },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  summary: { type: Type.STRING },
                  keyAccomplishments: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          },
          required: ['rawSummary', 'rawAccomplishments', 'options']
        }
      };

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: this.sanitizeHistoryForApi(),
        config: {
          tools: [{ functionDeclarations: [fnDecl] }],
          toolConfig: {
            functionCallingConfig: { mode: FunctionCallingConfigMode.ANY, allowedFunctionNames: ['generateRewriteOptions'] }
          }
        }
      });

      const fc = response.functionCalls?.[0];
      if (fc) {
        const args: any = fc.args;
        if (Array.isArray(args.options)) {
          this.pendingOptions = args.options as RewriteOption[];
          const html = this.formatOptionsAsHtml(this.pendingOptions);
          this.history.push({ role: 'assistant', parts: [{ text: html }] });
          return html;
        }
      }
    }

    // 3️⃣ Regular chat fallback
    const chat = await this.ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: this.sanitizeHistoryForApi()
    });
    const responseHtml = `<p style="margin:12px;">${chat.text}</p>`;
    this.history.push({ role: 'assistant', parts: [{ text: responseHtml }] });
    return responseHtml;
  }
}
