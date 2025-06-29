import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GemeniAiService {
  explanation: string = '';
  error: string = '';

  // IMPORTANT: Replace with your actual API key.
  // Consider securing this in a real application (e.g., via a backend proxy).
  private readonly API_KEY = 'AIzaSyAaGaav8HmOznjdOazOUNuSz-ZiBKgmSUA';
  private readonly API_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models?key=${this.API_KEY}`;

  // Note: 'gemini-2.0-flash' might not be directly available via the public API endpoint
  // without specific access. 'gemini-pro' is a commonly available model.
  // Adjust the model name if you have access to others.

  constructor(private http: HttpClient) {}

  getAIExplanation(d:any): void {
    this.explanation = 'Loading...';
    this.error = '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      
    });

    const body = {
      contents: [{ parts: [{ text: d }] }],
    };

    this.http.post<any>(this.API_ENDPOINT, body, { headers }).subscribe({
      next: (response) => {
        // The exact structure of the response might vary based on the API version and model.
        // You'll need to inspect the response from the API to get the correct path to the text.
        // For gemini-pro, it's often response.candidates[0].content.parts[0].text
        if (
          response &&
          response.candidates &&
          response.candidates.length > 0 &&
          response.candidates[0].content &&
          response.candidates[0].content.parts &&
          response.candidates[0].content.parts.length > 0
        ) {
          return response.candidates[0].content.parts[0].text;
       //   this.explanation = response.candidates[0].content.parts[0].text;
        } else {
          console.warn('Unexpected API response structure:', response);
          return  'Could not parse response.';
        }
      },
      error: (err:any) => {
        console.error('API Error:', err);
        this.error = `Failed to get explanation. Status: ${err.status} - ${err.statusText}`;
        if (err.error && err.error.error && err.error.error.message) {
          this.error += ` Message: ${err.error.error.message}`;
        }
        this.explanation = '';
      },
    });
  }

}
