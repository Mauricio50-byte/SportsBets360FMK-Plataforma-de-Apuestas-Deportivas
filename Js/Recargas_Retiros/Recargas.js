/**
 * SportsBets360FMK - Archivo principal de JavaScript
 * Gestiona la lógica de la interfaz de usuario y eventos
 */

// Inicializar la base de datos al cargar
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar almacenamiento
    StorageDB.init();
    
    // Inicializar datos de usuario de ejemplo si no existen
    if (StorageDB.getUsuarios().length === 0) {
        StorageDB.saveUsuario({
            nombre: "",
            apellido: "",
            usuario: "",
            correo: "",
            documento: "",
            saldo:"",
        });
    }
    
    // Establecer fecha actual en el formulario de recarga
    const fechaActual = new Date();
    const fechaFormateada = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;
    
    const fechaRecargaEl = document.getElementById('fecha-recarga');
    if (fechaRecargaEl) {
        fechaRecargaEl.value = fechaFormateada;
    }
    
    // Asignar ID de recarga
    const idRecargaEl = document.getElementById('id-recarga');
    if (idRecargaEl) {
        idRecargaEl.value = StorageDB.getNextRecargaId();
    }
    
    // Mostrar usuario actualmente logueado (simulado)
    mostrarUsuarioLogueado();
    
    // Inicializar los eventos
    inicializarEventos();
    
    // Mostrar la página de inicio por defecto
    mostrarInicio();
});

// Función para mostrar usuario logueado (simulado)
function mostrarUsuarioLogueado() {
    // En una aplicación real, esto vendría de una sesión
    // Por ahora, usaremos el primer usuario de la base de datos
    const usuarios = StorageDB.getUsuarios();
    if (usuarios.length > 0) {
        const usuario = usuarios[0];
        const currentUserEl = document.getElementById('current-user');
        const userBalanceEl = document.getElementById('user-balance');
        
        if (currentUserEl) currentUserEl.textContent = usuario.usuario;
        if (userBalanceEl) userBalanceEl.textContent = `$ ${usuario.saldo}`;
    }
}

// Funciones de navegación principal
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const content = document.querySelector('.content');
    
    if (sidebar && overlay && content) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        content.classList.toggle('sidebar-open');
    }
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const content = document.querySelector('.content');
    
    if (sidebar && overlay && content) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        content.classList.remove('sidebar-open');
    }
}

// Funciones para mostrar diferentes secciones
function mostrarSeccion(idSeccion) {
    // Desactivar todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Activar el enlace correspondiente
    const activeLink = document.getElementById(`${idSeccion}-link`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function mostrarInicio() {
    mostrarSeccion('inicio');
    const contenidoPrincipal = document.getElementById('contenido-principal');
    if (contenidoPrincipal) {
        contenidoPrincipal.innerHTML = `
            <div class="bienvenida-container">
                <h2>Bienvenido a SportsBets360FMK</h2>
                <p>La mejor plataforma de apuestas deportivas</p>
                <p>Selecciona un deporte para comenzar a apostar</p>
            </div>
        `;
    }
}

function mostrarResultados() {
    mostrarSeccion('resultados');
    const contenidoPrincipal = document.getElementById('contenido-principal');
    if (contenidoPrincipal) {
        contenidoPrincipal.innerHTML = `
            <h2>Resultados Deportivos</h2>
            <p>Aquí podrás ver los resultados de los eventos deportivos más recientes.</p>
            <div class="resultados-placeholder">
                <p>Cargando resultados...</p>
            </div>
        `;
    }
    // Aquí se cargarían los resultados desde una API
}

function mostrarRecargas() {
    mostrarSeccion('recargas');
    // Mostrar el modal de recargas
    const modal = document.getElementById('recargas-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Establecer fecha actual en el formulario
        const fechaActual = new Date();
        const fechaFormateada = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;
        
        const fechaRecargaEl = document.getElementById('fecha-recarga');
        if (fechaRecargaEl) {
            fechaRecargaEl.value = fechaFormateada;
        }
        
        // Asignar ID de recarga
        const idRecargaEl = document.getElementById('id-recarga');
        if (idRecargaEl) {
            idRecargaEl.value = StorageDB.getNextRecargaId();
        }
        
        // Limpiar campos del formulario
        const nombreUsuarioEl = document.getElementById('nombre-usuario');
        const documentoUsuarioEl = document.getElementById('documento-usuario');
        const correoUsuarioEl = document.getElementById('correo-usuario');
        const montoRecargaEl = document.getElementById('monto-recarga');
        
        if (nombreUsuarioEl) nombreUsuarioEl.value = '';
        if (documentoUsuarioEl) documentoUsuarioEl.value = '';
        if (correoUsuarioEl) correoUsuarioEl.value = '';
        if (montoRecargaEl) montoRecargaEl.value = '';
        
        // Ocultar previsualización de imagen si existe
        const previewContainer = document.getElementById('preview-container');
        if (previewContainer) {
            previewContainer.classList.add('preview-hidden');
        }
    }
}

function mostrarRetiros() {
    mostrarSeccion('retiros');
    // Mostrar el modal de retiros
    const modal = document.getElementById('retiros-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Limpiar campos del formulario
        const nombreRetiroEl = document.getElementById('nombre-retiro');
        const apellidoRetiroEl = document.getElementById('apellido-retiro');
        const montoRetiroEl = document.getElementById('monto-retiro');
        const numeroCuentaEl = document.getElementById('numero-cuenta');
        
        if (nombreRetiroEl) nombreRetiroEl.value = '';
        if (apellidoRetiroEl) apellidoRetiroEl.value = '';
        if (montoRetiroEl) montoRetiroEl.value = '';
        if (numeroCuentaEl) numeroCuentaEl.value = '';
    }
}

function mostrarReportes() {
    mostrarSeccion('reportes');
    // Mostrar el modal de reportes
    const modal = document.getElementById('reportes-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Limpiar contenedores de filtro y resultados
        const filtroContainer = document.getElementById('filtro-reporte');
        const resultadoContainer = document.getElementById('resultado-reporte');
        
        if (filtroContainer) filtroContainer.innerHTML = '';
        if (resultadoContainer) resultadoContainer.innerHTML = '';
    }
}

function mostrarDeporte(deporte) {
    const contenidoPrincipal = document.getElementById('contenido-principal');
    if (contenidoPrincipal) {
        contenidoPrincipal.innerHTML = `
            <h2>${deporte}</h2>
            <p>Próximos partidos para apostar:</p>
            <div class="eventos-deportivos">
                <p>Cargando eventos de ${deporte}...</p>
            </div>
        `;
    }
    // Aquí se cargarían los eventos desde una API
}

// Funciones para el manejo de modales
function cerrarModal() {
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Funciones para el manejo de imágenes
function mostrarVistaPrevia(e) {
    const archivo = e.target.files[0];
    if (archivo) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imagePreview = document.getElementById('image-preview');
            const previewContainer = document.getElementById('preview-container');
            
            if (imagePreview && previewContainer) {
                imagePreview.src = e.target.result;
                previewContainer.classList.remove('preview-hidden');
            }
        }
        reader.readAsDataURL(archivo);
    }
}

function eliminarImagen() {
    const comprobante = document.getElementById('comprobante');
    const previewContainer = document.getElementById('preview-container');
    
    if (comprobante) comprobante.value = '';
    if (previewContainer) previewContainer.classList.add('preview-hidden');
}

// Funciones para la búsqueda de usuarios
function buscarUsuarioPorCorreo() {
    const correoEl = document.getElementById('correo-usuario');
    if (!correoEl) return;
    
    const correo = correoEl.value;
    if (correo) {
        const usuario = StorageDB.getUsuarioPorCorreo(correo);
        if (usuario) {
            // Autocompletar campos
            const nombreUsuarioEl = document.getElementById('nombre-usuario');
            const documentoUsuarioEl = document.getElementById('documento-usuario');
            
            if (nombreUsuarioEl) nombreUsuarioEl.value = usuario.usuario;
            if (documentoUsuarioEl) documentoUsuarioEl.value = usuario.documento;
        }
    }
}

function buscarUsuarioPorDocumento() {
    const documentoEl = document.getElementById('documento-usuario');
    if (!documentoEl) return;
    
    const documento = documentoEl.value;
    if (documento) {
        const usuario = StorageDB.getUsuarioPorDocumento(documento);
        if (usuario) {
            // Autocompletar campos
            const nombreUsuarioEl = document.getElementById('nombre-usuario');
            const correoUsuarioEl = document.getElementById('correo-usuario');
            
            if (nombreUsuarioEl) nombreUsuarioEl.value = usuario.usuario;
            if (correoUsuarioEl) correoUsuarioEl.value = usuario.correo;
        }
    }
}

// Función para cerrar sesión (simulada)
function cerrarSesion() {
    // En una aplicación real, esto enviaría una petición al servidor
    // Por ahora, solo recargaremos la página
    alert('Sesión cerrada correctamente');
    location.reload();
}

// Función principal para procesar recargas
function procesarRecarga(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const idRecargaEl = document.getElementById('id-recarga');
    const nombreUsuarioEl = document.getElementById('nombre-usuario');
    const documentoUsuarioEl = document.getElementById('documento-usuario');
    const correoUsuarioEl = document.getElementById('correo-usuario');
    const montoRecargaEl = document.getElementById('monto-recarga');
    const medioPagoEl = document.getElementById('medio-pago');
    const fechaRecargaEl = document.getElementById('fecha-recarga');
    const comprobanteEl = document.getElementById('comprobante');
    
    // Validar que los elementos existen
    if (!idRecargaEl || !nombreUsuarioEl || !documentoUsuarioEl || 
        !correoUsuarioEl || !montoRecargaEl || !medioPagoEl || 
        !fechaRecargaEl) {
        alert('Error: Algunos elementos del formulario no se encontraron.');
        return;
    }
    
    // Obtener valores
    const idRecarga = idRecargaEl.value;
    const nombre = nombreUsuarioEl.value;
    const documento = documentoUsuarioEl.value;
    const correo = correoUsuarioEl.value;
    const montoRecarga = parseFloat(montoRecargaEl.value);
    const medioPago = medioPagoEl.value;
    const fechaRecarga = fechaRecargaEl.value;
    
    // Validar que comprobante existe si es requerido
    let comprobante = comprobanteEl ? comprobanteEl.files[0] : null;
    
    // Validaciones
    if (!nombre || !documento || !correo || !montoRecarga) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }
    
    if (montoRecarga <= 0) {
        alert('El monto de recarga debe ser mayor a cero.');
        return;
    }
    
    // Comprobar si hay un elemento para subir comprobante
    if (comprobanteEl && !comprobante) {
        alert('Por favor, suba un comprobante de pago.');
        return;
    }
    
    // Obtener usuario
    let usuario = StorageDB.getUsuarioPorCorreo(correo);
    
    // Si el usuario no existe, crear uno nuevo
    if (!usuario) {
        usuario = {
            usuario: nombre,
            correo: correo,
            documento: documento,
            saldo: 0
        };
    }
    
    // Crear objeto de recarga
    const recarga = {
        id: idRecarga,
        documento: documento,
        correo: correo,
        usuario: nombre,
        monto: montoRecarga,
        medioPago: medioPago,
        fecha: fechaRecarga,
        comprobanteName: comprobante ? comprobante.name : null,
        estado: 'Aprobado', // En una aplicación real, esto podría ser "Pendiente" hasta la verificación
        timestamp: new Date().getTime()
    };
    
    try {
        // En una aplicación real, aquí enviaríamos los datos al servidor
        // En lugar de eso, simulamos el procesamiento local
        
        // Actualizar saldo del usuario utilizando el método del StorageDB
        const usuarioActualizado = StorageDB.actualizarSaldo(correo, montoRecarga);
        
        // Guardar registro de recarga
        StorageDB.saveRecarga(recarga);
        
        // Actualizar saldo en la interfaz
        const userBalanceEl = document.getElementById('user-balance');
        if (userBalanceEl && usuarioActualizado) {
            userBalanceEl.textContent = `$ ${usuarioActualizado.saldo}`;
        }
        
        // Mostrar mensaje de éxito
        alert(`Recarga procesada correctamente.\nSu nuevo saldo es: $${usuarioActualizado ? usuarioActualizado.saldo : 'Actualizado'}`);
        
        // Cerrar modal y resetear formulario
        const recargarForm = document.getElementById('recargar-form');
        if (recargarForm) {
            recargarForm.reset();
        }
        
        const previewContainer = document.getElementById('preview-container');
        if (previewContainer) {
            previewContainer.classList.add('preview-hidden');
        }
        
        cerrarModal();
        
        // Establecer nuevos valores para la próxima recarga
        const fechaActual = new Date();
        const fechaFormateada = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;
        
        if (fechaRecargaEl) {
            fechaRecargaEl.value = fechaFormateada;
        }
        
        if (idRecargaEl) {
            idRecargaEl.value = StorageDB.getNextRecargaId();
        }
        
    } catch (error) {
        console.error('Error al procesar la recarga:', error);
        alert('Ocurrió un error al procesar su recarga. Por favor, inténtelo de nuevo más tarde.');
    }
}

// Función para manejar el retiro de saldo
function procesarRetiro(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const nombreRetiroEl = document.getElementById('nombre-retiro');
    const apellidoRetiroEl = document.getElementById('apellido-retiro');
    const montoRetiroEl = document.getElementById('monto-retiro');
    const medioRetiroEl = document.getElementById('medio-retiro');
    const numeroCuentaEl = document.getElementById('numero-cuenta');
    
    // Validar que los elementos existen
    if (!nombreRetiroEl || !apellidoRetiroEl || !montoRetiroEl || 
        !medioRetiroEl || !numeroCuentaEl) {
        alert('Error: Algunos elementos del formulario no se encontraron.');
        return;
    }
    
    // Obtener valores
    const nombre = nombreRetiroEl.value;
    const apellido = apellidoRetiroEl.value;
    const montoRetiro = parseFloat(montoRetiroEl.value);
    const medioRetiro = medioRetiroEl.value;
    const numeroCuenta = numeroCuentaEl.value;
    
    // Validaciones
    if (!nombre || !apellido || !montoRetiro || !numeroCuenta) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }
    
    if (montoRetiro <= 0) {
        alert('El monto de retiro debe ser mayor a cero.');
        return;
    }
    
    // En una aplicación real, aquí verificaríamos el saldo disponible
    // Vamos a simular esto usando el primer usuario
    const usuarios = StorageDB.getUsuarios();
    if (usuarios.length > 0) {
        const usuario = usuarios[0];
        
        // Verificar si tiene saldo suficiente
        if (usuario.saldo < montoRetiro) {
            alert('Saldo insuficiente para realizar este retiro.');
            return;
        }
        
        // Crear objeto de retiro
        const retiro = {
            id: StorageDB.getNextRetiroId(),
            nombre: nombre,
            apellido: apellido,
            monto: montoRetiro,
            medio: medioRetiro,
            numeroCuenta: numeroCuenta,
            estado: 'Pendiente',
            fecha: new Date().toLocaleDateString(),
            timestamp: new Date().getTime()
        };
        
        try {
            // Actualizar el saldo del usuario (restar el monto)
            StorageDB.actualizarSaldo(usuario.correo, -montoRetiro);
            
            // Guardar registro de retiro
            StorageDB.saveRetiro(retiro);
            
            // Actualizar saldo en la interfaz
            const userBalanceEl = document.getElementById('user-balance');
            if (userBalanceEl) {
                userBalanceEl.textContent = `$ ${usuario.saldo - montoRetiro}`;
            }
            
            alert(`Solicitud de retiro procesada correctamente.\nSe le notificará cuando el retiro sea aprobado.`);
            
            // Resetear formulario y cerrar modal
            const form = nombreRetiroEl.closest('form');
            if (form) {
                form.reset();
            }
            
            cerrarModal();
            
        } catch (error) {
            console.error('Error al procesar el retiro:', error);
            alert('Ocurrió un error al procesar su retiro. Por favor, inténtelo de nuevo más tarde.');
        }
    } else {
        alert('No se encontró información de usuario para procesar el retiro.');
    }
}

// Inicializar todos los eventos de la aplicación
function inicializarEventos() {
    // Eventos para la barra lateral
    const logoEl = document.querySelector('.logo');
    const sidebarOverlayEl = document.querySelector('.sidebar-overlay');
    
    if (logoEl) logoEl.addEventListener('click', toggleSidebar);
    if (sidebarOverlayEl) sidebarOverlayEl.addEventListener('click', closeSidebar);
    
    // Eventos para navegación
    const inicioLinkEl = document.getElementById('inicio-link');
    const resultadosLinkEl = document.getElementById('resultados-link');
    const recargasLinkEl = document.getElementById('recargas-link');
    const retirosLinkEl = document.getElementById('retiros-link');
    const reportesLinkEl = document.getElementById('reportes-link');
    
    if (inicioLinkEl) inicioLinkEl.addEventListener('click', mostrarInicio);
    if (resultadosLinkEl) resultadosLinkEl.addEventListener('click', mostrarResultados);
    if (recargasLinkEl) recargasLinkEl.addEventListener('click', mostrarRecargas);
    if (retirosLinkEl) retirosLinkEl.addEventListener('click', mostrarRetiros);
    if (reportesLinkEl) reportesLinkEl.addEventListener('click', mostrarReportes);
    
    // Eventos para los modales
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', cerrarModal);
    });
    
    // Eventos para el formulario de recarga - carga de imágenes
    const uploadAreaEl = document.getElementById('upload-area');
    const comprobanteEl = document.getElementById('comprobante');
    const removeImageEl = document.getElementById('remove-image');
    
    if (uploadAreaEl && comprobanteEl) {
        uploadAreaEl.addEventListener('click', () => {
            comprobanteEl.click();
        });
    }
    
    if (comprobanteEl) {
        comprobanteEl.addEventListener('change', mostrarVistaPrevia);
    }
    
    if (removeImageEl) {
        removeImageEl.addEventListener('click', eliminarImagen);
    }
    
    // Eventos para el formulario de recargas - autocompletado
    const correoUsuarioEl = document.getElementById('correo-usuario');
    const documentoUsuarioEl = document.getElementById('documento-usuario');
    
    if (correoUsuarioEl) {
        correoUsuarioEl.addEventListener('blur', buscarUsuarioPorCorreo);
    }
    
    if (documentoUsuarioEl) {
        documentoUsuarioEl.addEventListener('blur', buscarUsuarioPorDocumento);
    }
    
    // Evento para enviar el formulario de recarga
    const recargarFormEl = document.getElementById('recargar-form');
    if (recargarFormEl) {
        recargarFormEl.addEventListener('submit', procesarRecarga);
    }
    
    // Evento para el botón de retiro
    const retiroBtn = document.querySelector('#retiros-modal .submit-btn');
    if (retiroBtn) {
        retiroBtn.addEventListener('click', procesarRetiro);
    }
    
    // Evento para botón de cierre de sesión
    const logoutBtnEl = document.getElementById('logout-btn');
    if (logoutBtnEl) {
        logoutBtnEl.addEventListener('click', cerrarSesion);
    }
    
    // Eventos para los botones de deportes
    const sportButtons = document.querySelectorAll('.sport-button');
    sportButtons.forEach(button => {
        button.addEventListener('click', () => {
            sportButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const deporteEl = button.querySelector('.sport-name');
            if (deporteEl) {
                mostrarDeporte(deporteEl.textContent);
            }
        });
    });
    
    // Inicializar los elementos del menú lateral
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');
            mostrarDeporte(item.textContent.trim());
            closeSidebar();
        });
    });
    
    // Eventos para los botones de reportes
    const reporteBtns = document.querySelectorAll('.reporte-btn');
    reporteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tipoReporte = this.getAttribute('data-tipo');
            mostrarFiltroReporte(tipoReporte);
        });
    });
}

// Función para mostrar filtros de reportes según el tipo seleccionado
function mostrarFiltroReporte(tipo) {
    const filtroContainer = document.getElementById('filtro-reporte');
    if (!filtroContainer) return;
    
    let html = '';
    
    switch(tipo) {
        case 'fecha':
            html = `
                <h3>Buscar por Fecha</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha Inicio</label>
                        <input type="date" id="fecha-inicio">
                    </div>
                    <div class="form-group">
                        <label>Fecha Fin</label>
                        <input type="date" id="fecha-fin">
                    </div>
                </div>
                <button class="submit-btn" onclick="buscarPorFecha()">Buscar</button>
            `;
            break;
        case 'deportes':
            html = `
                <h3>Buscar por Deporte</h3>
                <div class="form-group">
                    <select id="deporte-filtro">
                        <option value="futbol">Fútbol</option>
                        <option value="tenis">Tenis</option>
                        <option value="baloncesto">Baloncesto</option>
                        <option value="futbol-americano">Fútbol Americano</option>
                        <option value="beisbol">Béisbol</option>
                        <option value="voleibol">Voleibol</option>
                        <option value="boxeo">Boxeo</option>
                    </select>
                </div>
                <button class="submit-btn" onclick="buscarPorDeporte()">Buscar</button>
            `;
            break;
        case 'ganadas':
            html = `
                <h3>Apuestas Ganadas</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha Inicio</label>
                        <input type="date" id="ganadas-inicio">
                    </div>
                    <div class="form-group">
                        <label>Fecha Fin</label>
                        <input type="date" id="ganadas-fin">
                    </div>
                </div>
                <button class="submit-btn" onclick="buscarApuestasGanadas()">Buscar</button>
            `;
            break;
        case 'perdidas':
            html = `
                <h3>Apuestas Perdidas</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha Inicio</label>
                        <input type="date" id="perdidas-inicio">
                    </div>
                    <div class="form-group">
                        <label>Fecha Fin</label>
                        <input type="date" id="perdidas-fin">
                    </div>
                </div>
                <button class="submit-btn" onclick="buscarApuestasPerdidas()">Buscar</button>
            `;
            break;
    }
    
    filtroContainer.innerHTML = html;
}

// Funciones placeholder para búsquedas de reportes
function buscarPorFecha() {
    document.getElementById('resultado-reporte').innerHTML = `<p>Resultados de búsqueda por fecha (simulados)</p>`;
}

function buscarPorDeporte() {
    document.getElementById('resultado-reporte').innerHTML = `<p>Resultados de búsqueda por deporte (simulados)</p>`;
}

function buscarApuestasGanadas() {
    document.getElementById('resultado-reporte').innerHTML = `<p>Apuestas ganadas (simuladas)</p>`;
}

function buscarApuestasPerdidas() {
    document.getElementById('resultado-reporte').innerHTML = `<p>Apuestas perdidas (simuladas)</p>`;
}