// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOwiCG6oQXGnsJWNCxNlASNM0CIVie9kw",
  authDomain: "banpinexplore.firebaseapp.com",
  projectId: "banpinexplore",
  storageBucket: "banpinexplore.appspot.com",
  messagingSenderId: "505005606934",
  appId: "1:505005606934:web:575ff101c2593546ac8d37",
  measurementId: "G-3JRW2Q2D2B",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
// export const analytics = getAnalytics(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);