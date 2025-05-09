document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los servicios
    AlmacenamientoService.inicializar();
    
    // Detectar la página actual
    const currentPath = window.location.pathname;
    
    // Si estamos en index.html, configurar los formularios de login/registro
    if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
        configurarFormulariosIndex();
    }
    
    // Si estamos en Menu.html, configurar la interfaz según el usuario logueado
    if (currentPath.includes('Menu.html')) {
        configurarInterfazMenu();
    }
});

// Configuración para index.html
function configurarFormulariosIndex() {
    // Formulario de registro
    const formularioRegistro = document.querySelector('#register form');
    if (formularioRegistro) {
        formularioRegistro.addEventListener('submit', FormularioService.manejarRegistro);
    }
    
    // Formulario de login
    const formularioLogin = document.querySelector('#login form');
    if (formularioLogin) {
        formularioLogin.addEventListener('submit', FormularioService.manejarLogin);
    }
}

// Configuración para Menu.html
function configurarInterfazMenu() {
    // Verificar si hay un usuario logueado
    const usuarioActual = UsuarioService.getUsuarioActual();
    
    if (!usuarioActual) {
        // Redirigir a index.html si no hay usuario logueado
        window.location.href = 'index.html';
        return;
    }
    
    // Actualizar la interfaz con los datos del usuario
    document.getElementById('current-user').textContent = usuarioActual.getNombreCompleto();
    
    // Obtener y mostrar el saldo
    const saldo = RecargaRetiroService.obtenerSaldoUsuario(usuarioActual.getCorreo());
    document.getElementById('user-balance').textContent = `$ ${saldo.toFixed(2)}`;
    
    // Configurar el botón de logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        UsuarioService.logout();
        window.location.href = 'index.html';
    });
    
    // Configurar los enlaces del menú
    configurarEnlacesMenu();
    
    // Configurar el formulario de recarga
    const formularioRecarga = document.getElementById('recargar-form');
    if (formularioRecarga) {
        // Prellenar datos del usuario actual
        document.getElementById('nombre-usuario').value = usuarioActual.getNombre();
        document.getElementById('documento-usuario').value = usuarioActual.getDocumento();
        document.getElementById('correo-usuario').value = usuarioActual.getCorreo();
        
        // Generar ID y fecha
        document.getElementById('id-recarga').value = RecargaRetiro.contadorRecarga + 1;
        document.getElementById('fecha-recarga').value = new Date().toLocaleDateString();
        
        // Manejar envío del formulario
        formularioRecarga.addEventListener('submit', FormularioService.manejarRecarga);
    }
    
    // Configurar el formulario de retiro
    const formularioRetiro = document.getElementById('retiro-form');
    if (formularioRetiro) {
        // Prellenar datos del usuario actual
        document.getElementById('nombre-usuario-retiro').value = usuarioActual.getNombre();
        document.getElementById('documento-usuario-retiro').value = usuarioActual.getDocumento();
        document.getElementById('correo-usuario-retiro').value = usuarioActual.getCorreo();
        
        // Generar ID y fecha
        document.getElementById('id-retiro').value = RecargaRetiro.contadorRetiro + 1;
        document.getElementById('fecha-retiro').value = new Date().toLocaleDateString();
        
        // Manejar envío del formulario
        formularioRetiro.addEventListener('submit', FormularioService.manejarRetiro);
    }
}

// Configurar enlaces del menú principal
function configurarEnlacesMenu() {
    // Enlace de recargas
    document.getElementById('recargas-link').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('recargas-modal').style.display = 'block';
    });
    
    // Enlace de retiros
    document.getElementById('retiros-link').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('retiros-modal').style.display = 'block';
    });
    
    // Enlace de reportes
    document.getElementById('reportes-link').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('reportes-modal').style.display = 'block';
    });
    
    // Cerrar modales
    document.querySelectorAll('.close-modal').forEach(function(elemento) {
        elemento.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Configurar botones de reportes
    document.querySelectorAll('.reporte-btn').forEach(function(boton) {
        boton.addEventListener('click', function() {
            const tipoReporte = this.getAttribute('data-tipo');
            mostrarReporte(tipoReporte);
        });
    });
}

// Función para mostrar reportes
function mostrarReporte(tipo) {
    const filtroContainer = document.getElementById('filtro-reporte');
    const resultadoContainer = document.getElementById('resultado-reporte');
    
    // Limpiar contenedores
    filtroContainer.innerHTML = '';
    resultadoContainer.innerHTML = '';
    
    // Configurar filtros según el tipo de reporte
    switch (tipo) {
        case 'Reportes_recarga':
            mostrarReporteRecargas();
            break;
        case 'Reportes_retiro':
            mostrarReporteRetiros();
            break;
        default:
            resultadoContainer.innerHTML = '<p>Reporte no disponible</p>';
    }
}

// Función para mostrar reporte de recargas
function mostrarReporteRecargas() {
    const resultadoContainer = document.getElementById('resultado-reporte');
    const recargas = RecargaRetiroService.obtenerTodasRecargas();
    
    if (recargas.length === 0) {
        resultadoContainer.innerHTML = '<p>No hay recargas registradas</p>';
        return;
    }
    
    let html = `
        <h3>Reporte de Recargas</h3>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Documento</th>
                    <th>Monto</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    recargas.forEach(recarga => {
        html += `
            <tr>
                <td>${recarga.id_recarga}</td>
                <td>${recarga.fecha.toLocaleDateString()}</td>
                <td>${recarga.getUsuario().getNombreCompleto()}</td>
                <td>${recarga.getUsuario().getDocumento()}</td>
                <td>$ ${recarga.getSaldoRecargado().toFixed(2)}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    resultadoContainer.innerHTML = html;
}

// Función para mostrar reporte de retiros
function mostrarReporteRetiros() {
    const resultadoContainer = document.getElementById('resultado-reporte');
    const retiros = RecargaRetiroService.obtenerTodosRetiros();
    
    if (retiros.length === 0) {
        resultadoContainer.innerHTML = '<p>No hay retiros registrados</p>';
        return;
    }
    
    let html = `
        <h3>Reporte de Retiros</h3>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Documento</th>
                    <th>Monto</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    retiros.forEach(retiro => {
        html += `
            <tr>
                <td>${retiro.id_retiro}</td>
                <td>${retiro.fecha.toLocaleDateString()}</td>
                <td>${retiro.getUsuario().getNombreCompleto()}</td>
                <td>${retiro.getUsuario().getDocumento()}</td>
                <td>$ ${retiro.getSaldoRetirado().toFixed(2)}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    resultadoContainer.innerHTML = html;
}