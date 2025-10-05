import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    console.log('API route called');
    
    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    console.log('API key exists:', !!apiKey);
    
    if (!apiKey) {
      console.error('Gemini API key not found');
      return NextResponse.json({ 
        error: 'API key not configured',
        details: 'Please set GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY environment variable'
      }, { status: 500 });
    }

    const body = await request.json();
    console.log('Request body received:', { hasPrompt: !!body.prompt });
    
    const { prompt } = body;
    
    if (!prompt) {
      return NextResponse.json({ 
        error: 'Prompt is required',
        details: 'No prompt provided in request body'
      }, { status: 400 });
    }

    console.log('Sending request to AI API...');
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Received response from AI API, length:', text.length);
    
    if (!text || text.trim() === '') {
      return NextResponse.json({ 
        error: 'Empty response from AI',
        details: 'AI returned an empty response'
      }, { status: 500 });
    }
    
    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error with AI API:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      if (error.message.includes('API key') || error.message.includes('authentication')) {
        return NextResponse.json({ 
          error: 'Invalid API key',
          details: 'The provided API key is invalid or expired'
        }, { status: 401 });
      }
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json({ 
          error: 'API quota exceeded',
          details: 'You have exceeded your API quota limit'
        }, { status: 429 });
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return NextResponse.json({ 
          error: 'Network error',
          details: 'Failed to connect to Gemini API'
        }, { status: 503 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to get response from AI',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
