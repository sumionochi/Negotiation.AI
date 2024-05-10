import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const base64Audio = body.audio_file;
    const sourceLanguage = body.sourceLanguage;

    if (!base64Audio || !sourceLanguage) {
      console.error('Missing audio_file or sourceLanguage');
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }

    console.log('Received audio file:', base64Audio);
    console.log('Source language:', sourceLanguage);

    const audioAndSentiment = await fetch('https://bhashini-api.onrender.com/getAllVoiceTranslations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64: base64Audio, sourceLanguage: 'en' }),
    });

    if (!audioAndSentiment.ok) {
      throw new Error(`Failed to fetch translations: ${audioAndSentiment.status}`);
    }

    const data = await audioAndSentiment.json();
    console.log(data);
    // Encode base64 strings in the response object
    const encodedResponse = Object.fromEntries(
      Object.entries(data.response).map(([lang, base64]) => [lang, Buffer.from(base64 as string, 'base64').toString()])
    );

    console.log(encodedResponse);

    return NextResponse.json({ ...data, response: encodedResponse });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}