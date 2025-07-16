import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Marked } from 'marked'; // Import Marked

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private marked = new Marked(); // Initialize Marked instance

  constructor(private sanitizer: DomSanitizer) {
    this.marked.setOptions({
      gfm: true, // Use GitHub Flavored Markdown
      breaks: true, // Render <br> tags for newlines
      // Other options like highlight, sanitize, etc., can be set here
    });
  }


  convertToHtml(markdownText: string): SafeHtml {
    const htmlString = this.marked.parse(markdownText) as string;
    return htmlString
  }
}