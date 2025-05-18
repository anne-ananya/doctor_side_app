import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

// Your Firebase config
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "myrealtimedbapp-4061d.appspot.com",
  messagingSenderId: "241666837689",
  appId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use `initializeAuth` with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const database = getDatabase(app);

export { app, auth, database };
