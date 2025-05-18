import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCmxusCy3vqWEJ9mrNIa95Z-CfPW1lRKjA",
  authDomain: "myrealtimedbapp-4061d.firebaseapp.com",
  databaseURL: "https://myrealtimedbapp-4061d-default-rtdb.firebaseio.com",
  projectId: "myrealtimedbapp-4061d",
  storageBucket: "myrealtimedbapp-4061d.appspot.com",
  messagingSenderId: "241666837689",
  appId: "1:241666837689:web:418aa4da8bbab1dec11f68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use `initializeAuth` with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const database = getDatabase(app);

export { app, auth, database };
