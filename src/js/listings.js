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
    const jobId = jobItem.querySelector('.job-id').textContent;
    const type = jobItem.querySelector('.tag').textContent;
    const title = jobItem.querySelector('.title').textContent;
    const metadata = jobItem.querySelector('.metadata').textContent;
    const description = jobItem.querySelector('.description').textContent;
    
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-button">&times;</span>
            <span class="tag">${type}</span>
            <h2 style="margin: 10px 0;">${title}</h2>
            <div class="metadata">${metadata}</div>
            <div class="job-details">
                <h3>Description</h3>
                <p>${description}</p>
                
                <a href="https://form.typeform.com/to/JLKYbqas#job_id=${jobId}" 
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

function showGrantsPopup() {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content" style="max-width: 400px;">
            <span class="close-button">&times;</span>
            <h2 style="margin-bottom: 20px;">Grants Coming Soon</h2>
            <p>Grants for research and business ventures may be coming soon, but are not currently available.</p>
        </div>
    `;
    
    document.body.appendChild(popup);
    popup.style.display = 'block';

    // Close button functionality
    const closeButton = popup.querySelector('.close-button');
    closeButton.onclick = () => popup.remove();

    // Click outside to close
    popup.onclick = (e) => {
        if (e.target === popup) popup.remove();
    };
}