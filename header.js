// header.js
async function loadHeader() {
    try {
        const response = await fetch('/header.html');
        const html = await response.text();
        document.getElementById('header-container').innerHTML = html;
        
        // Initialize auth after header is loaded
        initAuth();
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

// Call this when the document is loaded
document.addEventListener('DOMContentLoaded', loadHeader);