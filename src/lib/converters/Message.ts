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

export interface Message {
  id?: string;
  input: string;
  timestamp: Date;
  user: User;
  audio?: string;
  translated?: {
    [K in LanguageSuppport]?: string;
  };
}

const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore: function (message: Message): DocumentData {
    return {
      input: message.input,
      audio: message.audio,
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
      timestamp: data.timestamp?.toDate(),
      translated: data.translated,
      user: data.user,
      audio: data.audio,
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
