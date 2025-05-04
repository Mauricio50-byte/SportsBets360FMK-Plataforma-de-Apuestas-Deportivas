// Track current main content view
let currentView = 'home';

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const allNavLinks = document.querySelectorAll('.nav-links a');
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
            
            // Remove active class from all links
            allNavLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to this link
            this.classList.add('active');
            
            // Handle different navigation actions based on link ID
            const linkId = this.id;
            
            // Save the current view and navigate
            handleNavigation(linkId);
        });
    });
    
    // Add logout event listener
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

/**
 * Handle navigation based on link ID
 * @param {string} linkId - ID of the clicked navigation link
 */
function handleNavigation(linkId) {
    switch(linkId) {
        case 'home-link':
            currentView = 'home';
            showHomeContent();
            break;
        case 'equipos-link':
            currentView = 'equipos';
            showEquiposContent();
            break;
        case 'resultados-link':
            currentView = 'resultados';
            showResultadosContent();
            break;
        case 'dar-dinero-link':
            currentView = 'dar-dinero';
            showDarDineroContent();
            break;
        case 'recargas-link':
            openRecargasModal();
            break;
        case 'apuestas-usuarios-link':
            currentView = 'apuestas-usuarios';
            showApuestasUsuariosContent();
            break;
        case 'salir-link':
            logout();
            break;
    }
    
    // Always ensure the betting slip is visible after changing views
    updateCuponLineas();
}

/**
 * Show home content
 */
function showHomeContent() {
    // Hide all content sections
    hideAllContentSections();
    
    // Show matches container
    const matchesContainer = document.querySelector('.matches-container');
    if (matchesContainer) {
        matchesContainer.style.display = 'block';
    }
    
    // Show default sport content
    const defaultContent = document.querySelector('.default-content');
    if (defaultContent) {
        defaultContent.style.display = 'block';
    }
}

/**
 * Show equipos content
 */
function showEquiposContent() {
    // Hide all content sections
    hideAllContentSections();
    
    // Show equipos content
    const equiposContent = document.querySelector('.equipos-content');
    if (equiposContent) {
        equiposContent.style.display = 'block';
    } else {
        // Create equipos content if it doesn't exist
        createEquiposContent();
    }
}

/**
 * Create equipos content if not present
 */
function createEquiposContent() {
    const contentArea = document.querySelector('.content');
    if (!contentArea) return;
    
    const equiposContent = document.createElement('div');
    equiposContent.className = 'equipos-content';
    equiposContent.innerHTML = `
        <h2>Equipos</h2>
    `;
    
    contentArea.appendChild(equiposContent);
}

/**
 * Show resultados content
 */
function showResultadosContent() {
    // Hide all content sections
    hideAllContentSections();
    
    // Show resultados content
    const resultadosContent = document.querySelector('.resultados-content');
    if (resultadosContent) {
        resultadosContent.style.display = 'block';
    } else {
        // Create resultados content if it doesn't exist
        createResultadosContent();
    }
}

/**
 * Create resultados content if not present
 */
function createResultadosContent() {
    const contentArea = document.querySelector('.content');
    if (!contentArea) return;
    
    const resultadosContent = document.createElement('div');
    resultadosContent.className = 'resultados-content';
    resultadosContent.innerHTML = `
        <h2>Resultados</h2>
    `;
    
    contentArea.appendChild(resultadosContent);
}

/**
 * Show dar dinero content
 */
function showDarDineroContent() {
    // Hide all content sections
    hideAllContentSections();
    
    // Show dar dinero content
    const darDineroContent = document.querySelector('.dar-dinero-content');
    if (darDineroContent) {
        darDineroContent.style.display = 'block';
    } else {
        // Create dar dinero content if it doesn't exist
        createDarDineroContent();
    }
}

/**
 * Create dar dinero content if not present
 */
function createDarDineroContent() {
    const contentArea = document.querySelector('.content');
    if (!contentArea) return;
    
    const darDineroContent = document.createElement('div');
    darDineroContent.className = 'dar-dinero-content';
    darDineroContent.innerHTML = `
        <h2>Dar Dinero</h2>
        <div class="dar-dinero-container">
            <p>Esta función permite dar dinero a tu cuenta (solo para demo).</p>
            <button id="add-money-btn" class="btn-primary">Agregar $100</button>
        </div>
    `;
    
    contentArea.appendChild(darDineroContent);
    
    // Add event listener to the button
    const addMoneyBtn = darDineroContent.querySelector('#add-money-btn');
    if (addMoneyBtn) {
        addMoneyBtn.addEventListener('click', function() {
            // Update balance
            const balanceElement = document.querySelector('.balance-amount');
            if (balanceElement) {
                const currentBalance = parseFloat(balanceElement.textContent.replace(/[^\d.]/g, '')) || 0;
                const newBalance = currentBalance + 100;
                balanceElement.textContent = `$ ${newBalance.toFixed(2)}`;
            }
            
            alert('Se han agregado $100 a tu cuenta (demo)');
        });
    }
}

/**
 * Hide all content sections except betting slip
 */
function hideAllContentSections() {
    const contentSections = document.querySelectorAll('.content > div:not(.cupon_lineas)');
    contentSections.forEach(section => {
        section.style.display = 'none';
    });
}

/**
 * Logout functionality
 */
function logout() {
    // In a real app, this would clear session data
    // For demo, we'll just reset the UI
    const userElement = document.querySelector('.current-user');
    if (userElement) userElement.textContent = 'Invitado';
    
    const balanceElement = document.querySelector('.balance-amount');
    if (balanceElement) balanceElement.textContent = '$ 0.00';
    
    // Reset betting slip
    selectedBets = [];
    document.querySelectorAll('.bet-option.selected').forEach(option => {
        option.classList.remove('selected');
    });
    
    updateBettingSlip();
    const montoInput = document.getElementById('monto-apostar');
    if (montoInput) montoInput.value = '';
    
    alert('Has cerrado sesión correctamente');
}