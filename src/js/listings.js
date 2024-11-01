// listings.js
async function loadListings() {
    try {
        const response = await fetch('/src/components/listings.html');
        const html = await response.text();
        document.getElementById('listings-container').innerHTML = html;
        
        // Initialize listings functionality after content is loaded
        initJobListings();
    } catch (error) {
        console.error('Error loading listings:', error);
    }
}

// Job listings initialization
function initJobListings() {
    // Create unique IDs for each job listing
    document.querySelectorAll('.item').forEach((item, index) => {
        const type = item.querySelector('.tag').textContent.toLowerCase();
        const timestamp = Date.now();
        const uniqueId = `${type}-${timestamp}-${index + 1}`;
        
        // Add the ID to the item
        item.setAttribute('data-job-id', uniqueId);
        
        // Make the title clickable
        const titleElement = item.querySelector('.title');
        titleElement.onclick = (e) => {
            e.preventDefault();
            showJobPopup(item);
        };
    });
}

// Job popup function
function showJobPopup(jobItem) {
    const jobId = jobItem.getAttribute('data-job-id');
    const type = jobItem.querySelector('.tag').textContent;
    const title = jobItem.querySelector('.title').textContent;
    const metadata = jobItem.querySelector('.metadata').textContent;
    
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-button">&times;</span>
            <span class="tag">${type}</span>
            <h2 style="margin: 10px 0;">${title}</h2>
            <div class="job-id">ID: ${jobId}</div>
            <div class="metadata">${metadata}</div>
            <div class="job-details">
                <h3>Job Description</h3>
                <p>We are looking for a qualified professional to join our team...</p>
                
                <h3>Requirements</h3>
                <ul>
                    <li>Relevant experience in the field</li>
                    <li>Strong communication skills</li>
                    <li>Ability to work independently</li>
                </ul>
                
                <h3>Compensation</h3>
                <p>${title.match(/\(([^)]+)\)/)[1]}</p>
                
                <h3>Location</h3>
                <p>Remote / Various Locations</p>
                
                <a href="https://www.typeform.com/forms/xxxxx?job_id=${jobId}" 
                   target="_blank" 
                   class="apply-button">
                    Apply Now
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    popup.style.display = 'block';

    // Close button functionality
    const closeButton = popup.querySelector('.close-button');
    closeButton.onclick = () => {
        popup.remove();
    };

    // Close on outside click
    popup.onclick = (e) => {
        if (e.target === popup) {
            popup.remove();
        }
    };

    // Add to recently viewed
    addToRecentlyViewed(jobId);
}

// Recently viewed functionality
function addToRecentlyViewed(jobId) {
    try {
        let recent = JSON.parse(localStorage.getItem('recentJobs') || '[]');
        recent = [jobId, ...recent.filter(id => id !== jobId)].slice(0, 5);
        localStorage.setItem('recentJobs', JSON.stringify(recent));
    } catch (error) {
        console.error('Error updating recently viewed:', error);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadListings);

// Add keyboard support for closing popups
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const popup = document.querySelector('.popup');
        if (popup) {
            popup.remove();
        }
    }
});