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
  export class GemeniUpdatedAIService{

    async  processEmployeeInfo(args: { rawText: string }): Promise<any> {
        console.log(`Tool: Processing employee info for text: "${args.rawText}"`);
      
        // --- Simulate AI's role in forming JSON and backend API call ---
        // In a real scenario, the AI model, possibly fine-tuned,
        // would be responsible for generating the JSON structure.
        // The tool here simply acts as the bridge to the *backend* for that data.
      
        // For demonstration, let's assume the AI provides the JSON structure
        // implicitly or explicitly in its reasoning leading to the tool call.
        // Here, we are simulating the backend receiving the text and
        // returning a success status after processing.
      
        // In a real scenario, your backend would:
        // 1. Receive args.rawText
        // 2. Potentially call your fine-tuned Gemini model (if not already done by the main model)
        //    to get the structured JSON (summary, keyAccomplishments)
        // 3. Store this JSON in a database
        // 4. Return a success/failure status.
      
        const simulatedResponse = {
          status: 'success',
          message: `Employee information for "${args.rawText}" processed and sent to backend successfully.`,
          // You could also return the parsed JSON if the backend provides it back
          // generatedSummary: { summary: "...", keyAccomplishments: "..." }
        };
      
        console.log('Tool response:', simulatedResponse);
        return simulatedResponse;
      }
      

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
                text: ` i need an ai for my project to access`,
              },
            ],
          },
          {
            role: 'model',
            parts: [
              {
                text: `**Dissecting the Core Request**
      
      I'm currently breaking down the user's initial prompt, specifically their core need and the desired action.  I am trying to map out a logical path to deliver the most helpful response. The ambiguity is providing a challenge but an opportunity to explore multiple solutions and frameworks.
      
      
      **Clarifying the Landscape**
      
      I am now focusing on providing a structured landscape of AI options, starting with accessibility. I've begun organizing the solutions into logical categories: no-code/low-code tools, API usage, and model training. My aim is to make the information helpful for various user skill levels and project scopes. I'm prioritizing clarity and practical application.
      
      
      **Analyzing User Requirements**
      
      I've been meticulously refining the user's implicit needs. Recognizing the broad nature of "AI for a project," I'm currently focusing on the implied requirement for practical, actionable guidance. I am aiming to offer a concise set of options that the user can explore. I'm focusing on simplicity to ensure accessibility.
      
      
      **Mapping User Intent**
      
      I am now focusing on determining the user's technical proficiency and project scope. The user's goal could require simpler, easily accessible solutions or more sophisticated options. I'm moving toward providing tailored AI access recommendations. The intention is to avoid overwhelming with options.
      
      
      **Defining User Intent**
      
      I'm now determining what the user is most likely hoping to achieve. Do they need an instant tool, or a deep dive? Do they have technical chops or require a guided hand? My focus is providing clarity on this potential spectrum of technical skills and desired project outcomes. I will attempt to steer the response toward the best path.
      
      
      **Defining the Scope**
      
      I'm now determining how detailed the user's need for "AI" is, and the degree of assistance they expect. I am focusing on offering a more refined set of pathways based on probable project scopes. The aim is to create a more relevant response.
      
      
      **Refining the Categorization**
      
      I'm now refining the categories to make them more immediately accessible. I'm focusing on "Easy Entry," "Versatile API Access," and "Advanced Control" to guide the user intuitively. I'm prioritizing the presentation of the more popular APIs.
      
      
      **Defining the Structure**
      
      My focus has shifted to the actual structure of the response. I'm now crafting a clear pathway for the user, starting with an introductory question to gather context and leading them through progressively complex options: easy tools, API use, and open-source models. The intention is to enable a more personalized and effective experience.
      
      
      **Formulating a Response Framework**
      
      I am now focusing on providing a structured landscape of AI options, starting with accessibility. I've begun organizing the solutions into logical categories: no-code/low-code tools, API usage, and model training. My aim is to make the information helpful for various user skill levels and project scopes. I'm prioritizing clarity and practical application.
      
      
      `,
              },
              {
                text: `Of course! "Accessing an AI for your project" can mean many different things, from using a simple no-code tool to building a complex application with a powerful API.
      
      To give you the best recommendation, I need to know a little more about your project. Please tell me:
      
      1.  **What is your project's main goal?** (e.g., building a chatbot, analyzing text, generating images, summarizing documents, creating a virtual assistant?)
      2.  **What is your technical skill level?** (e.g., beginner with no code, a developer comfortable with APIs, a data scientist?)
      3.  **What is your budget?** (Are you looking for free options, willing to pay-as-you-go, or have a fixed budget?)
      
      In the meantime, here is a guide to the most common ways to access AI, broken down by difficulty and use case.
      
      ---
      
      ### Path 1: The Easiest Way (No-Code / Low-Code Tools)
      This is perfect for beginners, quick prototypes, or integrating AI into existing workflows without writing any code.
      
      *   **What it is:** Using web-based platforms that have AI features built-in.
      *   **Pros:** Very easy to start, visual interface, no programming required.
      *   **Cons:** Less flexible, can be more expensive, you are limited to the platform's features.
      
      **Examples:**
      *   **For Automation:** **Zapier** or **Make.com**. These tools can connect different apps together. They have built-in integrations for OpenAI, Google AI, and others.
          *   *Use Case:* "When I get a new email with 'invoice' in the subject, use AI to summarize it and save the summary to a Google Sheet."
      *   **For Building Chatbots:** **Voiceflow**, **Botpress**, or **Chatfuel**. These are visual builders for creating conversational AI.
          *   *Use Case:* Creating a customer service bot for your website.
      *   **For Content & Data:** Many tools like **Notion AI**, **Canva**, and even **Microsoft 365 Copilot** have AI integrated directly into their products for summarizing, writing, and design.
      
      ---
      
      ### Path 2: The Most Common & Powerful Way (Using AI APIs)
      This is the standard for developers building custom applications. You send a request to an AI provider's server and get a response back.
      
      *   **What it is:** You write code (e.g., in Python, JavaScript) to call a service that runs the AI model for you.
      *   **Pros:** Extremely powerful and flexible, scalable, access to state-of-the-art models.
      *   **Cons:** Requires programming skills, costs can add up based on usage (pay-as-you-go).
      
      **Top AI API Providers:**
      
      | Provider | Key Models | Best For | Getting Started |
      | :--- | :--- | :--- | :--- |
      | **OpenAI** | **GPT-4o, GPT-4, DALL-E 3** | State-of-the-art language tasks, image generation, and general-purpose AI. The industry leader. | Go to the [OpenAI Platform](https://platform.openai.com/), get an API key, and use their "Playground" to test models. |
      | **Google AI** | **Gemini 1.5 Pro** | Excellent for long context, multi-modal (text, image, video) inputs, and deep integration with Google Cloud. | Check out [Google AI Studio](https://aistudio.google.com/) for a free web-based tool or Vertex AI for enterprise use. |
      | **Anthropic** | **Claude 3 (Opus, Sonnet, Haiku)** | Known for its large context window (analyzing huge documents), strong reasoning, and focus on AI safety. | Visit the [Anthropic Console](https://console.anthropic.com/) to start building. |
      | **Amazon (AWS)**| **Bedrock** | A service that gives you API access to models from Anthropic (Claude), Cohere, Meta (Llama), and Amazon's own (Titan). | If you already use AWS, this is the easiest way to integrate multiple models. |
      | **Hugging Face**| **Thousands of models** | A platform hosting a massive library of open-source models. Their Inference API makes it easy to use them. | Great for trying out specialized or open-source models without setting them up yourself. |
      
      ---
      
      ### Path 3: The Full Control Way (Running Open-Source Models)
      This is for those who need maximum control, want to run the AI on their own hardware for privacy, or want to fine-tune a model on their own data.
      
      *   **What it is:** You download a pre-trained open-source AI model and run it on your own computer or server.
      *   **Pros:** Free (you only pay for hardware costs), full privacy and control, highly customizable.
      *   **Cons:** Requires a powerful computer (often with a good GPU), technical expertise, and can be complex to set up.
      
      **How to Get Started:**
      1.  **Find a Model:** **Hugging Face** is the "GitHub for AI models." It's the best place to find and download models.
          *   **Popular Language Models:** Meta's **Llama 3**, Mistral AI's **Mistral 7B** and **Mixtral**, Microsoft's **Phi-3**.
          *   **Popular Image Models:** **Stable Diffusion**.
      2.  **Run it Locally:**
          *   **(Easiest):** Use a tool like **Ollama** or **LM Studio**. They provide a simple desktop application to download and run popular models with one click.
          *   **(Developer):** Use Python with libraries like \`transformers\` (from Hugging Face), \`PyTorch\`, or \`TensorFlow\`.
      
      ### Your Next Step
      
      Based on the paths above, tell me a bit more about your project. For example:
      
      *   **"I'm a student and I want to build a simple chatbot for my website that answers questions about my portfolio. I don't know how to code."**
          *   **Answer:** You should start with **Path 1**. Look at a tool like **Voiceflow**.
      
      *   **"I'm a developer building a web app that summarizes long articles for users. I'm comfortable with Python."**
          *   **Answer:** **Path 2** is perfect. I'd recommend starting with the **OpenAI API** (using GPT-4o) or the **Anthropic API** (using Claude 3 Sonnet) because of their strong summarization skills.
      
      *   **"I'm a researcher and I need to analyze sensitive text data without it ever leaving my machine. I have a computer with a good GPU."**
          *   **Answer:** You need **Path 3**. I would suggest downloading a model like **Llama 3** from Hugging Face and running it locally using **Ollama**.`,
              },
            ],
          },
          {
            role: 'user',
            parts: [
              {
                text: `Hi How are you`,
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

  