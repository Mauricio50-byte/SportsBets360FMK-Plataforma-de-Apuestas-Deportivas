/**
 * UIService.js
 * Servicio encargado de gestionar la interfaz de usuario
 */

class UIService {
    /**
     * Inicializa el servicio de UI
     */
    static init() {
        // Inicializar los eventos relacionados con la UI
        this.initEventos();
    }

    /**
     * Inicializa los eventos relacionados con la UI
     */
    static initEventos() {
        // Eventos para la barra lateral
        const logoEl = document.querySelector('.logo');
        const sidebarOverlayEl = document.querySelector('.sidebar-overlay');
        
        if (logoEl) logoEl.addEventListener('click', this.toggleSidebar);
        if (sidebarOverlayEl) sidebarOverlayEl.addEventListener('click', this.closeSidebar);
        
        // Eventos para los modales
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', this.cerrarModal);
        });
        
        // Evento para botón de cierre de sesión
        const logoutBtnEl = document.getElementById('logout-btn');
        if (logoutBtnEl) {
            logoutBtnEl.addEventListener('click', this.cerrarSesion);
        }
    }

    /**
     * Muestra el usuario actualmente logueado
     */
    static mostrarUsuarioLogueado() {
        // En una aplicación real, esto vendría de una sesión
        const usuarios = StorageDB.getUsuarios();
        if (usuarios.length > 0) {
            const usuario = usuarios[0];
            const currentUserEl = document.getElementById('current-user');
            const userBalanceEl = document.getElementById('user-balance');
            
            if (currentUserEl) currentUserEl.textContent = usuario.usuario;
            if (userBalanceEl) userBalanceEl.textContent = `$ ${usuario.saldo}`;
        }
    }

    /**
     * Actualiza el saldo del usuario en la interfaz
     * @param {number} saldo - Nuevo saldo del usuario
     */
    static actualizarSaldoEnUI(saldo) {
        const userBalanceEl = document.getElementById('user-balance');
        if (userBalanceEl) {
            userBalanceEl.textContent = `$ ${saldo}`;
        }
    }

    /**
     * Muestra un mensaje al usuario
     * @param {string} mensaje - Mensaje a mostrar
     */
    static mostrarMensaje(mensaje) {
        alert(mensaje);
    }

    /**
     * Alterna la visibilidad de la barra lateral
     */
    static toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        const content = document.querySelector('.content');
        
        if (sidebar && overlay && content) {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
            content.classList.toggle('sidebar-open');
        }
    }

    /**
     * Cierra la barra lateral
     */
    static closeSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        const content = document.querySelector('.content');
        
        if (sidebar && overlay && content) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            content.classList.remove('sidebar-open');
        }
    }

    /**
     * Cierra todos los modales abiertos
     */
    static cerrarModal() {
        const modales = document.querySelectorAll('.modal');
        modales.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    /**
     * Muestra la sección especificada
     * @param {string} idSeccion - ID de la sección a mostrar
     */
    static mostrarSeccion(idSeccion) {
        // Desactivar todos los enlaces de navegación
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Activar el enlace correspondiente
        const activeLink = document.getElementById(`${idSeccion}-link`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /**
     * Cierra la sesión del usuario (simulada)
     */
    static cerrarSesion() {
        // En una aplicación real, esto enviaría una petición al servidor
        UIService.mostrarMensaje('Sesión cerrada correctamente');
        location.reload();
    }
}