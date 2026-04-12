import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLduEf5eqapDxNXxkQHAvBZnMaLZBTcuU",
  authDomain: "flutter-ai-playground-eb08d.firebaseapp.com",
  projectId: "flutter-ai-playground-eb08d",
  storageBucket: "flutter-ai-playground-eb08d.firebasestorage.app",
  messagingSenderId: "147019538985",
  appId: "1:147019538985:web:e270fea690c06227efb238"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
