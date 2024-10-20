import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGMJJKpGWIhVQsk-oKYbtHafWzop4wH5E",
  authDomain: "hospitalsystem-3ae86.firebaseapp.com",
  projectId: "hospitalsystem-3ae86",
  storageBucket: "hospitalsystem-3ae86.appspot.com",
  messagingSenderId: "641498625937",
  appId: "1:641498625937:web:b24360824c82622a08cc30"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;