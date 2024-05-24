import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    

    const result = await req.json();
    
    if (!result) {
      console.error(result.error);
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }

    console.log(result);

    const response = await fetch('https://bhashini-api.onrender.com/getLikenessAndIntent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation: result.text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch translations: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}