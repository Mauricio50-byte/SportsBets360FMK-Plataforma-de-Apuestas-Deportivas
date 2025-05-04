// Recargas.js

// Hold references to DOM elements
let recargasModal;
let uploadArea;
let comprobanteInput;

/**
 * Initialize recharges functionality
 */
export function initRecharges() {
    // Get DOM elements
    recargasModal = document.getElementById('recargas-modal');
    uploadArea = document.getElementById('upload-area');
    comprobanteInput = document.getElementById('comprobante');
    
    // Set up event listeners for recargas link and modal close button
    const recargasLink = document.getElementById('recargas-link');
    const closeModal = document.querySelector('.close-modal');
    
    if (recargasLink) {
        recargasLink.addEventListener('click', function(e) {
            e.preventDefault();
            openRecargasModal();
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeRecargasModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === recargasModal) {
            closeRecargasModal();
        }
    });
    
    // Set up file upload functionality
    initFileUpload();
    
    // Set up form submission
    initFormSubmission();

    // Set up dar dinero functionality
    initDarDinero();
}

/**
 * Initialize file upload functionality
 */
function initFileUpload() {
    if (uploadArea && comprobanteInput) {
        uploadArea.addEventListener('click', function() {
            comprobanteInput.click();
        });
        
        comprobanteInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const fileName = this.files[0].name;
                uploadArea.innerHTML = `<div>Archivo seleccionado: ${fileName}</div>`;
            }
        });
    }
}

/**
 * Initialize form submission functionality
 */
function initFormSubmission() {
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const nombre = document.getElementById('nombre')?.value;
            const apellido = document.getElementById('apellido')?.value;
            const correo = document.getElementById('correo')?.value;
            const telefono = document.getElementById('telefono')?.value;
            const medioPago = document.getElementById('medio-pago')?.value;
            const comprobante = document.getElementById('comprobante')?.files[0];
            
            if (!nombre || !apellido || !correo || !telefono || !medioPago || !comprobante) {
                alert('Por favor, complete todos los campos y suba un comprobante de pago');
                return;
            }

            alert('Comprobante enviado correctamente. Procesaremos su recarga pronto.');
            updateBalance(50); // Demo balance update
            closeRecargasModal();
            resetForm();
        });
    }
}

/**
 * Initialize "Dar Dinero" functionality
 */
function initDarDinero() {
    const darDineroLink = document.getElementById('dar-dinero-link');
    if (darDineroLink) {
        darDineroLink.addEventListener('click', function(e) {
            e.preventDefault();
            updateBalance(100);
            alert('Se han agregado $100 a tu cuenta (demo)');
        });
    }
}

/**
 * Create dar dinero content if not present
 */
export function createDarDineroContent() {
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
    
    const addMoneyBtn = darDineroContent.querySelector('#add-money-btn');
    if (addMoneyBtn) {
        addMoneyBtn.addEventListener('click', function() {
            updateBalance(100);
            alert('Se han agregado $100 a tu cuenta (demo)');
        });
    }
}

/**
 * Open the recharges modal
 */
export function openRecargasModal() {
    if (recargasModal) {
        recargasModal.style.display = 'flex';
    }
}

/**
 * Close the recharges modal
 */
export function closeRecargasModal() {
    if (recargasModal) {
        recargasModal.style.display = 'none';
    }
}

/**
 * Reset the recharge form
 */
function resetForm() {
    const form = document.querySelector('.modal-content form');
    if (form) form.reset();
    
    if (uploadArea) {
        uploadArea.innerHTML = `<div class="upload-placeholder">
            <div>Click para subir foto</div>
            <div>La imagen debe estar legible</div>
        </div>`;
    }
}

/**
 * Update user balance
 * @param {number} amount - Amount to add to the balance
 */
export function updateBalance(amount) {
    const balanceElement = document.querySelector('.balance-amount');
    if (balanceElement) {
        const currentBalance = parseFloat(balanceElement.textContent.replace(/[^\d.]/g, '')) || 0;
        const newBalance = currentBalance + amount;
        balanceElement.textContent = `$ ${newBalance.toFixed(2)}`;
    }
}

/**
 * Show the dar dinero content and hide other sections
 */
export function showDarDineroContent() {
    const contentSections = document.querySelectorAll('.content > div:not(.cupon_lineas)');
    contentSections.forEach(section => {
        section.style.display = 'none';
    });

    const darDineroContent = document.querySelector('.dar-dinero-content');
    if (darDineroContent) {
        darDineroContent.style.display = 'block';
    } else {
        createDarDineroContent();
    }
}
