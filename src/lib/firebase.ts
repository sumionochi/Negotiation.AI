import {getApp, getApps, initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getFunctions} from 'firebase/functions'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC-JFBKjP0jFyPpu20_LhFG0kY1o-n8lO8",
  authDomain: "tele-health-ai.firebaseapp.com",
  projectId: "tele-health-ai",
  storageBucket: "tele-health-ai.appspot.com",
  messagingSenderId: "165849600289",
  appId: "1:165849600289:web:262fcef204721d4aa5ae60"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const functions = getFunctions(app)
const storagedb = getStorage(app)

export {db, auth, functions, storagedb};