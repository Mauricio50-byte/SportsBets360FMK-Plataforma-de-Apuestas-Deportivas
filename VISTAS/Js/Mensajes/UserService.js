// UserService.js - Manejo de sesión de usuario y datos del perfil

/**
 * Servicio para gestionar la sesión del usuario y sus datos
 */
window.userService = {
    /**
     * Verifica si hay una sesión activa del usuario
     * @returns {Promise<boolean>} - Promise que resuelve a true si hay sesión activa
     */
    checkSession: async function() {
        try {
            const response = await fetch('http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/Usuario/check_session.php');
            const data = await response.json();
            
            if (data.loggedIn) {
                // Si el usuario está logueado, actualizar la interfaz
                this.updateUserInterface(data);
                
                // Almacenar datos del usuario en sessionStorage para que RecargaRetiroService pueda acceder
                this.storeUserData(data);
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al verificar la sesión:', error);
            return false;
        }
    },

    /**
     * Actualiza la interfaz con los datos del usuario
     * @param {Object} userData - Datos del usuario
     */
    updateUserInterface: function(userData) {
        // Actualizar el nombre del usuario
        const userNameElement = document.getElementById('current-user');
        if (userNameElement) {
            userNameElement.textContent = userData.nombre ? `${userData.nombre} ${userData.apellido || ''}` : 'Invitado';
        }

        // Actualizar el saldo del usuario
        const userBalanceElement = document.getElementById('user-balance');
        if (userBalanceElement) {
            userBalanceElement.textContent = userData.saldo ? `$ ${userData.saldo}` : '$ 0';
        }
    },
    
    /**
     * Almacena los datos del usuario en sessionStorage
     * @param {Object} userData - Datos del usuario
     */
    storeUserData: function(userData) {
        // Guardar en sessionStorage para uso por RecargaRetiroService
        if (window.sessionStorage) {
            const userDataToStore = {
                id: userData.id || '',
                nombre: userData.nombre || '',
                apellido: userData.apellido || '',
                documento: userData.documento || '',
                correo: userData.correo || '',
                saldo: userData.saldo || 0
            };
            
            sessionStorage.setItem('usuario', JSON.stringify(userDataToStore));
        }
    },

    /**
     * Cierra la sesión del usuario
     */
    logout: async function() {
        try {
            await fetch('http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/Usuario/logout.php');
            
            // Limpiar datos de sessionStorage
            if (window.sessionStorage) {
                sessionStorage.removeItem('usuario');
            }
            
            window.location.href = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/View/index.html?success=logout';
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    },

    /**
     * Inicializa los listeners de eventos relacionados con el usuario
     */
    initEventListeners: function() {
        // Listener para el botón de logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    },
    
    /**
     * Actualiza el saldo del usuario después de una recarga o retiro
     * Esta función puede ser llamada desde RecargaRetiroService
     * @param {number} nuevoSaldo - Nuevo saldo del usuario
     */
    updateUserBalance: function(nuevoSaldo) {
        // Actualizar en la interfaz
        const userBalanceElement = document.getElementById('user-balance');
        if (userBalanceElement) {
            userBalanceElement.textContent = `$ ${nuevoSaldo.toFixed(2)}`;
        }
        
        // Actualizar en sessionStorage
        if (window.sessionStorage) {
            const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
            usuario.saldo = nuevoSaldo;
            sessionStorage.setItem('usuario', JSON.stringify(usuario));
        }
    },
    
    /**
     * Obtiene el saldo actual del usuario
     * @returns {number} Saldo actual
     */
    getUserBalance: function() {
        // Primero intentar obtener de sessionStorage
        if (window.sessionStorage) {
            const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
            if (usuario && usuario.saldo !== undefined) {
                return parseFloat(usuario.saldo);
            }
        }
        
        // Alternativa: obtener del elemento en el DOM
        const elementoSaldo = document.getElementById('user-balance');
        if (elementoSaldo) {
            const saldoTexto = elementoSaldo.textContent || '$ 0';
            return parseFloat(saldoTexto.replace('$', '').trim()) || 0;
        }
        
        return 0;
    }
};

// Inicializar el servicio cuando se carga el documento
document.addEventListener('DOMContentLoaded', function() {
    // Verificar sesión y actualizar la interfaz
    window.userService.checkSession();
    
    // Inicializar listeners de eventos
    window.userService.initEventListeners();
});