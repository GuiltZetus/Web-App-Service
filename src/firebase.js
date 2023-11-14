// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAb5wXCrQ-J2UjYMLM-8GHHuptYbN-EOxY",
  authDomain: "e-commerce-73482.firebaseapp.com",
  databaseURL: "https://e-commerce-73482-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "e-commerce-73482",
  storageBucket: "e-commerce-73482.appspot.com",
  measurementId: "G-DVYY9Z33X0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export firestore as db
const db = getFirestore(app);    

export {db};
