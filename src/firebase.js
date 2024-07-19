// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrBqjoPh7AokdKM5I8X1VBrJLgBeGqRG8",
  authDomain: "forestconservation-73ca7.firebaseapp.com",
  projectId: "forestconservation-73ca7",
  storageBucket: "forestconservation-73ca7.appspot.com",
  messagingSenderId: "677112267293",
  appId: "1:677112267293:web:5bb200573ac059142a3cf4",
  measurementId: "G-XSHD5X5YRR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firebase Storage and get a reference to the service
const storage = getStorage(app);

export { db, auth, storage };
