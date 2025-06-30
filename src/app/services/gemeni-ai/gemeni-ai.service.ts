import { Injectable } from '@angular/core';
import { GoogleGenAI, FunctionDeclaration, FunctionCallingConfigMode, Type } from '@google/genai';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GemeniAiService {
  private ai = new GoogleGenAI({ apiKey: 'AIzaSyAaGaav8HmOznjdOazOUNuSz-ZiBKgmSUA' }); // replace with your key
  private history: any[] = [];

  constructor(private http: HttpClient) {}

  private sanitizeHistoryForApi() {
    return this.history.map(item => {
      let role = item.role;
      // Only allow 'user' and 'model' roles, convert others to 'model'
      if (role !== 'user' && role !== 'model') {
        role = 'model';
      }
  
      // Preserve other properties as is
      return {
        ...item,
        role,
      };
    });
  }
  
  // Tool: transform and relay employee info
  private async processEmployeeInfo(args: { rawText: string }): Promise<{ status: string; message: string }> {
    const raw = args.rawText;

    const summaryMatch = raw.match(/summary\s*[:\-]\s*([^,]*)/i);
    const accomplishmentsMatch = raw.match(/key\s*accomplishments\s*[:\-]\s*([\s\S]*)/i);

    const summary = summaryMatch ? [summaryMatch[1].trim()] : [];
    const keyAccomplishments = accomplishmentsMatch
      ? accomplishmentsMatch[1].split(/and|,|\n/).map((s) => s.trim()).filter(Boolean)
      : [];

    const corpSummary = summary.map((s) => s.charAt(0).toUpperCase() + s.slice(1));
    const corpAccomplishments = keyAccomplishments.map((a) => a.charAt(0).toUpperCase() + a.slice(1));

    const payload = { summary: corpSummary, keyAccomplishments: corpAccomplishments };

    try {
      const response = await (this.http.post<any>('http://localhost:3000/updateSummary', payload));
      return {
        status: 'success',
        message: 'Updated successfully',
      };
    } catch (err: any) {
      return { status: 'error', message: err.message ?? 'API call failed' };
    }
  }

  async sendUserInput(text: string) {
    const processEmployeeInfoDecl: FunctionDeclaration = {
      name: 'processEmployeeInfo',
      description: 'Parse raw employee task info into JSON, post to backend, return status',
      parameters: {
        type: Type.OBJECT,
        properties: {
          rawText: { type: Type.STRING, description: 'Employee input with summary/key accomplishments' },
        },
        required: ['rawText'],
      },
    };

    // Add user input to history
    this.history.push({ role: 'user', parts: [{ text }] });

    // Detect structured input to trigger function calling
    const isStructuredInput = /summary\s*[:]|key\s*accomplishments\s*[:]/i.test(text);

    const config = {
      tools: [{ functionDeclarations: [processEmployeeInfoDecl] }],
      toolConfig: {
        functionCallingConfig: {
          mode: isStructuredInput ? FunctionCallingConfigMode.AUTO : FunctionCallingConfigMode.NONE,
          allowedFunctionNames: isStructuredInput ? ['processEmployeeInfo'] : [],
        },
      },
    };
    

    // Pass the full history for context
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-pro',
    //  contents: this.history,
      contents: this.sanitizeHistoryForApi(),
      config,
    });

    if (response.functionCalls?.length) {
      const call = response.functionCalls[0];
      const args = call.args as { rawText: string };

      // Call your local tool function
      const toolResult = await this.processEmployeeInfo(args);

      // Add the function call turn to history
      this.history.push({
        role: 'function',
        name: call.name,
        parts: [
          {
            functionResponse: {
              name: call.name,
              response: toolResult,
            },
          },
        ],
      });

      // Now ask Gemini to respond again with function output context
      const finalResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: this.history,
      });

      // Add assistant reply to history
      this.history.push({ role: 'assistant', parts: [{ text: finalResponse.text }] });
      console.log('Assistant final response:', finalResponse.text);
      return finalResponse.text;
    } else {
      // No function call: normal chat response
      this.history.push({ role: 'assistant', parts: [{ text: response.text }] });
      console.log('Assistant response:', response.text);
      return response.text;
    }
  }
}
