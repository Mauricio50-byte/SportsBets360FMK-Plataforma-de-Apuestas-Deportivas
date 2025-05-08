/**
 * RecargaService.js - VERSIÓN CORREGIDA
 * Servicio que maneja la lógica de recargas en SportsBets360FMK
 */

class RecargaService {
    constructor(storageService) {
        if (!storageService) {
            console.error('RecargaService: StorageService no proporcionado');
            throw new Error('StorageService es requerido para RecargaService');
        }
        
        this.storageService = storageService;
        this.initElements();
        this.setupEventListeners();
        
        console.log('RecargaService: Inicializado correctamente');
    }

    /**
     * Inicializa referencias a elementos del DOM relacionados con recargas
     */
    initElements() {
        // Modal y formulario de recarga
        this.recargasModal = document.getElementById('recargas-modal');
        if (!this.recargasModal) {
            console.error('RecargaService: No se encontró el modal de recargas (id="recargas-modal")');
        }
        
        this.recargaForm = document.getElementById('recargar-form');
        if (!this.recargaForm) {
            console.error('RecargaService: No se encontró el formulario de recargas (id="recargar-form")');
        }
        
        if (this.recargasModal) {
            this.closeModalBtn = this.recargasModal.querySelector('.close-modal');
            if (!this.closeModalBtn) {
                console.error('RecargaService: No se encontró el botón para cerrar el modal (.close-modal)');
            }
        }
        
        // Campos del formulario
        this.idRecargaInput = document.getElementById('id-recarga');
        this.fechaRecargaInput = document.getElementById('fecha-recarga');
        this.nombreUsuarioInput = document.getElementById('nombre-usuario');
        this.documentoUsuarioInput = document.getElementById('documento-usuario');
        this.correoUsuarioInput = document.getElementById('correo-usuario');
        this.montoRecargaInput = document.getElementById('monto-recarga');
        
        // IMPORTANTE: No guardar una referencia al elemento de saldo
        // En su lugar, siempre buscarla en tiempo real cuando se necesite actualizar
        
        console.log('RecargaService: Elementos inicializados');
    }

    /**
     * Configura los event listeners para la funcionalidad de recargas
     */
    setupEventListeners() {
        // Event listener para abrir el modal desde el menú principal
        const recargasLink = document.getElementById('recargas-link');
        if (recargasLink) {
            recargasLink.addEventListener('click', () => this.openRecargaModal());
            console.log('RecargaService: Event listener para recargas configurado');
        } else {
            console.error('RecargaService: No se encontró el enlace de recargas (id="recargas-link")');
        }

        // Event listener para cerrar el modal
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => this.closeModal());
            console.log('RecargaService: Event listener para cerrar modal configurado');
        }

        // Event listener para el envío del formulario
        if (this.recargaForm) {
            this.recargaForm.addEventListener('submit', (e) => this.handleRecargaSubmit(e));
            console.log('RecargaService: Event listener para envío de formulario configurado');
        }

        // Cerrar modal al hacer click fuera de él
        if (this.recargasModal) {
            window.addEventListener('click', (e) => {
                if (e.target === this.recargasModal) {
                    this.closeModal();
                }
            });
        }
    }

    /**
     * Abre el modal de recarga y prepara el formulario
     */
    openRecargaModal() {
        if (!this.recargasModal) {
            console.error('RecargaService: No se puede abrir el modal porque no se encontró en el DOM');
            return;
        }
        
        // Generar ID de recarga único
        const recargaId = this.generateUniqueId();
        if (this.idRecargaInput) {
            this.idRecargaInput.value = recargaId;
        }
        
        // Establecer la fecha actual
        const fechaActual = new Date().toLocaleDateString('es-ES');
        if (this.fechaRecargaInput) {
            this.fechaRecargaInput.value = fechaActual;
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
        this.recargasModal.style.display = 'flex';
        console.log('RecargaService: Modal de recarga abierto');
    }

    /**
     * Cierra el modal de recarga
     */
    closeModal() {
        if (this.recargasModal) {
            this.recargasModal.style.display = 'none';
            console.log('RecargaService: Modal de recarga cerrado');
        }
        
        if (this.recargaForm) {
            this.recargaForm.reset();
        }
    }

    /**
     * Maneja el envío del formulario de recarga
     * @param {Event} e - Evento del formulario
     */
    handleRecargaSubmit(e) {
        e.preventDefault();
        console.log('RecargaService: Procesando formulario de recarga');
        
        // Validar campos
        if (!this.validateRecargaForm()) {
            return;
        }
        
        // Crear objeto de recarga
        const recarga = {
            id: this.idRecargaInput ? this.idRecargaInput.value : this.generateUniqueId(),
            fecha: this.fechaRecargaInput ? this.fechaRecargaInput.value : new Date().toLocaleDateString('es-ES'),
            usuario: this.nombreUsuarioInput ? this.nombreUsuarioInput.value : '',
            documento: this.documentoUsuarioInput ? this.documentoUsuarioInput.value : '',
            correo: this.correoUsuarioInput ? this.correoUsuarioInput.value : '',
            monto: this.montoRecargaInput ? parseFloat(this.montoRecargaInput.value) : 0,
            estado: 'Completada',
            timestamp: new Date().getTime()
        };
        
        console.log('RecargaService: Recarga creada', recarga);
        
        try {
            // Guardar la recarga
            this.storageService.saveRecarga(recarga);
            
            // Actualizar el saldo del usuario
            this.updateUserBalance(recarga.monto);
            
            // Mostrar mensaje de éxito
            alert(`Recarga de $${recarga.monto} realizada con éxito.`);
            
            // Cerrar el modal
            this.closeModal();
        } catch (error) {
            console.error('RecargaService: Error al procesar la recarga', error);
            alert('Error al procesar la recarga: ' + error.message);
        }
    }

    /**
     * Valida el formulario de recarga antes de procesarlo
     * @returns {boolean} Verdadero si el formulario es válido
     */
    validateRecargaForm() {
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
        
        if (this.montoRecargaInput && 
            (!this.montoRecargaInput.value || parseFloat(this.montoRecargaInput.value) <= 0)) {
            alert('Por favor, ingrese un monto válido mayor a 0.');
            return false;
        }
        
        return true;
    }

    /**
     * Actualiza el saldo del usuario después de una recarga
     * CORREGIDO: Ahora asegura la actualización del elemento en el DOM
     * @param {number} monto - Monto a recargar
     */
    updateUserBalance(monto) {
        if (!this.storageService) {
            console.error('RecargaService: Storage service no está inicializado');
            return;
        }
        
        try {
            const currentUser = this.storageService.getCurrentUser();
            if (currentUser) {
                // Asegurarnos de que haya un saldo actual
                currentUser.saldo = currentUser.saldo || 0;
                
                // Sumar el monto al saldo actual
                currentUser.saldo += monto;
                
                // Guardar el usuario actualizado
                this.storageService.updateCurrentUser(currentUser);
                
                console.log('RecargaService: Saldo actualizado:', currentUser.saldo);
                
                // SOLUCIÓN: Obtener siempre una referencia fresca al elemento de saldo
                const balanceElement = document.getElementById('user-balance');
                
                if (balanceElement) {
                    // Actualizar el contenido con el nuevo saldo formateado
                    balanceElement.textContent = `$ ${currentUser.saldo.toFixed(2)}`;
                    console.log('RecargaService: Elemento de saldo actualizado en la UI');
                } else {
                    console.error('RecargaService: No se pudo encontrar el elemento de saldo del usuario (id="user-balance")');
                }
                
                // Si existe la función global, también usarla
                if (typeof window.actualizarSaldoUI === 'function') {
                    window.actualizarSaldoUI();
                }
            } else {
                console.error('RecargaService: No hay usuario activo para actualizar saldo');
            }
        } catch (error) {
            console.error('RecargaService: Error al actualizar el saldo', error);
        }
    }

    /**
     * Genera un ID único para la recarga
     * @returns {string} ID único para la recarga
     */
    generateUniqueId() {
        const prefix = 'REC';
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${random}`;
    }
}

// Versión corregida que garantiza la actualización del saldo en la UI
class FixedRecargaService extends RecargaService {
    /**
     * Sobrescribe el método updateUserBalance para asegurar que el saldo se actualiza correctamente
     * @param {number} monto - Monto a recargar
     */
    updateUserBalance(monto) {
        if (!this.storageService) {
            console.error('Storage service no está inicializado');
            return;
        }
        
        try {
            const currentUser = this.storageService.getCurrentUser();
            if (currentUser) {
                // Asegurarnos de que haya un saldo actual
                currentUser.saldo = currentUser.saldo || 0;
                
                // Sumar el monto al saldo actual
                currentUser.saldo += monto;
                
                // Guardar el usuario actualizado
                this.storageService.updateCurrentUser(currentUser);
                
                console.log('FixedRecargaService: Saldo actualizado:', currentUser.saldo);
                
                // SOLUCIÓN: Actualizar la UI de manera efectiva
                this.updateBalanceDisplay(currentUser.saldo);
                
                // Intento adicional usando la función global si existe
                if (typeof window.actualizarSaldoUI === 'function') {
                    window.actualizarSaldoUI();
                }
            }
        } catch (error) {
            console.error('FixedRecargaService: Error al actualizar el saldo', error);
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
            console.log('FixedRecargaService: Elemento de saldo actualizado en la UI');
        } else {
            console.error('FixedRecargaService: No se pudo encontrar el elemento de saldo (id="user-balance")');
            
            // Intento adicional - buscar por otras clases o selectores que puedan contener el saldo
            const alternativeBalanceElements = document.querySelectorAll('.user-balance, .balance, .saldo');
            if (alternativeBalanceElements.length > 0) {
                alternativeBalanceElements.forEach(el => {
                    el.textContent = `$ ${saldo.toFixed(2)}`;
                });
                console.log('FixedRecargaService: Se actualizaron elementos alternativos de saldo');
            }
        }
    }
}

// Exportar la clase para que pueda ser utilizada por otros archivos
window.RecargaService = RecargaService;
window.FixedRecargaService = FixedRecargaService;