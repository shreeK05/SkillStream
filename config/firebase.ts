import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGhU7BuG8osULs9DgpmwzTGQURVaeG3rg",
  authDomain: "skillstream-eba33.firebaseapp.com",
  projectId: "skillstream-eba33",
  storageBucket: "skillstream-eba33.firebasestorage.app",
  messagingSenderId: "239223084161",
  appId: "1:239223084161:web:0c4e50aa576510eb292980",
  measurementId: "G-8J3L2W7ET3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
