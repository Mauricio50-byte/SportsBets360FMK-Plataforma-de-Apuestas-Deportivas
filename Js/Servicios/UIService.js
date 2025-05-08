/**
 * Script de inicialización corregido que conecta todos los servicios
 * SportsBets360FMK - Sistema de gestión de saldo, recargas y retiros
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando aplicación SportsBets360FMK...');
   
    // Inicializar el servicio de almacenamiento
    window.storageService = new AlmacenamientoService();
    console.log('AlmacenamientoService inicializado');
   
    // Inicializar servicios que dependen del almacenamiento
    window.recargaService = new RecargaService(window.storageService);
    console.log('RecargaService inicializado');
   
    // Corregido: se usa RetirosService en lugar de RetiroService
    window.retirosService = new RetirosService(window.storageService);
    console.log('RetirosService inicializado');
   
    // Reemplazar RecargaService con la versión corregida que sí actualiza la UI
    window.recargaService = new FixedRecargaService(window.storageService);
    console.log('RecargaService reemplazado por versión corregida');
   
    // Actualizar la interfaz con los datos del usuario actual (si existe)
    actualizarInterfazUsuario();
   
    // Configurar el botón de logout si existe
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            window.storageService.logout();
            alert('Sesión cerrada. ¡Hasta pronto!');
            actualizarInterfazUsuario();
           
            // Redirigir a la página de inicio o login si es necesario
            // window.location.href = 'login.html';
        });
        console.log('Botón de logout configurado');
    }
   
    // Asegurar que el evento de apertura del formulario de recarga funcione
    const recargasLink = document.getElementById('recargas-link');
    if (recargasLink) {
        recargasLink.addEventListener('click', function() {
            window.recargaService.openRecargaModal();
        });
    }

    // Configurar evento para abrir modal de retiros
    const retirosLink = document.getElementById('retiros-link');
    if (retirosLink) {
        retirosLink.addEventListener('click', function() {
            window.retirosService.openRetiroModal();
        });
    }
   
    console.log('Inicialización completa');
});

/**
 * Actualiza la interfaz de usuario con los datos de la sesión actual
 */
function actualizarInterfazUsuario() {
    const currentUser = window.storageService.getCurrentUser();
   
    // Actualizar nombre de usuario
    const userNameElement = document.getElementById('current-user');
    if (userNameElement) {
        userNameElement.textContent = currentUser ? (currentUser.nombre || 'Usuario') : 'Invitado';
    }
   
    // Actualizar saldo - importante que esto sea consistente en toda la aplicación
    const balanceElement = document.getElementById('user-balance');
    if (balanceElement) {
        const saldo = currentUser ? (currentUser.saldo || 0) : 0;
        balanceElement.textContent = `$ ${saldo.toFixed(2)}`;
        console.log('Saldo actualizado en la UI:', saldo);
    } else {
        console.error('No se pudo encontrar el elemento de saldo (user-balance)');
    }
}

/**
 * Función global para actualizar el saldo del usuario en la interfaz
 * Esta función puede ser llamada desde cualquier parte de la aplicación
 */
window.actualizarSaldoUI = function() {
    const currentUser = window.storageService.getCurrentUser();
    if (currentUser) {
        const balanceElement = document.getElementById('user-balance');
        if (balanceElement) {
            balanceElement.textContent = `$ ${currentUser.saldo.toFixed(2)}`;
            console.log('Saldo actualizado mediante función global:', currentUser.saldo);
        }
    }
};