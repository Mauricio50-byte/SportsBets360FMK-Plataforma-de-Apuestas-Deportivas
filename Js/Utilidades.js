function formatCurrency(amount) {
    return parseFloat(amount).toFixed(2);
}

// Validate number input to ensure only numbers and a single decimal point
function validateNumberInput(value) {
    // Remove any non-digit or non-decimal characters
    let sanitized = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const decimalCount = (sanitized.match(/\./g) || []).length;
    if (decimalCount > 1) {
        sanitized = sanitized.replace(/\.(?=.*\.)/g, '');
    }
    
    return sanitized;
}

// Extract numeric value from string (e.g., "$ 100.50" -> 100.50)
function extractNumericValue(str) {
    return parseFloat(str.replace(/[^\d.]/g, '')) || 0;
}

// Generate a unique ticket ID
function generateTicketId() {
    return 'T' + Date.now().toString().substring(7);
}

// Hide all content sections except for a specific one
function hideAllContentExcept(exceptSelector) {
    const contentSections = document.querySelectorAll('.content > div:not(' + exceptSelector + ')');
    contentSections.forEach(section => {
        section.style.display = 'none';
    });
}

// Show an element with a specific display style
function showElement(element, displayStyle = 'block') {
    if (element) {
        element.style.display = displayStyle;
    }
}

// Hide an element
function hideElement(element) {
    if (element) {
        element.style.display = 'none';
    }
}

// Check if element exists in DOM
function elementExists(selector) {
    return document.querySelector(selector) !== null;
}

// Create DOM element with attributes and event listeners
function createElement(tag, attributes = {}, listeners = {}) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Add event listeners
    Object.entries(listeners).forEach(([event, callback]) => {
        element.addEventListener(event, callback);
    });
    
    return element;
}

// Display alert message
function showAlert(message) {
    alert(message);
}

// Update balance with animation
function updateBalance(newAmount) {
    const balanceElement = document.querySelector('.balance-amount');
    if (balanceElement) {
        const currentBalance = extractNumericValue(balanceElement.textContent);
        // If you want to add animation, you could implement it here
        balanceElement.textContent = `$ ${formatCurrency(newAmount)}`;
    }
}

// Add money to current balance
function addToBalance(amount) {
    const balanceElement = document.querySelector('.balance-amount');
    if (balanceElement) {
        const currentBalance = extractNumericValue(balanceElement.textContent);
        const newBalance = currentBalance + amount;
        updateBalance(newBalance);
        return newBalance;
    }
    return 0;
}

// Subtract money from current balance
function subtractFromBalance(amount) {
    const balanceElement = document.querySelector('.balance-amount');
    if (balanceElement) {
        const currentBalance = extractNumericValue(balanceElement.textContent);
        if (currentBalance >= amount) {
            const newBalance = currentBalance - amount;
            updateBalance(newBalance);
            return newBalance;
        } else {
            showAlert('No tienes saldo suficiente para realizar esta operación');
            return false;
        }
    }
    return 0;
}

// Set active state for navigation elements
function setActiveNavItem(selector, activeItemSelector) {
    // Remove active class from all items
    const items = document.querySelectorAll(selector);
    items.forEach(item => item.classList.remove('active'));
    
    // Add active class to specified item
    const activeItem = document.querySelector(activeItemSelector);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Check if we're on mobile view
function isMobileView() {
    return window.innerWidth <= 992;
}

// Adjust layout for current viewport size
function adjustLayoutForViewport() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const contentElement = document.querySelector('.content');
    
    if (isMobileView()) {
        // Mobile layout
        if (sidebar) sidebar.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        if (contentElement) contentElement.style.marginLeft = '0';
    } else {
        // Desktop layout
        if (contentElement) contentElement.style.marginLeft = '250px';
    }
}

// Export all functions
export {
    formatCurrency,
    validateNumberInput,
    extractNumericValue,
    generateTicketId,
    hideAllContentExcept,
    showElement,
    hideElement,
    elementExists,
    createElement,
    showAlert,
    updateBalance,
    addToBalance,
    subtractFromBalance,
    setActiveNavItem,
    isMobileView,
    adjustLayoutForViewport
};