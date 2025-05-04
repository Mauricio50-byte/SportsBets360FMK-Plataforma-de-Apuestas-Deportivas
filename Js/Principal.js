document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initSidebar();
    initNavigation();
    initSportSelection();
    initBettingSlip();
    initUserBets();
    initRecharges();
    
    // Set up initial view
    showHomeContent();
    
    // Set initial layout based on screen size
    handleResponsiveLayout();
    
    // Listen for window resize events
    window.addEventListener('resize', handleResponsiveLayout);
});

/**
 * Handle responsive layout adjustments
 */
function handleResponsiveLayout() {
    const contentElement = document.querySelector('.content');
    
    if (window.innerWidth <= 992) {
        // Mobile layout
        if (contentElement) contentElement.style.marginLeft = '0';
    } else {
        // Desktop layout
        if (contentElement) contentElement.style.marginLeft = '250px';
    }
}