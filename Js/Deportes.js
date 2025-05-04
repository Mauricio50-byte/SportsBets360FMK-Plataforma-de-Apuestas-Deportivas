function initSportSelection() {
    // Sports categories in horizontal menu
    const sportCategories = document.querySelectorAll('.sport-category');
    
    // First, clear any existing event listeners to prevent duplicates
    sportCategories.forEach(category => {
        const newCategory = category.cloneNode(true);
        category.parentNode.replaceChild(newCategory, category);
    });
    
    // Re-add event listeners to the fresh elements
    document.querySelectorAll('.sport-category').forEach(category => {
        category.addEventListener('click', function() {
            // Remove active class from all categories
            document.querySelectorAll('.sport-category').forEach(cat => cat.classList.remove('active'));
            
            // Add active class to selected category
            this.classList.add('active');
            
            // Get sport name from category
            const sportName = this.querySelector('.sport-name').textContent;
            console.log(`Selected sport category: ${sportName}`);
            
            // Update header to show the selected sport
            updateSportHeader(sportName);
            
            // Show relevant content and hide others
            showContentForSport(sportName);
            
            // Filter events by sport category
            filterEventsBySport(sportName);
            
            // Make sure we're in home view when selecting sports
            if (currentView !== 'home') {
                currentView = 'home';
                showHomeContent();
                
                // Set home link as active
                const navLinks = document.querySelectorAll('.nav-links a');
                navLinks.forEach(l => l.classList.remove('active'));
                
                const homeLink = document.getElementById('home-link');
                if (homeLink) {
                    homeLink.classList.add('active');
                }
            }
        });
    });
}

/**
 * Show content for selected sport and hide others
 * @param {string} sportName - Name of the selected sport
 */
function showContentForSport(sportName) {
    // Hide all sport-specific content sections
    const allSportContents = document.querySelectorAll('.sport-content');
    allSportContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Show the content for the selected sport
    const selectedContent = document.querySelector(`.sport-content[data-sport="${sportName}"]`);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    } else {
        // If no specific content found, show default content
        const defaultContent = document.querySelector('.default-content');
        if (defaultContent) {
            defaultContent.style.display = 'block';
        }
    }
    
    // Make sure the betting slip is always visible
    updateCuponLineas();
}

/**
 * Update the sport header
 * @param {string} sportName - Name of the selected sport
 */
function updateSportHeader(sportName) {
    const footballIndicator = document.querySelector('.football-indicator');
    if (footballIndicator) {
        let iconElement = footballIndicator.querySelector('span:first-child');
        let nameElement = footballIndicator.querySelector('span:last-child');
        
        // Update icon based on sport name
        switch(sportName) {
            case 'FÚTBOL':
                iconElement.textContent = '⚽';
                break;
            case 'TENIS':
                iconElement.textContent = '🎾';
                break;
            case 'VOLEIBOL':
                iconElement.textContent = '🏐';
                break;
            case 'BÉISBOL':
                iconElement.textContent = '⚾';
                break;
            case 'BOXEO':
                iconElement.textContent = '🥊';
                break;
            case 'EN VIVO':
                iconElement.textContent = '▶️';
                break;
            default:
                iconElement.textContent = '⚽';
        }
        
        // Update sport name text
        nameElement.textContent = sportName;
    }
}

/**
 * Filter events by sport
 * @param {string} sportName - Name of the selected sport
 */
function filterEventsBySport(sportName) {
    // This would typically fetch events from an API based on the sport
    console.log(`Filtering events for sport: ${sportName}`);
    
    // Update the "EN VIVO AHORA" text if the user selected "EN VIVO"
    const liveNowElement = document.querySelector('.live-now');
    if (liveNowElement) {
        if (sportName === 'EN VIVO') {
            liveNowElement.textContent = 'EN VIVO AHORA';
        } else {
            liveNowElement.textContent = 'PRÓXIMOS EVENTOS';
        }
    }
    
    // Make sure the matches container is visible
    const matchesContainer = document.querySelector('.matches-container');
    if (matchesContainer) {
        matchesContainer.style.display = 'block';
    }
    
    // Show only matches for the selected sport
    const matches = document.querySelectorAll('.match-container');
    matches.forEach(match => {
        const matchSport = match.getAttribute('data-sport');
        if (matchSport === sportName || sportName === 'TODOS' || !matchSport) {
            match.style.display = 'block';
        } else {
            match.style.display = 'none';
        }
    });
    
    // Make sure the betting slip is always visible
    updateCuponLineas();
}