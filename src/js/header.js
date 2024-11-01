// header.js
import { initAuth } from '/src/js/firebase-init.js';  // Update this path

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