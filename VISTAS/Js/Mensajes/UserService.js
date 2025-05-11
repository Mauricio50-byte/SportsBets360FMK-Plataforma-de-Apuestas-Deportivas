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
            const response = await fetch('/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/check_session.php');
            const data = await response.json();
            
            if (data.loggedIn) {
                // Si el usuario está logueado, actualizar la interfaz
                this.updateUserInterface(data);
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
     * Cierra la sesión del usuario
     */
    logout: async function() {
        try {
            await fetch('/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/logout.php');
            window.location.href = '/index.html?success=logout';
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
    }
};

// Inicializar el servicio cuando se carga el documento
document.addEventListener('DOMContentLoaded', function() {
    // Verificar sesión y actualizar la interfaz
    window.userService.checkSession();
    
    // Inicializar listeners de eventos
    window.userService.initEventListeners();
});