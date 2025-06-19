// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnYBqp2xFaMuNQr5EyOsTcSbH2FDrv_tY",
  authDomain: "treedoctor-4a98b.firebaseapp.com",
  projectId: "treedoctor-4a98b",
  storageBucket: "treedoctor-4a98b.firebasestorage.app",
  messagingSenderId: "1098744020872",
  appId: "1:1098744020872:web:7726bb4df0093fe6a0c43d",
  measurementId: "G-B7F9VHMW08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const storage = getStorage(app); 

// Export db so you can use it in other parts of your app
export { db, storage };