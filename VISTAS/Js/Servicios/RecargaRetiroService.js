/**
 * RecargaRetiroService.js
 * Servicio para gestionar las operaciones de recarga y retiro de saldo
 */

class RecargaRetiroService {
    constructor() {
        // Inicializar elementos del DOM para recargas
        this.recargasModal = document.getElementById('recargas-modal');
        this.btnRecargas = document.getElementById('recargas-link');
        this.formRecargar = document.getElementById('recargar-form');
        
        // Inicializar elementos del DOM para retiros
        this.retirosModal = document.getElementById('retiros-modal');
        this.btnRetiros = document.getElementById('retiros-link');
        this.formRetiro = document.getElementById('retiro-form');
        
        // Botones para cerrar modales
        this.botonesClose = document.querySelectorAll('.close-modal');
        
        // Configurar event listeners
        this.configurarEventListeners();
    }
    
    /**
     * Configura los event listeners para los elementos del DOM
     */
    configurarEventListeners() {
        // Event listeners para recargas
        if (this.btnRecargas) {
            this.btnRecargas.addEventListener('click', () => this.mostrarModalRecargas());
        }
        
        if (this.formRecargar) {
            this.formRecargar.addEventListener('submit', (e) => this.procesarRecarga(e));
        }
        
        // Event listeners para retiros
        if (this.btnRetiros) {
            this.btnRetiros.addEventListener('click', () => this.mostrarModalRetiros());
        }
        
        if (this.formRetiro) {
            this.formRetiro.addEventListener('submit', (e) => this.procesarRetiro(e));
        }
        
        // Event listeners para cerrar modales
        this.botonesClose.forEach(boton => {
            boton.addEventListener('click', () => this.cerrarModales());
        });
        
        // Event listener para cerrar modales al hacer clic fuera de ellos
        window.addEventListener('click', (e) => {
            if (e.target === this.recargasModal) {
                this.recargasModal.style.display = 'none';
            }
            if (e.target === this.retirosModal) {
                this.retirosModal.style.display = 'none';
            }
        });
    }
    
    /**
     * Muestra el modal de recargas y prepara el formulario
     */
    mostrarModalRecargas() {
        // Generar ID único para la recarga
        document.getElementById('id-recarga').value = this.generarIdTransaccion('RC');
        
        // Establecer fecha actual
        document.getElementById('fecha-recarga').value = this.obtenerFechaActual();
        
        // Pre-llenar datos del usuario si está disponible en sesión
        this.precargarDatosUsuario('recargar-form');
        
        // Hacer los campos de usuario no editables
        this.hacerCamposNoEditables('recargar-form');
        
        // Mostrar el modal
        this.recargasModal.style.display = 'block';
    }
    
    /**
     * Muestra el modal de retiros y prepara el formulario
     */
    mostrarModalRetiros() {
        // Generar ID único para el retiro
        document.getElementById('id-retiro').value = this.generarIdTransaccion('RT');
        
        // Establecer fecha actual
        document.getElementById('fecha-retiro').value = this.obtenerFechaActual();
        
        // Pre-llenar datos del usuario si está disponible en sesión
        this.precargarDatosUsuario('retiro-form');
        
        // Hacer los campos de usuario no editables
        this.hacerCamposNoEditables('retiro-form');
        
        // Mostrar el modal
        this.retirosModal.style.display = 'block';
    }
    
    /**
     * Hace que los campos de usuario no sean editables
     * @param {string} formId - ID del formulario
     */
    hacerCamposNoEditables(formId) {
        if (formId === 'recargar-form') {
            document.getElementById('nombre-usuario').readOnly = true;
            document.getElementById('documento-usuario').readOnly = true;
            document.getElementById('correo-usuario').readOnly = true;
        } else if (formId === 'retiro-form') {
            document.getElementById('nombre-usuario-retiro').readOnly = true;
            document.getElementById('documento-usuario-retiro').readOnly = true;
            document.getElementById('correo-usuario-retiro').readOnly = true;
        }
    }
    
    /**
     * Cierra todos los modales
     */
    cerrarModales() {
        this.recargasModal.style.display = 'none';
        this.retirosModal.style.display = 'none';
    }
    
    /**
     * Procesa el formulario de recarga
     * @param {Event} e - Evento de submit del formulario
     */
    procesarRecarga(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const idRecarga = document.getElementById('id-recarga').value;
        const fechaRecarga = document.getElementById('fecha-recarga').value;
        
        const datosRecarga = {
            id_transaccion: idRecarga,
            fecha: fechaRecarga,
            usuario: document.getElementById('nombre-usuario').value,
            documento: document.getElementById('documento-usuario').value,
            correo: document.getElementById('correo-usuario').value,
            monto: document.getElementById('monto-recarga').value
        };
        
        // Validar datos
        if (!this.validarDatosTransaccion(datosRecarga)) {
            return;
        }
        
        console.log('Enviando datos de recarga:', datosRecarga);
        
        // Realizar petición al servidor
        fetch('http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/bd_RecargasRetiros/procesar_recarga.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: this.objetoAFormData(datosRecarga),
            credentials: 'include' // Importante: envía cookies con la solicitud
        })
        .then(response => {
            console.log('Respuesta del servidor:', response);
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data);
            this.manejarRespuestaServidor(data, 'recarga');
        })
        .catch(error => {
            console.error('Error al procesar recarga:', error);
            alert('Error al procesar la recarga. Por favor, intente nuevamente.');
        });
    }
    
    /**
     * Procesa el formulario de retiro
     * @param {Event} e - Evento de submit del formulario
     */
    procesarRetiro(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const idRetiro = document.getElementById('id-retiro').value;
        const fechaRetiro = document.getElementById('fecha-retiro').value;
        
        const datosRetiro = {
            id_transaccion: idRetiro,
            fecha: fechaRetiro,
            usuario: document.getElementById('nombre-usuario-retiro').value,
            documento: document.getElementById('documento-usuario-retiro').value,
            correo: document.getElementById('correo-usuario-retiro').value,
            monto: document.getElementById('monto-retiro').value
        };
        
        // Validar datos
        if (!this.validarDatosTransaccion(datosRetiro)) {
            return;
        }
        
        // Verificar que el usuario tenga saldo suficiente
        const saldoActual = this.obtenerSaldoUsuario();
        if (parseFloat(datosRetiro.monto) > saldoActual) {
            alert('Saldo insuficiente para realizar el retiro.');
            return;
        }
        
        console.log('Enviando datos de retiro:', datosRetiro);
        
        // Realizar petición al servidor
        fetch('http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/bd_RecargasRetiros/procesar_retiro.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: this.objetoAFormData(datosRetiro),
            credentials: 'include' // Importante: envía cookies con la solicitud
        })
        .then(response => {
            console.log('Respuesta del servidor:', response);
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data);
            this.manejarRespuestaServidor(data, 'retiro');
        })
        .catch(error => {
            console.error('Error al procesar retiro:', error);
            alert('Error al procesar el retiro. Por favor, intente nuevamente.');
        });
    }
    
    /**
     * Maneja la respuesta del servidor para recargas y retiros
     * @param {Object} data - Datos de respuesta del servidor
     * @param {string} tipo - Tipo de operación ('recarga' o 'retiro')
     */
    manejarRespuestaServidor(data, tipo) {
        if (data.status === 'success') {
            // Mostrar mensaje de éxito
            alert(`${tipo === 'recarga' ? 'Recarga' : 'Retiro'} procesado correctamente.`);
            
            // Actualizar saldo en la interfaz
            this.actualizarSaldoInterfaz(parseFloat(data.monto), tipo === 'recarga');
            
            // Cerrar modal
            this.cerrarModales();
            
            // Limpiar formulario
            if (tipo === 'recarga') {
                this.formRecargar.reset();
            } else {
                this.formRetiro.reset();
            }
        } else {
            // Mostrar mensaje de error
            alert(`Error: ${data.message}`);
        }
    }
    
    /**
     * Actualiza el saldo mostrado en la interfaz
     * @param {number} monto - Monto de la transacción
     * @param {boolean} esRecarga - Indica si es una recarga (true) o un retiro (false)
     */
    actualizarSaldoInterfaz(monto, esRecarga) {
        const elementoSaldo = document.getElementById('user-balance');
        if (!elementoSaldo) return;
        
        // Obtener saldo actual
        let saldoActual = this.obtenerSaldoUsuario();
        
        // Calcular nuevo saldo
        const nuevoSaldo = esRecarga ? saldoActual + monto : saldoActual - monto;
        
        // Actualizar en la interfaz
        elementoSaldo.textContent = `$ ${nuevoSaldo.toFixed(2)}`;
        
        // Guardar nuevo saldo en localStorage para persistencia durante la sesión
        if (window.sessionStorage) {
            const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
            usuario.saldo = nuevoSaldo;
            sessionStorage.setItem('usuario', JSON.stringify(usuario));
        }
    }
    
    /**
     * Obtiene el saldo actual del usuario
     * @returns {number} Saldo actual
     */
    obtenerSaldoUsuario() {
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
    
    /**
     * Valida los datos del formulario de transacción
     * @param {Object} datos - Datos a validar
     * @returns {boolean} True si los datos son válidos
     */
    validarDatosTransaccion(datos) {
        // Verificar que todos los campos estén llenos
        if (!datos.usuario || !datos.documento || !datos.correo || !datos.monto) {
            alert('Todos los campos son obligatorios.');
            return false;
        }
        
        // Validar que el monto sea un número positivo
        if (isNaN(datos.monto) || parseFloat(datos.monto) <= 0) {
            alert('El monto debe ser un valor numérico positivo.');
            return false;
        }
        
        // Validar correo electrónico con expresión regular
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(datos.correo)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return false;
        }
        
        // Validar documento (solo números)
        const regexDocumento = /^[0-9]+$/;
        if (!regexDocumento.test(datos.documento)) {
            alert('El documento debe contener solo números.');
            return false;
        }
        
        return true;
    }
    
    /**
     * Precarga los datos del usuario en el formulario si están disponibles
     * @param {string} formId - ID del formulario a precargar
     */
    precargarDatosUsuario(formId) {
        // Verificar si hay datos de usuario en sessionStorage
        if (window.sessionStorage) {
            const usuarioGuardado = sessionStorage.getItem('usuario');
            if (usuarioGuardado) {
                const usuario = JSON.parse(usuarioGuardado);
                
                // Dependiendo del formulario, actualizar los campos correspondientes
                if (formId === 'recargar-form') {
                    if (usuario.nombre) document.getElementById('nombre-usuario').value = usuario.nombre;
                    if (usuario.documento) document.getElementById('documento-usuario').value = usuario.documento;
                    if (usuario.correo) document.getElementById('correo-usuario').value = usuario.correo;
                } else if (formId === 'retiro-form') {
                    if (usuario.nombre) document.getElementById('nombre-usuario-retiro').value = usuario.nombre;
                    if (usuario.documento) document.getElementById('documento-usuario-retiro').value = usuario.documento;
                    if (usuario.correo) document.getElementById('correo-usuario-retiro').value = usuario.correo;
                }
            } else {
                // Si no hay datos en session storage, intentamos obtener del DOM
                const nombreUsuario = document.getElementById('current-user').textContent;
                if (nombreUsuario && nombreUsuario !== 'Invitado') {
                    // Aquí podrías hacer una petición AJAX para obtener los datos del usuario
                    console.log('Usuario actual:', nombreUsuario);
                    
                    // Por ahora, llenar con datos del DOM
                    if (formId === 'recargar-form') {
                        document.getElementById('nombre-usuario').value = nombreUsuario;
                    } else if (formId === 'retiro-form') {
                        document.getElementById('nombre-usuario-retiro').value = nombreUsuario;
                    }
                }
            }
        }
    }
    
    /**
     * Convierte un objeto a FormData para envío en formularios
     * @param {Object} objeto - Objeto a convertir
     * @returns {string} Cadena formateada para envío en formulario
     */
    objetoAFormData(objeto) {
        return Object.keys(objeto)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(objeto[key])}`)
            .join('&');
    }
    
    /**
     * Genera un ID único para transacciones
     * @param {string} prefijo - Prefijo para el ID ('RC' para recarga, 'RT' para retiro)
     * @returns {string} ID único generado
     */
    generarIdTransaccion(prefijo) {
        const fecha = new Date();
        const timestamp = fecha.getTime();
        const aleatorio = Math.floor(Math.random() * 1000);
        return `${prefijo}-${timestamp}-${aleatorio}`;
    }
    
    /**
     * Obtiene la fecha actual formateada
     * @returns {string} Fecha formateada (YYYY-MM-DD)
     */
    obtenerFechaActual() {
        const fecha = new Date();
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

// Inicializar el servicio cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const recargaRetiroService = new RecargaRetiroService();
    
    // Exponer el servicio globalmente para acceso desde otros scripts
    window.recargaRetiroService = recargaRetiroService;
});