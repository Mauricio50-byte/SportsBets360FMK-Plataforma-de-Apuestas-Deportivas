// MensajesLogin.js - Manejo de mensajes de error y éxito en login

document.addEventListener('DOMContentLoaded', function() {
    // Función para obtener parámetros de la URL
    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // Verificar si hay mensajes de error
    const error = getParameterByName('error');
    if (error) {
        let mensaje = '';
        let tipo = 'error';

        // Definir mensaje según el tipo de error
        switch (error) {
            case 'campos_vacios':
                mensaje = 'Por favor, complete todos los campos.';
                break;
            case 'credenciales_invalidas':
                mensaje = 'Email o contraseña incorrectos.';
                break;
            default:
                mensaje = 'Ha ocurrido un error. Inténtelo de nuevo.';
        }

        // Mostrar mensaje de error
        mostrarMensaje(mensaje, tipo);
    }

    // Verificar si hay mensajes de éxito
    const success = getParameterByName('success');
    if (success) {
        let mensaje = '';
        let tipo = 'success';

        // Definir mensaje según el tipo de éxito
        switch (success) {
            case 'registro':
                mensaje = 'Registro exitoso. Ya puede iniciar sesión.';
                break;
            case 'logout':
                mensaje = 'Ha cerrado sesión correctamente.';
                break;
            default:
                mensaje = 'Operación realizada con éxito.';
        }

        // Mostrar mensaje de éxito
        mostrarMensaje(mensaje, tipo);
    }

    /**
     * Muestra un mensaje en el formulario de login
     * @param {string} mensaje - Texto del mensaje
     * @param {string} tipo - Tipo de mensaje (error, success)
     */
    function mostrarMensaje(mensaje, tipo) {
        // Buscar el contenedor de mensajes en la pestaña activa
        let activeTab = document.querySelector('.tab-pane.active');
        if (!activeTab) return;

        // Comprobar si ya existe un mensaje anterior
        let mensajeExistente = activeTab.querySelector('.mensaje-alert');
        if (mensajeExistente) {
            mensajeExistente.remove();
        }

        // Crear elemento de mensaje
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = `alert alert-${tipo === 'error' ? 'danger' : 'success'} mensaje-alert`;
        mensajeDiv.innerHTML = mensaje;

        // Insertar mensaje al inicio del formulario
        const form = activeTab.querySelector('form');
        if (form) {
            form.insertBefore(mensajeDiv, form.firstChild);
        }

        // Remover el mensaje después de 5 segundos
        setTimeout(() => {
            mensajeDiv.remove();
        }, 5000);
    }

    // Mostrar modal de login automáticamente si hay un error o mensaje de éxito
    if (error || success) {
        const loginModal = document.getElementById('formulario-login');
        if (loginModal) {
            const bsModal = new bootstrap.Modal(loginModal);
            bsModal.show();
        }
    }
});