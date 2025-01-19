import { NextResponse } from 'next/server';
require('dotenv').config();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('Received data:', data);

    if (!data.name || !data.email || !data.content || !data.reportTitle || !data.primaryColor || !data.logoUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      const backendUrl = `${process.env.API_URL}/api/save-and-forward`;
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Log raw response text
        console.error('Raw error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      return NextResponse.json(result);

    } catch (error) {
      console.error('Error forwarding to backend:', error);
      return NextResponse.json(
        { error: 'Failed to generate PDF' },
        { status: 500 }
      );
    } 

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

