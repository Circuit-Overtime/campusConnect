import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBL0d5Equk-xEDyDzmflArXAwRRSz24M1M",
  authDomain: "storage-b195d.firebaseapp.com",
  databaseURL: "https://storage-b195d-default-rtdb.firebaseio.com",
  projectId: "storage-b195d",
  storageBucket: "storage-b195d.appspot.com",
  messagingSenderId: "967844400430",
  appId: "1:967844400430:web:e626050e6489abfbda3ebf"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };
