/**
 * Retiros - Módulo de gestión de retiros para SportsBets360FMK
 * Maneja todas las operaciones relacionadas con retiros de fondos
 */

const RetirosModule = {
    /**
     * Inicializa el módulo de retiros
     */
    init: function() {
        this.setupFormListeners();
        this.setupValidations();
        this.loadRetirosPendientes();
        this.loadRetirosHistorial();
        
        // Establecer fecha actual y próximo ID
        this.setInitialValues();
    },
    
    /**
     * Configura los valores iniciales para el formulario de retiros
     */
    setInitialValues: function() {
        const fechaActual = new Date();
        const fechaFormateada = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;
        
        const fechaRetiroEl = document.getElementById('fecha-retiro');
        if (fechaRetiroEl) {
            fechaRetiroEl.value = fechaFormateada;
        }
        
        const idRetiroEl = document.getElementById('id-retiro');
        if (idRetiroEl) {
            idRetiroEl.value = StorageDB.getNextRetiroId();
        }
        
        // Pre-cargar información del usuario actual (simulado)
        this.cargarDatosUsuarioActual();
    },
    
    /**
     * Configura los listeners para el formulario de retiros
     */
    setupFormListeners: function() {
        // Form submission
        const retiroFormEl = document.getElementById('retiro-form');
        if (retiroFormEl) {
            retiroFormEl.addEventListener('submit', this.procesarRetiro.bind(this));
        }
        
        // Botones adicionales
        const cancelarRetiroBtn = document.getElementById('cancelar-retiro');
        if (cancelarRetiroBtn) {
            cancelarRetiroBtn.addEventListener('click', this.cancelarRetiro);
        }
        
        // Listeners para cambios en los campos del formulario
        const montoRetiroEl = document.getElementById('monto-retiro');
        if (montoRetiroEl) {
            montoRetiroEl.addEventListener('input', this.calcularComision.bind(this));
        }
        
        const medioRetiroEl = document.getElementById('medio-retiro');
        if (medioRetiroEl) {
            medioRetiroEl.addEventListener('change', this.actualizarCamposBancarios.bind(this));
        }
    },
    
    /**
     * Configura las validaciones de los campos del formulario
     */
    setupValidations: function() {
        const montoRetiroEl = document.getElementById('monto-retiro');
        if (montoRetiroEl) {
            montoRetiroEl.addEventListener('blur', function() {
                const monto = parseFloat(this.value);
                if (isNaN(monto) || monto <= 0) {
                    this.classList.add('invalid');
                    document.getElementById('monto-error').textContent = 'Ingrese un monto válido mayor a cero';
                } else if (monto < 10000) {
                    this.classList.add('invalid');
                    document.getElementById('monto-error').textContent = 'El monto mínimo de retiro es $10.000';
                } else {
                    this.classList.remove('invalid');
                    document.getElementById('monto-error').textContent = '';
                }
            });
        }
        
        const numeroCuentaEl = document.getElementById('numero-cuenta');
        if (numeroCuentaEl) {
            numeroCuentaEl.addEventListener('blur', function() {
                if (!this.value || this.value.length < 8) {
                    this.classList.add('invalid');
                    document.getElementById('cuenta-error').textContent = 'Ingrese un número de cuenta válido';
                } else {
                    this.classList.remove('invalid');
                    document.getElementById('cuenta-error').textContent = '';
                }
            });
        }
    },
    
    /**
     * Carga los datos del usuario actualmente logueado en el formulario
     */
    cargarDatosUsuarioActual: function() {
        // En una aplicación real, esto vendría de una sesión
        // Por ahora, usaremos el primer usuario de la base de datos
        const usuarios = StorageDB.getUsuarios();
        if (usuarios.length > 0) {
            const usuario = usuarios[0];
            
            const nombreRetiroEl = document.getElementById('nombre-retiro');
            const apellidoRetiroEl = document.getElementById('apellido-retiro');
            const documentoRetiroEl = document.getElementById('documento-retiro');
            const correoRetiroEl = document.getElementById('correo-retiro');
            const saldoActualEl = document.getElementById('saldo-actual');
            
            if (nombreRetiroEl) nombreRetiroEl.value = usuario.nombre || '';
            if (apellidoRetiroEl) apellidoRetiroEl.value = usuario.apellido || '';
            if (documentoRetiroEl) documentoRetiroEl.value = usuario.documento || '';
            if (correoRetiroEl) correoRetiroEl.value = usuario.correo || '';
            if (saldoActualEl) saldoActualEl.textContent = `$${usuario.saldo || 0}`;
        }
    },
    
    /**
     * Calcula la comisión según el monto y medio de pago
     */
    calcularComision: function() {
        const montoRetiroEl = document.getElementById('monto-retiro');
        const comisionEl = document.getElementById('comision');
        const totalRecibirEl = document.getElementById('total-recibir');
        const medioRetiroEl = document.getElementById('medio-retiro');
        
        if (!montoRetiroEl || !comisionEl || !totalRecibirEl || !medioRetiroEl) return;
        
        const monto = parseFloat(montoRetiroEl.value) || 0;
        const medio = medioRetiroEl.value;
        
        // Diferentes comisiones según el medio de pago
        let porcentajeComision = 0;
        switch (medio) {
            case 'bancolombia':
                porcentajeComision = 0.01; // 1%
                break;
            case 'daviplata':
                porcentajeComision = 0.015; // 1.5%
                break;
            case 'nequi':
                porcentajeComision = 0.02; // 2%
                break;
            case 'efecty':
                porcentajeComision = 0.03; // 3%
                break;
            default:
                porcentajeComision = 0.02; // 2% por defecto
        }
        
        const comision = monto * porcentajeComision;
        const totalRecibir = monto - comision;
        
        comisionEl.textContent = `$${comision.toFixed(0)}`;
        totalRecibirEl.textContent = `$${totalRecibir.toFixed(0)}`;
    },
    
    /**
     * Actualiza los campos bancarios según el medio de pago seleccionado
     */
    actualizarCamposBancarios: function() {
        const medioRetiroEl = document.getElementById('medio-retiro');
        const numeroCuentaGroup = document.getElementById('numero-cuenta-group');
        const tipoCuentaGroup = document.getElementById('tipo-cuenta-group');
        const documentoRetiroGroup = document.getElementById('documento-retiro-group');
        
        if (!medioRetiroEl || !numeroCuentaGroup || !tipoCuentaGroup) return;
        
        const medio = medioRetiroEl.value;
        
        // Mostrar/ocultar campos según el medio de pago
        switch (medio) {
            case 'bancolombia':
            case 'daviplata':
            case 'nequi':
                numeroCuentaGroup.style.display = 'block';
                tipoCuentaGroup.style.display = medio === 'bancolombia' ? 'block' : 'none';
                numeroCuentaGroup.querySelector('label').textContent = 
                    medio === 'bancolombia' ? 'Número de Cuenta' : 'Número de Celular';
                break;
            case 'efecty':
                numeroCuentaGroup.style.display = 'none';
                tipoCuentaGroup.style.display = 'none';
                break;
            default:
                numeroCuentaGroup.style.display = 'block';
                tipoCuentaGroup.style.display = 'none';
        }
        
        // Actualizar cálculos con la nueva comisión
        this.calcularComision();
    },
    
    /**
     * Procesa el formulario de retiro
     * @param {Event} e - Evento de submit del formulario
     */
    procesarRetiro: function(e) {
        e.preventDefault();
        
        // Obtener valores del formulario
        const idRetiroEl = document.getElementById('id-retiro');
        const nombreRetiroEl = document.getElementById('nombre-retiro');
        const apellidoRetiroEl = document.getElementById('apellido-retiro');
        const documentoRetiroEl = document.getElementById('documento-retiro');
        const correoRetiroEl = document.getElementById('correo-retiro');
        const montoRetiroEl = document.getElementById('monto-retiro');
        const medioRetiroEl = document.getElementById('medio-retiro');
        const numeroCuentaEl = document.getElementById('numero-cuenta');
        const tipoCuentaEl = document.getElementById('tipo-cuenta');
        const fechaRetiroEl = document.getElementById('fecha-retiro');
        
        // Validar que los elementos existen
        if (!idRetiroEl || !nombreRetiroEl || !apellidoRetiroEl || !documentoRetiroEl || 
            !correoRetiroEl || !montoRetiroEl || !medioRetiroEl || !fechaRetiroEl) {
            alert('Error: Algunos elementos del formulario no se encontraron.');
            return;
        }
        
        // Obtener valores
        const idRetiro = idRetiroEl.value;
        const nombre = nombreRetiroEl.value;
        const apellido = apellidoRetiroEl.value;
        const documento = documentoRetiroEl.value;
        const correo = correoRetiroEl.value;
        const montoRetiro = parseFloat(montoRetiroEl.value);
        const medioRetiro = medioRetiroEl.value;
        const numeroCuenta = numeroCuentaEl ? numeroCuentaEl.value : '';
        const tipoCuenta = tipoCuentaEl ? tipoCuentaEl.value : '';
        const fechaRetiro = fechaRetiroEl.value;
        
        // Validaciones básicas
        if (!nombre || !apellido || !documento || !correo || !montoRetiro) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }
        
        if (montoRetiro <= 0) {
            alert('El monto de retiro debe ser mayor a cero.');
            return;
        }
        
        // Validar saldo disponible
        const usuario = StorageDB.getUsuarioPorCorreo(correo);
        if (!usuario) {
            alert('No se encontró el usuario asociado al correo.');
            return;
        }
        
        const saldoDisponible = parseFloat(usuario.saldo) || 0;
        if (saldoDisponible < montoRetiro) {
            alert(`Saldo insuficiente. Su saldo actual es: $${saldoDisponible}`);
            return;
        }
        
        // Calcular comisión
        let porcentajeComision = 0.02; // 2% por defecto
        switch (medioRetiro) {
            case 'bancolombia': porcentajeComision = 0.01; break;
            case 'daviplata': porcentajeComision = 0.015; break;
            case 'nequi': porcentajeComision = 0.02; break;
            case 'efecty': porcentajeComision = 0.03; break;
        }
        
        const comision = montoRetiro * porcentajeComision;
        const totalRecibir = montoRetiro - comision;
        
        // Crear objeto de retiro
        const retiro = {
            id: idRetiro,
            nombre: nombre,
            apellido: apellido,
            documento: documento,
            correo: correo,
            monto: montoRetiro,
            medio: medioRetiro,
            comision: comision,
            totalRecibir: totalRecibir,
            numeroCuenta: numeroCuenta,
            tipoCuenta: tipoCuenta,
            fecha: fechaRetiro,
            estado: 'Pendiente',
            timestamp: new Date().getTime()
        };
        
        try {
            // En una aplicación real, aquí enviaríamos la solicitud al servidor
            // En este caso, lo procesamos localmente
            
            // Actualizar saldo del usuario (restar el monto)
            StorageDB.actualizarSaldo(correo, -montoRetiro);
            
            // Guardar registro de retiro
            StorageDB.saveRetiro(retiro);
            
            // Actualizar saldo en la interfaz
            const userBalanceEl = document.getElementById('user-balance');
            if (userBalanceEl) {
                userBalanceEl.textContent = `$ ${saldoDisponible - montoRetiro}`;
            }
            
            // También actualizar en la vista de retiros
            const saldoActualEl = document.getElementById('saldo-actual');
            if (saldoActualEl) {
                saldoActualEl.textContent = `$${saldoDisponible - montoRetiro}`;
            }
            
            alert(`Solicitud de retiro procesada correctamente.\nSe le notificará cuando el retiro sea aprobado.\nSu nuevo saldo es: $${saldoDisponible - montoRetiro}`);
            
            // Resetear formulario y actualizar valores
            montoRetiroEl.value = '';
            if (numeroCuentaEl) numeroCuentaEl.value = '';
            
            // Generar nuevo ID para próximo retiro
            idRetiroEl.value = StorageDB.getNextRetiroId();
            
            // Actualizar lista de retiros pendientes
            this.loadRetirosPendientes();
            this.loadRetirosHistorial();
            
        } catch (error) {
            console.error('Error al procesar el retiro:', error);
            alert('Ocurrió un error al procesar su retiro. Por favor, inténtelo de nuevo más tarde.');
        }
    },
    
    /**
     * Cancela el formulario de retiro actual
     */
    cancelarRetiro: function() {
        const retiroForm = document.getElementById('retiro-form');
        if (retiroForm) {
            retiroForm.reset();
        }
        
        // Recargar datos del usuario
        RetirosModule.cargarDatosUsuarioActual();
        RetirosModule.setInitialValues();
        
        // Limpiar mensajes de error
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            msg.textContent = '';
        });
        
        // Eliminar clases de invalidación
        const inputFields = retiroForm.querySelectorAll('input');
        inputFields.forEach(field => {
            field.classList.remove('invalid');
        });
    },
    
    /**
     * Carga la lista de retiros pendientes del usuario actual
     */
    loadRetirosPendientes: function() {
        const retirosPendientesEl = document.getElementById('retiros-pendientes');
        if (!retirosPendientesEl) return;
        
        // En una aplicación real, filtrarías por el usuario actual
        const usuarios = StorageDB.getUsuarios();
        if (usuarios.length === 0) return;
        
        const correoUsuario = usuarios[0].correo;
        
        const retiros = StorageDB.getRetiros().filter(retiro => 
            retiro.correo === correoUsuario && retiro.estado === 'Pendiente'
        );
        
        if (retiros.length === 0) {
            retirosPendientesEl.innerHTML = `
                <div class="empty-state">
                    <p>No tiene retiros pendientes.</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <table class="retiros-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Medio</th>
                        <th>Monto</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        retiros.forEach(retiro => {
            html += `
                <tr>
                    <td>${retiro.id}</td>
                    <td>${retiro.fecha}</td>
                    <td>${this.formatMedioPago(retiro.medio)}</td>
                    <td>$${retiro.monto.toFixed(0)}</td>
                    <td>
                        <span class="estado-badge ${retiro.estado.toLowerCase()}">
                            ${retiro.estado}
                        </span>
                    </td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        retirosPendientesEl.innerHTML = html;
    },
    
    /**
     * Carga el historial de retiros del usuario actual
     */
    loadRetirosHistorial: function() {
        const retirosHistorialEl = document.getElementById('retiros-historial');
        if (!retirosHistorialEl) return;
        
        // En una aplicación real, filtrarías por el usuario actual
        const usuarios = StorageDB.getUsuarios();
        if (usuarios.length === 0) return;
        
        const correoUsuario = usuarios[0].correo;
        
        // Obtener todos los retiros del usuario, ordenados por fecha (más recientes primero)
        const retiros = StorageDB.getRetiros()
            .filter(retiro => retiro.correo === correoUsuario)
            .sort((a, b) => b.timestamp - a.timestamp);
        
        if (retiros.length === 0) {
            retirosHistorialEl.innerHTML = `
                <div class="empty-state">
                    <p>No tiene historial de retiros.</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <table class="retiros-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Medio</th>
                        <th>Monto</th>
                        <th>Comisión</th>
                        <th>Total</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        retiros.forEach(retiro => {
            html += `
                <tr>
                    <td>${retiro.id}</td>
                    <td>${retiro.fecha}</td>
                    <td>${this.formatMedioPago(retiro.medio)}</td>
                    <td>$${retiro.monto.toFixed(0)}</td>
                    <td>$${(retiro.comision || 0).toFixed(0)}</td>
                    <td>$${(retiro.totalRecibir || retiro.monto).toFixed(0)}</td>
                    <td>
                        <span class="estado-badge ${retiro.estado.toLowerCase()}">
                            ${retiro.estado}
                        </span>
                    </td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        retirosHistorialEl.innerHTML = html;
    },
    
    /**
     * Formatea el nombre del medio de pago para visualización
     * @param {string} medio - Código del medio de pago
     * @return {string} Nombre formateado del medio
     */
    formatMedioPago: function(medio) {
        const medios = {
            'bancolombia': 'Bancolombia',
            'daviplata': 'Daviplata',
            'nequi': 'Nequi',
            'efecty': 'Efecty'
        };
        
        return medios[medio] || medio;
    }
};

// Inicializar módulo cuando la página esté cargada
document.addEventListener('DOMContentLoaded', function() {
    RetirosModule.init();
});