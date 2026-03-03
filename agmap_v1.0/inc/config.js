import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2osaxmp4Olcty9qtO5M8f8DXIRl6ktXg",
  authDomain: "agmap-2701.firebaseapp.com",
  projectId: "agmap-2701",
  storageBucket: "agmap-2701.firebasestorage.app",
  messagingSenderId: "860003734996",
  appId: "1:860003734996:web:4dd0fa5ff6a8bcae6d7241",
  measurementId: "G-6TPW0Z0Q3V"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);