/**
 * AlmacenamientoService.js
 * Servicio que maneja el almacenamiento local de datos en SportsBets360FMK
 */

class AlmacenamientoService {
    constructor() {
        // Inicializar o cargar datos si es necesario
        this.init();
    }
    
    /**
     * Inicializa el servicio y carga datos si es necesario
     */
    init() {
        // Crear estructuras de datos si no existen
        if (!localStorage.getItem('usuarios')) {
            localStorage.setItem('usuarios', JSON.stringify([]));
        }
        
        if (!localStorage.getItem('recargas')) {
            localStorage.setItem('recargas', JSON.stringify([]));
        }
        
        if (!localStorage.getItem('retiros')) {
            localStorage.setItem('retiros', JSON.stringify([]));
        }
        
        // Iniciar con un usuario de prueba si no hay usuarios
        const usuarios = this.getUsuarios();
        if (usuarios.length === 0) {
            const usuarioPrueba = {
                id: 'USR-001',
                nombre: 'Usuario Prueba',
                documento: '12345678',
                correo: 'usuario@ejemplo.com',
                saldo: 1000
            };
            this.saveUsuario(usuarioPrueba);
            this.setCurrentUser(usuarioPrueba);
        }
    }
    
    /**
     * Obtiene todos los usuarios registrados
     * @returns {Array} Array de usuarios
     */
    getUsuarios() {
        return JSON.parse(localStorage.getItem('usuarios') || '[]');
    }
    
    /**
     * Guarda un nuevo usuario
     * @param {Object} usuario - Datos del usuario
     */
    saveUsuario(usuario) {
        const usuarios = this.getUsuarios();
        const existeUsuario = usuarios.findIndex(u => u.id === usuario.id);
        
        if (existeUsuario >= 0) {
            usuarios[existeUsuario] = usuario;
        } else {
            usuarios.push(usuario);
        }
        
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
    
    /**
     * Establece el usuario actual en la sesión
     * @param {Object} usuario - Datos del usuario
     */
    setCurrentUser(usuario) {
        sessionStorage.setItem('currentUser', JSON.stringify(usuario));
    }
    
    /**
     * Obtiene el usuario actual de la sesión
     * @returns {Object|null} Usuario actual o null si no hay sesión
     */
    getCurrentUser() {
        return JSON.parse(sessionStorage.getItem('currentUser') || 'null');
    }
    
    /**
     * Actualiza los datos del usuario actual
     * @param {Object} usuario - Datos actualizados del usuario
     */
    updateCurrentUser(usuario) {
        // Actualizar en la sesión
        this.setCurrentUser(usuario);
        
        // Actualizar en el almacenamiento
        this.saveUsuario(usuario);
    }
    
    /**
     * Cierra la sesión del usuario actual
     */
    logout() {
        sessionStorage.removeItem('currentUser');
    }
    
    /**
     * Obtiene todas las recargas
     * @returns {Array} Array de recargas
     */
    getRecargas() {
        return JSON.parse(localStorage.getItem('recargas') || '[]');
    }
    
    /**
     * Guarda una nueva recarga
     * @param {Object} recarga - Datos de la recarga
     */
    saveRecarga(recarga) {
        const recargas = this.getRecargas();
        recargas.push(recarga);
        localStorage.setItem('recargas', JSON.stringify(recargas));
    }
    
    /**
     * Obtiene todos los retiros
     * @returns {Array} Array de retiros
     */
    getRetiros() {
        return JSON.parse(localStorage.getItem('retiros') || '[]');
    }
    
    /**
     * Guarda un nuevo retiro
     * @param {Object} retiro - Datos del retiro
     */
    saveRetiro(retiro) {
        const retiros = this.getRetiros();
        retiros.push(retiro);
        localStorage.setItem('retiros', JSON.stringify(retiros));
    }
    
    /**
     * Actualiza el estado de un retiro
     * @param {string} retiroId - ID del retiro
     * @param {string} nuevoEstado - Nuevo estado del retiro
     */
    updateRetiroStatus(retiroId, nuevoEstado) {
        const retiros = this.getRetiros();
        const retiroIndex = retiros.findIndex(r => r.id === retiroId);
        
        if (retiroIndex >= 0) {
            retiros[retiroIndex].estado = nuevoEstado;
            localStorage.setItem('retiros', JSON.stringify(retiros));
            return true;
        }
        
        return false;
    }
}

// Exportar la clase para que pueda ser utilizada por otros archivos
window.AlmacenamientoService = AlmacenamientoService;