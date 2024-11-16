// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgRzKR2nabtJO-B1kcjSAk6tKpSDWssOY",
  authDomain: "hopelife-dde34.firebaseapp.com",
  projectId: "hopelife-dde34",
  storageBucket: "hopelife-dde34.firebasestorage.app",
  messagingSenderId: "327416954379",
  appId: "1:327416954379:web:b5438124f7ecd0bafd110e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);