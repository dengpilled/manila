// header.js
import { initAuth } from './firebase-init.js';

async function loadHeader() {
    try {
        const response = await fetch('/src/components/header.html');
        const html = await response.text();
        document.getElementById('header-container').innerHTML = html;
        
        // Initialize auth after header is loaded
        initAuth();
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadHeader);