// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import { Injectable } from '@angular/core';
import {
    GoogleGenAI,
  } from '@google/genai';
  
  @Injectable({
    providedIn: 'root'
  })


  export class GENAI{
    async  main() {
        const ai = new GoogleGenAI({
          apiKey: 'AIzaSyAaGaav8HmOznjdOazOUNuSz-ZiBKgmSUA',
        });
        const config = {
          thinkingConfig: {
            thinkingBudget: -1,
          },
          responseMimeType: 'text/plain',
        };
        const model = 'gemini-2.5-pro';
        const contents = [
          {
            role: 'user',
            parts: [
              {
                text: `whats the whether today in hyderabad`,
              },
            ],
          },
        ];
      
        const response = await ai.models.generateContentStream({
          model,
          config,
          contents,
        });
        let fileIndex = 0;
        for await (const chunk of response) {
          console.log(chunk.text);
        }
      }

  }

  

  