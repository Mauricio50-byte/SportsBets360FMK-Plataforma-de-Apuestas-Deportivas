/**
 * StorageDB - Servicio de almacenamiento local para SportsBets360FMK
 * Gestiona el almacenamiento y recuperación de datos en localStorage
 */

const StorageDB = {
    /**
     * Inicializa las estructuras de datos en localStorage si no existen
     */
    init: function() {
        // Inicializar las estructuras de datos si no existen
        if (!localStorage.getItem('usuarios')) {
            localStorage.setItem('usuarios', JSON.stringify([]));
        }
        if (!localStorage.getItem('recargas')) {
            localStorage.setItem('recargas', JSON.stringify([]));
        }
        if (!localStorage.getItem('retiros')) {
            localStorage.setItem('retiros', JSON.stringify([]));
        }
        if (!localStorage.getItem('apuestas')) {
            localStorage.setItem('apuestas', JSON.stringify([]));
        }
        if (!localStorage.getItem('recargaCounter')) {
            localStorage.setItem('recargaCounter', '1000');
        }
        if (!localStorage.getItem('retiroCounter')) {
            localStorage.setItem('retiroCounter', '1000');
        }
    },
    
    /**
     * Obtiene la lista de usuarios
     * @return {Array} Lista de usuarios
     */
    getUsuarios: function() {
        return JSON.parse(localStorage.getItem('usuarios') || '[]');
    },
    
    /**
     * Busca un usuario por su correo electrónico
     * @param {string} correo - Correo electrónico del usuario
     * @return {Object|null} Usuario encontrado o null
     */
    getUsuarioPorCorreo: function(correo) {
        const usuarios = this.getUsuarios();
        return usuarios.find(u => u.correo === correo) || null;
    },
    
    /**
     * Busca un usuario por su número de documento
     * @param {string} documento - Número de documento del usuario
     * @return {Object|null} Usuario encontrado o null
     */
    getUsuarioPorDocumento: function(documento) {
        const usuarios = this.getUsuarios();
        return usuarios.find(u => u.documento === documento) || null;
    },
    
    /**
     * Guarda o actualiza un usuario
     * @param {Object} usuario - Datos del usuario
     */
    saveUsuario: function(usuario) {
        const usuarios = this.getUsuarios();
        const index = usuarios.findIndex(u => u.correo === usuario.correo);
        
        if (index !== -1) {
            usuarios[index] = {...usuarios[index], ...usuario};
        } else {
            usuarios.push(usuario);
        }
        
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    },
    
    /**
     * Obtiene la lista de recargas
     * @return {Array} Lista de recargas
     */
    getRecargas: function() {
        return JSON.parse(localStorage.getItem('recargas') || '[]');
    },
    
    /**
     * Guarda un registro de recarga
     * @param {Object} recarga - Datos de la recarga
     */
    saveRecarga: function(recarga) {
        const recargas = this.getRecargas();
        recargas.push(recarga);
        localStorage.setItem('recargas', JSON.stringify(recargas));
        
        // Incrementar contador
        const counter = parseInt(localStorage.getItem('recargaCounter') || '1000');
        localStorage.setItem('recargaCounter', (counter + 1).toString());
    },
    
    /**
     * Obtiene el próximo ID para una recarga
     * @return {string} ID para la próxima recarga
     */
    getNextRecargaId: function() {
        const counter = localStorage.getItem('recargaCounter') || '1000';
        return `REC-${counter}`;
    },
    
    /**
     * Obtiene la lista de retiros
     * @return {Array} Lista de retiros
     */
    getRetiros: function() {
        return JSON.parse(localStorage.getItem('retiros') || '[]');
    },
    
    /**
     * Guarda un registro de retiro
     * @param {Object} retiro - Datos del retiro
     */
    saveRetiro: function(retiro) {
        const retiros = this.getRetiros();
        retiros.push(retiro);
        localStorage.setItem('retiros', JSON.stringify(retiros));
        
        // Incrementar contador
        const counter = parseInt(localStorage.getItem('retiroCounter') || '1000');
        localStorage.setItem('retiroCounter', (counter + 1).toString());
    },
    
    /**
     * Obtiene el próximo ID para un retiro
     * @return {string} ID para el próximo retiro
     */
    getNextRetiroId: function() {
        const counter = localStorage.getItem('retiroCounter') || '1000';
        return `RET-${counter}`;
    },
    
    /**
     * Obtiene la lista de apuestas
     * @return {Array} Lista de apuestas
     */
    getApuestas: function() {
        return JSON.parse(localStorage.getItem('apuestas') || '[]');
    },
    
    /**
     * Guarda un registro de apuesta
     * @param {Object} apuesta - Datos de la apuesta
     */
    saveApuesta: function(apuesta) {
        const apuestas = this.getApuestas();
        apuestas.push(apuesta);
        localStorage.setItem('apuestas', JSON.stringify(apuestas));
    },
    
    /**
     * Filtra apuestas por un criterio específico
     * @param {Function} filterFn - Función de filtrado
     * @return {Array} Lista de apuestas filtradas
     */
    filtrarApuestas: function(filterFn) {
        const apuestas = this.getApuestas();
        return apuestas.filter(filterFn);
    },
    
    /**
     * Actualiza el saldo de un usuario
     * @param {string} correo - Correo electrónico del usuario
     * @param {number} monto - Monto a agregar (positivo) o restar (negativo)
     * @return {Object|null} Usuario actualizado o null si no existe
     */
    actualizarSaldo: function(correo, monto) {
        const usuario = this.getUsuarioPorCorreo(correo);
        if (!usuario) return null;
        
        usuario.saldo = (usuario.saldo || 0) + monto;
        this.saveUsuario(usuario);
        return usuario;
    },
    
    /**
     * Limpia todos los datos almacenados (útil para testing)
     */
    clearAll: function() {
        localStorage.removeItem('usuarios');
        localStorage.removeItem('recargas');
        localStorage.removeItem('retiros');
        localStorage.removeItem('apuestas');
        localStorage.removeItem('recargaCounter');
        localStorage.removeItem('retiroCounter');
        this.init();
    }
};