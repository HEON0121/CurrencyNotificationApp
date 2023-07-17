// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDonQY7XroCXw2kKm98NhEQ5hJA_UAiMsQ",
  authDomain: "currency-notification.firebaseapp.com",
  projectId: "currency-notification",
  storageBucket: "currency-notification.appspot.com",
  messagingSenderId: "1012334776120",
  appId: "1:1012334776120:web:ee125c06c6a210ee84bbcd",
  measurementId: "G-PC71P8KRH9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
