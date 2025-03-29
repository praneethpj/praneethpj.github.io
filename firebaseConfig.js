// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCY7OLge8DxdMcbjGTm0rYbjJEPihIIVlw",
  authDomain: "portfolio-os-2cd5b.firebaseapp.com",
  projectId: "portfolio-os-2cd5b",
  storageBucket: "portfolio-os-2cd5b.firebasestorage.app",
  messagingSenderId: "416004449117",
  appId: "1:416004449117:web:0c6f519431a4fc7628beb4",
  measurementId: "G-MC1SMDH307"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);