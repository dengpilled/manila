// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js';
import { getDatabase, ref, push, onValue } 
from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwTy7YZPy8IDmfE_YgnPP91qj0e85p53M",
    authDomain: "maynila-d1d06.firebaseapp.com",
    projectId: "maynila-d1d06",
    storageBucket: "maynila-d1d06.appspot.com",
    messagingSenderId: "1079625635012",
    appId: "1:1079625635012:web:8e7539c460674aaa56a591",
    measurementId: "G-ER42W4EGG1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
// After initializing Firebase app
const db = getDatabase(app);
export { db, ref, push, onValue };

// Make auth functions available globally
window.auth = auth;
window.GoogleAuthProvider = GoogleAuthProvider;
window.signInWithPopup = signInWithPopup;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.onAuthStateChanged = onAuthStateChanged;
window.signOut = signOut;

// Auth initialization function
export function initAuth() {
    const modal = document.getElementById('loginModal');
    const signInButton = document.getElementById('signInButton');
    const userInfo = document.getElementById('userInfo');
    const errorDisplay = document.querySelector('.error-message');

    const showError = (message) => {
        errorDisplay.textContent = message;
        errorDisplay.style.display = 'block';
        setTimeout(() => {
            errorDisplay.style.display = 'none';
        }, 5000);
    };

    // Handle Sign Out
    async function handleSignOut() {
        try {
            await signOut(auth);
            console.log('Successfully signed out');
        } catch (error) {
            console.error('Error signing out:', error);
            showError('Error signing out. Please try again.');
        }
    }

    // Auth event listeners
    signInButton.onclick = () => {
        const user = auth.currentUser;
        if (user) {
            handleSignOut();
        } else {
            modal.style.display = 'block';
        }
    };

    // Google Sign In
    document.getElementById('googleSignIn').onclick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            const result = await signInWithPopup(auth, provider);
            modal.style.display = 'none';
        } catch (error) {
            console.error('Google sign in error:', error);
            showError(error.message);
        }
    };

    // Email Sign In
    document.getElementById('emailSignIn').onsubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            modal.style.display = 'none';
        } catch (error) {
            console.error('Email sign in error:', error);
            showError(error.message);
        }
    };

    // Auth state observer
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userInfo.style.display = 'inline-block';
            userInfo.innerHTML = `<a href="#" class="user-email">${user.email}</a>`;
            signInButton.textContent = 'log out';
            
            // Add click handler for email
            userInfo.querySelector('.user-email').onclick = (e) => {
                e.preventDefault();
                showAccountPopup(user);
            };
        } else {
            userInfo.style.display = 'none';
            userInfo.innerHTML = '';
            signInButton.textContent = 'sign in';
        }
    });

    // Close button handlers
    document.querySelectorAll('.close-button').forEach(button => {
        button.onclick = function() {
            this.closest('.modal, .account-popup').style.display = 'none';
        };
    });

    // Modal close on outside click
    modal.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}