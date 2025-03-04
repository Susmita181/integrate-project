// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBRhWgFyOrH6G1u03NTbCXehy1RJr0XvDM",
  authDomain: "paperwork-upload.firebaseapp.com",
  projectId: "paperwork-upload",
  storageBucket: "paperwork-upload.firebasestorage.app",
  messagingSenderId: "1067380398298",
  appId: "1:1067380398298:web:318caf0cd3fe04d6d6ede3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);