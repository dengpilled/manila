// listings.js
async function loadListings() {
    try {
        const response = await fetch('/listings.html');
        const html = await response.text();
        document.getElementById('listings-container').innerHTML = html;
        
        // Initialize job listings functionality
        initJobListings();
    } catch (error) {
        console.error('Error loading listings:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadListings);