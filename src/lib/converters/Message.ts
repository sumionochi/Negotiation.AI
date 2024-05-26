// pushing and pulling data to and from firestore

import { LanguageSuppport } from "../../../store/store";
import { db } from "../firebase";

import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  limit,
  query,
  orderBy,
  where,
} from "firebase/firestore";

export interface User {
  id: string;
  email: string;
  name: string;
  image: string;
}

export interface InputBhashini {
  bn: string,
  en: string,
  gu: string,
  hi: string,
  kn: string,
  ml: string,
  mr: string,
  or: string,
  pa: string,
  ta: string,
  te: string,
}

export interface AudioBhashini {
  audios:{
    bn: string,
  en: string,
  gu: string,
  hi: string,
  kn: string,
  ml: string,
  mr: string,
  or: string,
  pa: string,
  ta: string,
  te: string,
  },
  transcriptions:{
    bn: string,
  en: string,
  gu: string,
  hi: string,
  kn: string,
  ml: string,
  mr: string,
  or: string,
  pa: string,
  ta: string,
  te: string,
  }
}

export interface EmotionScore {
  label: string;
  score: number;
}

export interface EmotionBhashini extends Array<EmotionScore> {}

export interface Message {
  id?: string;

  inputBhashini:InputBhashini,  
  audioBhashini?:AudioBhashini,
  emotionBhashini?:EmotionBhashini,

  input: string;
  timestamp: Date;
  user: User;
  translated?: {
    [K in LanguageSuppport]?: string;
  };
}

const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore: function (message: Message): DocumentData {
    return {
      input: message.input,

      inputBhashini: message.inputBhashini ?? {},
      audioBhashini: message.audioBhashini ?? {},
      emotionBhashini: message.emotionBhashini ?? {},


      timestamp: message.timestamp,
      user: message.user,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Message {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      input: data.input,

      inputBhashini: data.inputBhashini,
      audioBhashini: data.audioBhashini,
      emotionBhashini: data.emotionBhashini,

      timestamp: data.timestamp?.toDate(),
      translated: data.translated,
      user: data.user,
    };
  },
};

export const messageRef = (chatId: string) =>
  collection(db, "chats", chatId, "messages").withConverter(messageConverter);
export const limitedMessagesRef = (chatId: string) =>
  query(messageRef(chatId), limit(25));
export const sortedMessagesRef = (chatId: string) =>
  query(messageRef(chatId), orderBy("timestamp", "asc"));
export const limitedSortedMessagesRef = (chatId: string) =>
  query(query(messageRef(chatId), limit(1)), orderBy("timestamp", "desc"));
