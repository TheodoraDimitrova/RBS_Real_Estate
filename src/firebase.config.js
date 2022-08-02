import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_bbh--XoKBNGTgW8AIBDULdkPjZ7R0Q0",
  authDomain: "sbr-realestate.firebaseapp.com",
  projectId: "sbr-realestate",
  storageBucket: "sbr-realestate.appspot.com",
  messagingSenderId: "1060569585652",
  appId: "1:1060569585652:web:aacf2f747c163e4d888ba1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

