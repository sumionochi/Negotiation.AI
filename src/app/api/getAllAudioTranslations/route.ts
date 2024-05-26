import { NextRequest, NextResponse } from 'next/server';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { getDownloadURL } from '@firebase/storage';
import { db, auth, functions, storagedb } from '@/lib/firebase';
import { timeStamp } from 'console';

const storage = getStorage();

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
    console.log(body.messages);

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
    const audioRefs: Record<string, string> = {};

    for (const [lang, base64Audio] of Object.entries(data.response.audios)) {
      const audioRef = ref(storagedb, `audiosaudios/${body.chatId}/${lang}.wav`);
      const uploadSnapshot = await uploadString(audioRef, base64Audio as string, 'base64');
      const downloadURL = await getDownloadURL(uploadSnapshot.ref);
      audioRefs[lang as string] = downloadURL;
    }

    const responseWithRefs = {
      response: {
        audios: audioRefs,
        transcriptions: data.response.transcriptions,
      },
      sentiment: data.sentiment,
    };

    console.log(responseWithRefs);
    return NextResponse.json(responseWithRefs);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}