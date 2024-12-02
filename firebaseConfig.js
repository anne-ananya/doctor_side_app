// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // For authentication
import { getDatabase } from "firebase/database";  // For Realtime Database

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyCmxusCy3vqWEJ9mrNIa95Z-CfPW1lRKjA",
  authDomain: "myrealtimedbapp-4061d.firebaseapp.com",
  databaseURL: "https://myrealtimedbapp-4061d-default-rtdb.firebaseio.com",
  projectId: "myrealtimedbapp-4061d",
  storageBucket: "myrealtimedbapp-4061d.firebasestorage.app",
  messagingSenderId: "241666837689",
  appId: "1:241666837689:web:418aa4da8bbab1dec11f68",
  measurementId: "G-EZXP3588KX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Realtime Database
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
