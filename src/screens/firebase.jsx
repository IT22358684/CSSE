// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
 import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGMJJKpGWIhVQsk-oKYbtHafWzop4wH5E",
  authDomain: "hospitalsystem-3ae86.firebaseapp.com",
  projectId: "hospitalsystem-3ae86",
  storageBucket: "hospitalsystem-3ae86.appspot.com",
  messagingSenderId: "641498625937",
  appId: "1:641498625937:web:b24360824c82622a08cc30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore(app);

export default app;