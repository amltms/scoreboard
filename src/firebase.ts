// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, update, push, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAB3MmknwBZ8yXd5ZnOlCWdA4RPkLTSRrY",
  authDomain: "games-f4aee.firebaseapp.com",
  databaseURL: "https://games-f4aee-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "games-f4aee",
  storageBucket: "games-f4aee.firebasestorage.app",
  messagingSenderId: "419016657615",
  appId: "1:419016657615:web:5a948151d8c863877bc5ba",
  measurementId: "G-N64B6DR309"
};


const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, onValue, set, update, push, remove };
