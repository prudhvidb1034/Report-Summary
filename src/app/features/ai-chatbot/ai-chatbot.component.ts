import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GemeniAiService } from '../../services/gemeni-ai/gemeni-ai.service';
import { GemeniUpdatedAIService } from '../../services/gemeni-ai/gemeni-updated-ai-service';
import { GENAI } from '../../services/gemeni-ai/gemeni-geni-service';

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [IonicModule,CommonModule,FormsModule],
  templateUrl: './ai-chatbot.component.html',
  styleUrl: './ai-chatbot.component.scss'
})
export class AiChatbotComponent {

  userInput: string = '';
  messages: { text: string; type: 'user' | 'ai' }[] = [];
  res:any;

  constructor(private http:HttpClient,private aiService:GemeniAiService,private updatedGemeniAI:GemeniUpdatedAIService,private genAi:GENAI){}

  submitQuestion(): void {
    this.aiService.sendUserInput(this.userInput);
   // this.updatedGemeniAI.main();
    // if (this.userInput.trim()) {
    //   // Append user's question
    //   this.messages.push({ text: `You: ${this.userInput}`, type: 'user' });
    //    this.res=this.aiService.getAIExplanation(this.userInput);
    //   if(this.res){
    //     this.messages.push({ text: this.res, type: 'ai' });
    //   }
    //   const params=this.userInput
    //   // this.http.get('/api/gemini'+'/'+this.userInput).subscribe((data:any)=>{
    //   //   if(data){
    //   //     this.messages.push({ text: data.response, type: 'ai' });
    //   //   }

    //   //   });
    //   console.log(this.userInput);
    //  // this.http.post('http://localhost:3000/gemeni','')
    //   // Simulate AI response (you would replace this with actual AI logic)
    //   const aiResponse = "AI: This is a simulated response to your question.";
    // //  this.messages.push({ text: aiResponse, type: 'ai' });

    //   // Clear the input field
    //   this.userInput = '';
    // }
   // this.messages.push({ text: 'Iam an AI ', type: 'ai' });
  }



}
