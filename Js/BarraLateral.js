let sidebar;
let sidebarOverlay;


function initSidebar() {
    sidebar = document.querySelector('.sidebar');
    sidebarOverlay = document.querySelector('.sidebar-overlay');
    
   
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    
    const homeLink = document.getElementById('home-link');
    if (homeLink && window.innerWidth <= 992) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSidebar();
        });
    }
    
    
    initSidebarMenuItems();
}


function toggleSidebar() {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
}


function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
}


function initSidebarMenuItems() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            
            menuItems.forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
            
            
            const sportText = this.textContent.trim();
            const sportName = sportText.substring(sportText.indexOf(' ') + 1);
            console.log(`Selected sport from sidebar: ${sportName}`);
            
            
            filterEventsBySport(sportName);
            
            
            if (window.innerWidth <= 992) {
                closeSidebar();
            }
            
            
            if (currentView !== 'home') {
                currentView = 'home';
                showHomeContent();
                
                
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