/**
 * RetirosService.js - VERSIÓN CORREGIDA
 * Servicio que maneja la lógica de retiros en SportsBets360FMK
 */
class RetirosService {
    constructor(storageService) {
        if (!storageService) {
            console.error('RetirosService: StorageService no proporcionado');
            throw new Error('StorageService es requerido para RetirosService');
        }
        
        this.storageService = storageService;
        this.initElements();
        this.setupEventListeners();
        
        console.log('RetirosService: Inicializado correctamente');
    }

    /**
     * Inicializa referencias a elementos del DOM relacionados con retiros
     */
    initElements() {
        // Modal y formulario de retiro
        this.retirosModal = document.getElementById('retiros-modal');
        if (!this.retirosModal) {
            console.error('RetirosService: No se encontró el modal de retiros (id="retiros-modal")');
        }
        
        this.retiroForm = document.getElementById('retiro-form');
        if (!this.retiroForm) {
            console.error('RetirosService: No se encontró el formulario de retiros (id="retiro-form")');
        }
        
        if (this.retirosModal) {
            this.closeModalBtn = this.retirosModal.querySelector('.close-modal');
            if (!this.closeModalBtn) {
                console.error('RetirosService: No se encontró el botón para cerrar el modal (.close-modal)');
            }
        }
        
        // Campos del formulario
        this.idRetiroInput = document.getElementById('id-retiro');
        this.fechaRetiroInput = document.getElementById('fecha-retiro');
        this.nombreUsuarioInput = document.getElementById('nombre-usuario-retiro');
        this.documentoUsuarioInput = document.getElementById('documento-usuario-retiro');
        this.correoUsuarioInput = document.getElementById('correo-usuario-retiro');
        this.montoRetiroInput = document.getElementById('monto-retiro');
        
        // Botón del menú principal
        this.retirosLink = document.getElementById('retiros-link');
        if (!this.retirosLink) {
            console.error('RetirosService: No se encontró el enlace de retiros (id="retiros-link")');
        }
        
        console.log('RetirosService: Elementos inicializados');
    }

    /**
     * Configura los event listeners para la funcionalidad de retiros
     */
    setupEventListeners() {
        // Event listener para abrir el modal desde el menú principal
        if (this.retirosLink) {
            this.retirosLink.addEventListener('click', () => this.openRetiroModal());
            console.log('RetirosService: Event listener para retiros configurado');
        }

        // Event listener para cerrar el modal
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => this.closeModal());
            console.log('RetirosService: Event listener para cerrar modal configurado');
        }

        // Event listener para el envío del formulario
        if (this.retiroForm) {
            this.retiroForm.addEventListener('submit', (e) => this.handleRetiroSubmit(e));
            console.log('RetirosService: Event listener para envío de formulario configurado');
        }

        // Cerrar modal al hacer click fuera de él
        if (this.retirosModal) {
            window.addEventListener('click', (e) => {
                if (e.target === this.retirosModal) {
                    this.closeModal();
                }
            });
        }
    }

    /**
     * Abre el modal de retiro y prepara el formulario
     */
    openRetiroModal() {
        if (!this.retirosModal) {
            console.error('RetirosService: No se puede abrir el modal porque no se encontró en el DOM');
            return;
        }
        
        // Generar ID de retiro único
        const retiroId = this.generateUniqueId();
        if (this.idRetiroInput) {
            this.idRetiroInput.value = retiroId;
        }
        
        // Establecer la fecha actual
        const fechaActual = new Date().toLocaleDateString('es-ES');
        if (this.fechaRetiroInput) {
            this.fechaRetiroInput.value = fechaActual;
        }
        
        // Autocompletar datos del usuario si está disponible
        const currentUser = this.storageService.getCurrentUser();
        if (currentUser) {
            if (this.nombreUsuarioInput) {
                this.nombreUsuarioInput.value = currentUser.nombre || '';
            }
            if (this.documentoUsuarioInput) {
                this.documentoUsuarioInput.value = currentUser.documento || '';
            }
            if (this.correoUsuarioInput) {
                this.correoUsuarioInput.value = currentUser.correo || '';
            }
        }
        
        // Mostrar el modal
        this.retirosModal.style.display = 'flex';
        console.log('RetirosService: Modal de retiro abierto');
    }

    /**
     * Cierra el modal de retiro
     */
    closeModal() {
        if (this.retirosModal) {
            this.retirosModal.style.display = 'none';
            console.log('RetirosService: Modal de retiro cerrado');
        }
        
        if (this.retiroForm) {
            this.retiroForm.reset();
        }
    }

    /**
     * Maneja el envío del formulario de retiro
     * @param {Event} e - Evento del formulario
     */
    handleRetiroSubmit(e) {
        e.preventDefault();
        console.log('RetirosService: Procesando formulario de retiro');
        
        // Validar campos
        if (!this.validateRetiroForm()) {
            return;
        }
        
        try {
            // Crear objeto de retiro
            const retiro = {
                id: this.idRetiroInput ? this.idRetiroInput.value : this.generateUniqueId(),
                fecha: this.fechaRetiroInput ? this.fechaRetiroInput.value : new Date().toLocaleDateString('es-ES'),
                usuario: this.nombreUsuarioInput ? this.nombreUsuarioInput.value : '',
                documento: this.documentoUsuarioInput ? this.documentoUsuarioInput.value : '',
                correo: this.correoUsuarioInput ? this.correoUsuarioInput.value : '',
                monto: this.montoRetiroInput ? parseFloat(this.montoRetiroInput.value) : 0,
                estado: 'Pendiente',
                timestamp: new Date().getTime()
            };
            
            console.log('RetirosService: Retiro creado', retiro);
            
            // Validar que el usuario tenga saldo suficiente
            const currentUser = this.storageService.getCurrentUser();
            if (!currentUser) {
                alert('No hay usuario activo para realizar el retiro.');
                return;
            }
            
            // Asegurarnos de que haya un saldo actual y sea suficiente
            currentUser.saldo = currentUser.saldo || 0;
            if (currentUser.saldo < retiro.monto) {
                alert(`Saldo insuficiente para realizar este retiro. Saldo actual: $${currentUser.saldo.toFixed(2)}`);
                return;
            }
            
            // Guardar el retiro
            this.storageService.saveRetiro(retiro);
            
            // Actualizar el saldo del usuario (restando el monto)
            this.updateUserBalance(-retiro.monto);
            
            // Mostrar mensaje de éxito
            alert(`Solicitud de retiro de $${retiro.monto} realizada con éxito. Estado: Pendiente`);
            
            // Cerrar el modal
            this.closeModal();
        } catch (error) {
            console.error('RetirosService: Error al procesar el retiro', error);
            alert('Error al procesar el retiro: ' + error.message);
        }
    }

    /**
     * Valida el formulario de retiro antes de procesarlo
     * @returns {boolean} Verdadero si el formulario es válido
     */
    validateRetiroForm() {
        if (this.nombreUsuarioInput && !this.nombreUsuarioInput.value.trim()) {
            alert('Por favor, ingrese su nombre de usuario.');
            return false;
        }
        
        if (this.documentoUsuarioInput && !this.documentoUsuarioInput.value.trim()) {
            alert('Por favor, ingrese su número de documento.');
            return false;
        }
        
        if (this.correoUsuarioInput && !this.correoUsuarioInput.value.trim()) {
            alert('Por favor, ingrese su correo electrónico.');
            return false;
        }
        
        if (this.montoRetiroInput && 
            (!this.montoRetiroInput.value || parseFloat(this.montoRetiroInput.value) <= 0)) {
            alert('Por favor, ingrese un monto válido mayor a 0.');
            return false;
        }
        
        return true;
    }

    /**
     * Actualiza el saldo del usuario después de un retiro
     * @param {number} monto - Monto a retirar (valor negativo)
     */
    updateUserBalance(monto) {
        if (!this.storageService) {
            console.error('RetirosService: Storage service no está inicializado');
            return;
        }
        
        try {
            const currentUser = this.storageService.getCurrentUser();
            if (currentUser) {
                // Asegurarnos de que haya un saldo actual
                currentUser.saldo = currentUser.saldo || 0;
                
                // Sumar el monto al saldo actual (restar en caso de retiro)
                currentUser.saldo += monto;
                
                // Guardar el usuario actualizado
                this.storageService.updateCurrentUser(currentUser);
                
                console.log('RetirosService: Saldo actualizado:', currentUser.saldo);
                
                // Actualizar la visualización del saldo en la UI
                this.updateBalanceDisplay(currentUser.saldo);
                
                // Intento adicional usando la función global si existe
                if (typeof window.actualizarSaldoUI === 'function') {
                    window.actualizarSaldoUI();
                }
            } else {
                console.error('RetirosService: No hay usuario activo para actualizar saldo');
            }
        } catch (error) {
            console.error('RetirosService: Error al actualizar el saldo', error);
        }
    }

    /**
     * Actualiza la visualización del saldo en la interfaz de usuario
     * @param {number} saldo - El saldo actualizado
     */
    updateBalanceDisplay(saldo) {
        // IMPORTANTE: Siempre buscar el elemento en tiempo real
        // No depender de una referencia guardada anteriormente
        const balanceElement = document.getElementById('user-balance');
        
        if (balanceElement) {
            balanceElement.textContent = `$ ${saldo.toFixed(2)}`;
            console.log('RetirosService: Elemento de saldo actualizado en la UI');
        } else {
            console.error('RetirosService: No se pudo encontrar el elemento de saldo (id="user-balance")');
            
            // Intento adicional - buscar por otras clases o selectores que puedan contener el saldo
            const alternativeBalanceElements = document.querySelectorAll('.user-balance, .balance, .saldo');
            if (alternativeBalanceElements.length > 0) {
                alternativeBalanceElements.forEach(el => {
                    el.textContent = `$ ${saldo.toFixed(2)}`;
                });
                console.log('RetirosService: Se actualizaron elementos alternativos de saldo');
            }
        }
    }

    /**
     * Genera un ID único para el retiro
     * @returns {string} ID único para el retiro
     */
    generateUniqueId() {
        const prefix = 'RET';
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${random}`;
    }
}

/**
 * Versión mejorada del servicio de retiros para garantizar la actualización del saldo en la UI
 */
class FixedRetirosService extends RetirosService {
    /**
     * Constructor de la versión mejorada
     * @param {object} storageService - Servicio de almacenamiento
     */
    constructor(storageService) {
        super(storageService);
        console.log('FixedRetirosService: Inicializado correctamente');
    }
    
    /**
     * Sobrescribe el método updateUserBalance para asegurar que el saldo se actualiza correctamente
     * @param {number} monto - Monto a retirar (valor negativo)
     */
    updateUserBalance(monto) {
        if (!this.storageService) {
            console.error('FixedRetirosService: Storage service no está inicializado');
            return;
        }
        
        try {
            const currentUser = this.storageService.getCurrentUser();
            if (currentUser) {
                // Asegurarnos de que haya un saldo actual
                currentUser.saldo = currentUser.saldo || 0;
                
                // Sumar el monto al saldo actual (restar en caso de retiro)
                currentUser.saldo += monto;
                
                // Asegurar que el saldo no sea negativo
                if (currentUser.saldo < 0) {
                    console.error('FixedRetirosService: Operación generaría saldo negativo');
                    currentUser.saldo -= monto; // Revertir operación
                    throw new Error('El monto supera el saldo disponible');
                }
                
                // Guardar el usuario actualizado
                this.storageService.updateCurrentUser(currentUser);
                
                console.log('FixedRetirosService: Saldo actualizado:', currentUser.saldo);
                
                // SOLUCIÓN: Actualizar la UI de manera efectiva
                this.updateBalanceDisplay(currentUser.saldo);
                
                // Intento adicional usando la función global si existe
                if (typeof window.actualizarSaldoUI === 'function') {
                    window.actualizarSaldoUI();
                }
            }
        } catch (error) {
            console.error('FixedRetirosService: Error al actualizar el saldo', error);
            alert('Error al actualizar el saldo: ' + error.message);
        }
    }
    
    /**
     * Método específico para actualizar la visualización del saldo
     * @param {number} saldo - El saldo actualizado
     */
    updateBalanceDisplay(saldo) {
        // IMPORTANTE: Siempre buscar el elemento en tiempo real
        // No depender de una referencia guardada anteriormente
        const balanceElement = document.getElementById('user-balance');
        
        if (balanceElement) {
            balanceElement.textContent = `$ ${saldo.toFixed(2)}`;
            console.log('FixedRetirosService: Elemento de saldo actualizado en la UI');
        } else {
            console.error('FixedRetirosService: No se pudo encontrar el elemento de saldo (id="user-balance")');
            
            // Intento adicional - buscar por otras clases o selectores que puedan contener el saldo
            const alternativeBalanceElements = document.querySelectorAll('.user-balance, .balance, .saldo');
            if (alternativeBalanceElements.length > 0) {
                alternativeBalanceElements.forEach(el => {
                    el.textContent = `$ ${saldo.toFixed(2)}`;
                });
                console.log('FixedRetirosService: Se actualizaron elementos alternativos de saldo');
            }
        }
    }
}

/**
 * Script de inicialización para aplicar las correcciones
 */
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya existe un servicio de almacenamiento
    const storageService = window.storageService || new AlmacenamientoService();
    
    // Crear o reemplazar el servicio de retiros con la versión corregida
    window.retirosService = new FixedRetirosService(storageService);
    
    // Actualizar el saldo inicial en la UI
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
        const balanceElement = document.getElementById('user-balance');
        if (balanceElement) {
            balanceElement.textContent = `$ ${(currentUser.saldo || 0).toFixed(2)}`;
        }
    }
    
    console.log('Correcciones del servicio de retiros aplicadas correctamente.');
});

// Exportar las clases para que puedan ser utilizadas por otros archivos
window.RetirosService = RetirosService;
window.FixedRetirosService = FixedRetirosService;