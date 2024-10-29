// app/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXvWJ0qBVUhkP4veN1nTCF7zgtHSGfWmU",
  authDomain: "more-tech-859fa.firebaseapp.com",
  projectId: "more-tech-859fa",
  storageBucket: "more-tech-859fa.appspot.com",
  messagingSenderId: "1078128756885",
  appId: "1:1078128756885:web:f8f6075456f44c1d89339c",
  measurementId: "G-P4PYTM7G6H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use AsyncStorage for Firebase Auth persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const firestore = getFirestore(app);

export { auth, firestore };
