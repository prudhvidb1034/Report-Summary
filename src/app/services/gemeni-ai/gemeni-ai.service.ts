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
}

// Define the structure for the processEmployeeInfo response
interface ProcessResult {
  status: 'success' | 'error';
  message: string; // This will now be a Markdown string
}

@Injectable({ providedIn: 'root' })
export class GemeniAiService {
  private ai = new GoogleGenAI({ apiKey: 'AIzaSyAaGaav8HmOznjdOazOUNuSz-ZiBKgmSUA' });
  private history: any[] = [];
  private currentEnhancedText: EnhancedText | undefined; // Stores the last generated enhanced text for employee profile

  constructor(private http: HttpClient) {}

  private sanitizeHistoryForApi() {
    return this.history.map(item => ({
      ...item,
      role: item.role === 'user' ? 'user' : 'model'
    }));
  }

  // This method now returns a Promise<ProcessResult> where message is Markdown
  private async processEmployeeInfo(dataToSave: EnhancedText): Promise<ProcessResult> {
    const body = { userName: 'superadmin@gmail.com', password: 'Sarath11@' };
    try {
      await lastValueFrom(this.http.post('https://emp-tcb1.onrender.com/auth/login', body));
      console.log('Simulating saving enhanced employee info:', dataToSave);
      return {
        status: 'success',
        // Return Markdown for the success message
        message: `
          ✅ **Profile Updated!**
          
          **Summary:** ${dataToSave.summary}
          
          **${dataToSave.keyAccomplishments.length} accomplishment(s) saved.**
        `
      };
    } catch (err: any) {
      return {
        status: 'error',
        // Return Markdown for the error message
        message: `
          ❌ **Update Failed:** ${err.message || 'Unknown error'}
        `
      };
    }
  }

  // Removed formatEnhancedTextAsHtml and formatGeneralTextAsHtml
  // because the service will now return raw Markdown strings,
  // and the Angular component will handle the conversion to HTML.

  async sendUserInput(text: string): Promise<string> {
    // Add user's latest input to history
    this.history.push({ role: 'user', parts: [{ text }] });

    // Define function for enhancing employee profile text
    const enhanceEmployeeInfoFn: FunctionDeclaration = {
      name: 'enhanceEmployeeInfo',
      description: 'Rewrites and polishes user-provided summary and key accomplishments into a single, best corporate-tone version for an employee profile. Use this for initial input or subsequent refinements of profile-related text. This function is specifically for employee profile data. The generated summary and accomplishments should be in Markdown format.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: 'The polished and enhanced summary in Markdown format.' },
          keyAccomplishments: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'The polished and enhanced key accomplishments, each as a Markdown string.'
          }
        },
        required: ['summary', 'keyAccomplishments']
      }
    };

    // Define function for general text formatting
    const formatTextFn: FunctionDeclaration = {
      name: 'formatText',
      description: 'Formats, rephrases, or rewrites a given piece of text based on user instructions. The output will be in Markdown format. Use this for general text rephrasing or sentence correction. Do NOT use this for employee profile summaries or accomplishments.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          originalText: { type: Type.STRING, description: 'The original text provided by the user to be formatted.' },
          formattedText: { type: Type.STRING, description: 'The rewritten or formatted version of the text in Markdown format.' }
        },
        required: ['originalText', 'formattedText']
      }
    };

    // Define function for confirming and saving the enhanced employee profile text
    const confirmEnhancementFn: FunctionDeclaration = {
      name: 'confirmEnhancement',
      description: 'Confirms that the user is satisfied with the current enhanced *employee profile* text and triggers the save process. Call this ONLY when the user explicitly approves the profile text (e.g., "Looks good", "Save this", "Yes").',
      parameters: {
        type: Type.OBJECT,
        properties: {} // No parameters needed for confirmation
      }
    };

    // --- System Prompt Management ---
    // Ensure the system prompt is always the very first message in the history when sent to the API.
    this.history = this.history.filter(item => item.role !== 'system');
    this.history.unshift({
      role: 'system',
      parts: [{
        text: `
        You are a versatile and polite writing assistant.
        
        **Your primary goal is to understand user intent accurately.**
        **All your text responses, whether directly generated by you or returned within function results (like 'formattedText' or 'summary'/'keyAccomplishments'), should use Markdown for formatting (e.g., **bold**, *italics*, - list items, ## headings, \`code\`).**
        
        **Instructions for Function Calling:**
        
        1.  **General Conversation:** If the user is simply greeting you (e.g., "hello", "hi", "how are you?"), asking a general question (e.g., "What is the capital of France?"), or making a statement that does NOT require text formatting or profile enhancement, respond naturally *without calling any function*.
        
        2.  **Employee Profile Enhancement:**
            -   If the user provides input clearly related to their 'summary' or 'key accomplishments' (e.g., "summary: I am a software engineer.", "my accomplishments are...", "can you polish my profile?"), or asks to refine *previously provided profile text*, use the 'enhanceEmployeeInfo' function.
            -   When calling 'enhanceEmployeeInfo', provide the 'summary' and 'keyAccomplishments' as polished Markdown text.
            -   When the user explicitly approves the *employee profile* text (e.g., "Looks good", "Save it", "Confirm", "Yes, save this profile"), call the 'sa' function.
            -   when the user expilicity mention want to save without modification(e.g., "summary:I worked on some task ", "my accomplishments are..." ,Please use this only) 'ads' function.
        3.  **General Text Formatting/Rewriting:**
            -   If the user asks to format, rephrase, or correct *any other general text* (e.g., "format this sentence", "rephrase this paragraph", "correct my grammar in 'I work here'"), use the 'formatText' function. Do NOT use 'enhanceEmployeeInfo' for general text.
            -   When calling 'formatText', provide the 'formattedText' as polished Markdown text.
            
        **Important:** Always provide the best possible professional rewrite for any request. Prioritize calling the most appropriate function *only when explicitly needed*. If no specific function applies, respond conversationally.
        `
      }]
    });


    // Build the content for the AI.
    let currentContents = this.sanitizeHistoryForApi();

    // If there's an existing enhanced *employee profile* text and the user is asking for refinement,
    // and the input is NOT a confirmation, then provide context for refinement.
    if (this.currentEnhancedText && text && !/^(looks good|save|confirm|yes)$/i.test(text.trim())) {
        const lastUserMessageIndex = currentContents.length - 1;
        if (currentContents[lastUserMessageIndex]?.role === 'user' && currentContents[lastUserMessageIndex]?.parts?.[0]?.text === text) {
             currentContents[lastUserMessageIndex] = {
                 role: 'user',
                 parts: [{
                     text: `Considering the current employee profile text (Summary: "${this.currentEnhancedText.summary}", Key Accomplishments: ${this.currentEnhancedText.keyAccomplishments.map(a => `"${a}"`).join('; ')}). Please refine it based on my new request: "${text}"`
                 }]
             };
        }
    }


    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: currentContents,
      config: {
        tools: [{ functionDeclarations: [enhanceEmployeeInfoFn, formatTextFn, confirmEnhancementFn] }],
        toolConfig: {
          functionCallingConfig: { mode: FunctionCallingConfigMode.AUTO }
        }
      }
    });

    // --- Process Function Calls or Text Response ---
    const fc = response.functionCalls?.[0];

    if (fc) {
      if (fc.name === 'enhanceEmployeeInfo') {
        const args: any = fc.args;
        this.currentEnhancedText = {
          summary: args.summary, // This is expected to be Markdown from the AI
          keyAccomplishments: args.keyAccomplishments || [] // These are expected to be Markdown
        };

        // Construct a Markdown string to return to the component for display
        const responseMarkdown = `
          
          Summary: ${this.currentEnhancedText.summary}
          
          Accomplishments:
          ${this.currentEnhancedText.keyAccomplishments.map(a => `${a}`).join('\n')}
          
          *Reply "Looks good" to save, or tell me how to refine it.*
        `;

        this.history.push({
          role: 'function',
          name: 'enhanceEmployeeInfo',
          parts: [{ functionResponse: { name: 'enhanceEmployeeInfo', response: this.currentEnhancedText } }]
        });
        this.history.push({ role: 'assistant', parts: [{ text: responseMarkdown }] }); // Store Markdown in history
        return responseMarkdown; // Return Markdown to the component
      } else if (fc.name === 'formatText') {
        const args: any = fc.args;
        const formattedTextMarkdown = args.formattedText; // This is expected to be Markdown

        // Construct a Markdown string to return to the component for display
        const responseMarkdown = `
          **Here's the formatted text:**
          
          ${formattedTextMarkdown}
        `;

        this.history.push({
          role: 'function',
          name: 'formatText',
          parts: [{ functionResponse: { name: 'formatText', response: { formattedText: formattedTextMarkdown } } }]
        });
        this.history.push({ role: 'assistant', parts: [{ text: responseMarkdown }] }); // Store Markdown in history
        this.currentEnhancedText = undefined; // Clear as this is general formatting
        return responseMarkdown; // Return Markdown to the component
      } else if (fc.name === 'confirmEnhancement') {
        if (this.currentEnhancedText) {
          const result = await this.processEmployeeInfo(this.currentEnhancedText); // This now returns { status, message: Markdown }
          this.history.push({
            role: 'function',
            name: 'confirmEnhancement',
            parts: [{ functionResponse: { name: 'confirmEnhancement', response: result } }]
          });
          this.history.push({ role: 'assistant', parts: [{ text: result.message }] }); // Store Markdown in history
          this.currentEnhancedText = undefined; // Clear after successful save
          return result.message; // Return Markdown message
        } else {
          return `❌ *No enhanced employee profile text available to confirm. Please provide some profile input first (e.g., 'summary: ...', 'key accomplishments: ...').*`; // Return Markdown
        }
      }
    } else if (response.text) {
      // Fallback for general chat or if the model doesn't call a function
      const responseMarkdown = response.text; // AI's direct response is expected to be Markdown
      this.history.push({ role: 'assistant', parts: [{ text: responseMarkdown }] });
      // Heuristic to clear currentEnhancedText if the conversation shifts away from profile topics
      if (this.currentEnhancedText && !/summary|accomplishments|profile/i.test(text)) {
         this.currentEnhancedText = undefined;
      }
      return responseMarkdown; // Return raw Markdown
    }

    // Default return for unhandled scenarios, ensure it's Markdown
    return `*An unexpected error occurred or the request could not be processed.*`;
  }
}