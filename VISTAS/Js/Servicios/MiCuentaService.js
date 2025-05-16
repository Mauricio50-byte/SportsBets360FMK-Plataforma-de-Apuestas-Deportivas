// MiCuentaService.js - Servicio para gestionar la sección "Mi Cuenta"

document.addEventListener('DOMContentLoaded', function() {
    console.log('MiCuentaService cargado correctamente');
    
    // Seleccionar elemento del menú Mi Cuenta
    const miCuentaLink = document.getElementById('mi-cuenta-link');
    
    // Si existe el link, añadir evento click
    if (miCuentaLink) {
        miCuentaLink.addEventListener('click', function(e) {
            e.preventDefault();
            cargarContenidoMiCuenta();
        });
    }
    
    // Función para cargar contenido de Mi Cuenta
    function cargarContenidoMiCuenta() {
        console.log('Intentando cargar contenido de Mi Cuenta');
        const contenidoPrincipal = document.getElementById('contenido-principal');
        
        if (!contenidoPrincipal) {
            console.error('No se encontró el elemento contenido-principal');
            return;
        }
        
        // Crear el contenedor para el contenido de Mi Cuenta
        const miCuentaContainer = document.createElement('div');
        miCuentaContainer.className = 'mi-cuenta-container';
        
        // Añadir el HTML del contenido de Mi Cuenta
        miCuentaContainer.innerHTML = `
            <div class="mi-cuenta-container">
                <h2 class="mi-cuenta-title">Gestión de Mi Cuenta</h2>
                
                <div class="mi-cuenta-sections">
                    <!-- Sección para actualizar datos del usuario -->
                    <div class="mi-cuenta-section datos-usuario-section">
                        <h3>Actualizar Datos Personales</h3>
                        <form id="actualizar-datos-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="nombre">Nombre</label>
                                    <input type="text" id="nombre" name="nombre" placeholder="Tu nombre">
                                </div>
                                <div class="form-group">
                                    <label for="apellido">Apellido</label>
                                    <input type="text" id="apellido" name="apellido" placeholder="Tu apellido">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="sexo">Sexo</label>
                                    <select id="sexo" name="sexo">
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="tipo-documento">Tipo de Documento</label>
                                    <select id="tipo-documento" name="tipo_documento">
                                        <option value="CC">Cédula de Ciudadanía</option>
                                        <option value="CE">Cédula de Extranjería</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="numero-documento">Número de Documento</label>
                                    <input type="text" id="numero-documento" name="documento" placeholder="Número de documento">
                                </div>
                                <div class="form-group">
                                    <label for="telefono">Teléfono</label>
                                    <input type="tel" id="telefono" name="telefono" placeholder="Tu teléfono">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="correo">Correo Electrónico</label>
                                    <input type="email" id="correo" name="correo" placeholder="Tu correo electrónico" >
                                </div>
                            </div>
                            
                            <button type="submit" id="actualizar-datos-btn" class="submit-btn">Actualizar Datos</button>
                        </form>
                        <div id="datos-actualizacion-mensaje" class="mensaje-resultado"></div>
                    </div>
                    
                    <!-- Sección para cambiar contraseña -->
                    <div class="mi-cuenta-section cambiar-contrasena-section">
                        <h3>Cambiar Contraseña</h3>
                        <form id="cambiar-contrasena-form">
                            <div class="form-group">
                                <label for="contrasena-actual">Contraseña Actual</label>
                                <input type="password" id="contrasena-actual" name="contrasena_actual" placeholder="Tu contraseña actual">
                            </div>
                            
                            <div class="form-group">
                                <label for="nueva-contrasena">Nueva Contraseña</label>
                                <input type="password" id="nueva-contrasena" name="nueva_contrasena" placeholder="Nueva contraseña">
                            </div>
                            
                            <div class="form-group">
                                <label for="confirmar-contrasena">Confirmar Contraseña</label>
                                <input type="password" id="confirmar-contrasena" name="confirmar_contrasena" placeholder="Confirma tu nueva contraseña">
                            </div>
                            
                            <button type="submit" id="cambiar-contrasena-btn" class="submit-btn">Cambiar Contraseña</button>
                        </form>
                        <div id="contrasena-actualizacion-mensaje" class="mensaje-resultado"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Limpiar contenido actual y añadir el contenedor de Mi Cuenta
        contenidoPrincipal.innerHTML = '';
        contenidoPrincipal.appendChild(miCuentaContainer);
        
        // Cargar los estilos si no están ya cargados
        cargarEstilosMiCuenta();
        
        // Inicializar los formularios y cargar datos del usuario
        inicializarMiCuenta();
    }
    
    // Función para cargar estilos de Mi Cuenta
    function cargarEstilosMiCuenta() {
        if (!document.querySelector('link[href*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/MiCuenta/StyleMiCuenta.css"]')) {
            console.log('Cargando estilos de Mi Cuenta');
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/MiCuenta/StyleMiCuenta.css';
            document.head.appendChild(link);
        }
    }
    
    // Función para inicializar la sección Mi Cuenta
    function inicializarMiCuenta() {
        // Cargar datos del usuario actual desde el almacenamiento de sesión
        // CORREGIDO: Unificar la nomenclatura a 'usuario'
        const usuario = JSON.parse(sessionStorage.getItem('usuario'));
        
        if (usuario) {
            // Rellenar el formulario con los datos del usuario
            document.getElementById('nombre').value = usuario.nombre || '';
            document.getElementById('apellido').value = usuario.apellido || '';
            document.getElementById('sexo').value = usuario.sexo || 'M';
            document.getElementById('tipo-documento').value = usuario.tipo_documento || 'CC';
            document.getElementById('numero-documento').value = usuario.documento || '';
            document.getElementById('telefono').value = usuario.celular || '';
            document.getElementById('correo').value = usuario.correo || '';
        } else {
            // Si no hay usuario en sesión, mostrar mensaje
            const datosUsuarioSection = document.querySelector('usuario');
            const cambiarContrasenaSection = document.querySelector('.cambiar-contrasena-section');
            
            if (datosUsuarioSection) {
                datosUsuarioSection.innerHTML = `
                    <div class="mensaje-error">
                        <p>Debe iniciar sesión para acceder a esta sección.</p>
                    </div>
                `;
            }
            
            if (cambiarContrasenaSection) {
                cambiarContrasenaSection.innerHTML = `
                    <div class="mensaje-error">
                        <p>Debe iniciar sesión para acceder a esta sección.</p>
                    </div>
                `;
            }
            return;
        }
        
        // Configurar el envío del formulario de actualización de datos
        const actualizarDatosForm = document.getElementById('actualizar-datos-form');
        if (actualizarDatosForm) {
            actualizarDatosForm.addEventListener('submit', function(e) {
                e.preventDefault();
                actualizarDatosUsuario();
            });
        }
        
        // Configurar el envío del formulario de cambio de contraseña
        const cambiarContrasenaForm = document.getElementById('cambiar-contrasena-form');
        if (cambiarContrasenaForm) {
            cambiarContrasenaForm.addEventListener('submit', function(e) {
                e.preventDefault();
                cambiarContrasenaUsuario();
            });
        }
    }
    
    // Función para actualizar los datos del usuario
    function actualizarDatosUsuario() {
        const mensajeElement = document.getElementById('datos-actualizacion-mensaje');
        
        // CORREGIDO: Unificar la nomenclatura a 'usuario'
        const usuario = JSON.parse(sessionStorage.getItem('usuario'));
        if (!usuario || !usuario.ID) {
            mostrarMensaje(mensajeElement, 'Debe iniciar sesión para actualizar sus datos', 'error');
            return;
        }
        
        // Obtener los datos del formulario
        // CORREGIDO: Asegurarse de que los IDs coinciden con los del HTML
        const formData = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            sexo: document.getElementById('sexo').value,
            tipo_documento: document.getElementById('tipo-documento').value,  // CORREGIDO: Guion en id
            numero_documento: document.getElementById('numero-documento').value,  // CORREGIDO: Guion en id
            telefono: document.getElementById('telefono').value,
            correo: document.getElementById('correo').value,
            id: usuario.ID
        };
        
        // Validar datos
        if (!formData.nombre || !formData.apellido || !formData.telefono) {
            mostrarMensaje(mensajeElement, 'Por favor, complete todos los campos obligatorios', 'error');
            return;
        }
        
        // En un entorno real, aquí iría la llamada a la API para actualizar los datos
        // Por ahora, simularemos una actualización exitosa
        console.log('Enviando datos de actualización:', formData);
        
        // Simular una llamada AJAX
        setTimeout(() => {
            // Actualizar los datos en sessionStorage
            usuario.nombre = formData.nombre;
            usuario.apellido = formData.apellido;
            usuario.sexo = formData.sexo;
            usuario.tipo_documento = formData.tipo_documento;
            usuario.telefono = formData.telefono;
            
            // CORREGIDO: Mantener la coherencia en el nombre de la variable de sesión
            sessionStorage.setItem('usuario', JSON.stringify(usuario));
            
            // Actualizar nombre en la barra de usuario
            const currentUserElement = document.getElementById('current-user');
            if (currentUserElement) {
                currentUserElement.textContent = formData.nombre + ' ' + formData.apellido;
            }
            
            mostrarMensaje(mensajeElement, 'Datos actualizados correctamente', 'exito');
        }, 1000);
    }
    
    // Función para cambiar la contraseña del usuario
    function cambiarContrasenaUsuario() {
        const mensajeElement = document.getElementById('contrasena-actualizacion-mensaje');
        
        // CORREGIDO: Unificar la nomenclatura a 'usuario'
        const usuario = JSON.parse(sessionStorage.getItem('usuario'));
        if (!usuario || !usuario.ID) {
            mostrarMensaje(mensajeElement, 'Debe iniciar sesión para cambiar su contraseña', 'error');
            return;
        }
        
        // Obtener los datos del formulario
        const contrasenaActual = document.getElementById('contrasena-actual').value;
        const nuevaContrasena = document.getElementById('nueva-contrasena').value;
        const confirmarContrasena = document.getElementById('confirmar-contrasena').value;
        
        // Validar datos
        if (!contrasenaActual || !nuevaContrasena || !confirmarContrasena) {
            mostrarMensaje(mensajeElement, 'Por favor, complete todos los campos', 'error');
            return;
        }
        
        if (nuevaContrasena !== confirmarContrasena) {
            mostrarMensaje(mensajeElement, 'Las contraseñas nuevas no coinciden', 'error');
            return;
        }
        
        if (nuevaContrasena.length < 6) {
            mostrarMensaje(mensajeElement, 'La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        
        // En un entorno real, aquí iría la llamada a la API para cambiar la contraseña
        // Por ahora, simularemos un cambio exitoso
        console.log('Enviando solicitud de cambio de contraseña');
        
        // Simular una llamada AJAX
        setTimeout(() => {
            // Limpiar el formulario
            document.getElementById('contrasena-actual').value = '';
            document.getElementById('nueva-contrasena').value = '';
            document.getElementById('confirmar-contrasena').value = '';
            
            mostrarMensaje(mensajeElement, 'Contraseña actualizada correctamente', 'exito');
        }, 1000);
    }
    
    // Función auxiliar para mostrar mensajes
    function mostrarMensaje(elemento, mensaje, tipo) {
        elemento.textContent = mensaje;
        elemento.className = 'mensaje-resultado mensaje-' + tipo;
        
        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
            elemento.textContent = '';
            elemento.className = 'mensaje-resultado';
        }, 5000);
    }
});