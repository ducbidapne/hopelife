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
  apiKey: "AIzaSyA3KNGz6N5iYheasa8R-1JJl2NpPfzZ5DQ",
  authDomain: "productmanagement-fe02a.firebaseapp.com",
  projectId: "productmanagement-fe02a",
  storageBucket: "productmanagement-fe02a.appspot.com",
  messagingSenderId: "17280252449",
  appId: "1:17280252449:web:ad09a02e3c4bfd57f78160",
  measurementId: "G-F659T0LFEY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);
// export const auth = firebase.auth();
// export const db = firebase.firestore();