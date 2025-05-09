class UsuarioService {
    // Método para registrar un nuevo usuario
    static registrarUsuario(nombre, apellidos, documento, telefono, correo, contraseña) {
        // Validaciones
        if (!nombre || !apellidos || !documento || !telefono || !correo || !contraseña) {
            throw new Error("Todos los campos son obligatorios");
        }
        
        // Verificar si el usuario ya existe
        if (Usuario.usuariosBD[correo]) {
            throw new Error("El usuario con este correo ya existe");
        }
        
        // Crear nuevo usuario
        const nuevoUsuario = new Usuario(nombre, apellidos, documento, telefono, correo, contraseña);
        
        // Guardar en la base de datos
        Usuario.usuariosBD[correo] = nuevoUsuario;
        AlmacenamientoService.guardarUsuarios();
        
        return nuevoUsuario;
    }
    
    // Método para iniciar sesión
    static login(correo, contraseña) {
        const usuario = Usuario.usuariosBD[correo];
        
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }
        
        if (usuario.getContraseña() !== contraseña) {
            throw new Error("Contraseña incorrecta");
        }
        
        // Guardar sesión actual
        sessionStorage.setItem('usuarioActual', correo);
        
        return usuario;
    }
    
    // Método para cerrar sesión
    static logout() {
        sessionStorage.removeItem('usuarioActual');
    }
    
    // Método para obtener el usuario actual
    static getUsuarioActual() {
        const correo = sessionStorage.getItem('usuarioActual');
        if (!correo) return null;
        
        return Usuario.usuariosBD[correo];
    }
    
    // Método para verificar si hay un usuario con la sesión iniciada
    static estaLogueado() {
        return !!sessionStorage.getItem('usuarioActual');
    }
    
    // Método para buscar un usuario por documento
    static buscarPorDocumento(documento) {
        for (const correo in Usuario.usuariosBD) {
            if (Usuario.usuariosBD[correo].getDocumento() === documento) {
                return Usuario.usuariosBD[correo];
            }
        }
        return null;
    }
}

// services/RecargaRetiroService.js
class RecargaRetiroService {
    // Método para realizar una recarga
    static realizarRecarga(correoUsuario, documento, monto) {
        // Validaciones
        if (!correoUsuario || !documento || !monto) {
            throw new Error("Todos los campos son obligatorios");
        }
        
        if (isNaN(monto) || monto <= 0) {
            throw new Error("El monto debe ser un número positivo");
        }
        
        // Buscar usuario
        let usuario = Usuario.usuariosBD[correoUsuario];
        
        if (!usuario) {
            usuario = UsuarioService.buscarPorDocumento(documento);
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }
        }
        
        // Crear recarga
        const recarga = new RecargaRetiro(usuario, monto, monto, 0);
        
        // Guardar en la base de datos
        const idRecarga = `recarga_${recarga.id_recarga}`;
        RecargaRetiro.recarga_retiroBD[idRecarga] = recarga;
        
        // Agregar a la lista de recargas del usuario
        Usuario.recargar_retirar.push(recarga);
        
        // Guardar datos
        AlmacenamientoService.guardarRecargasRetiros();
        
        return recarga;
    }
    
    // Método para realizar un retiro
    static realizarRetiro(correoUsuario, documento, monto) {
        // Validaciones
        if (!correoUsuario || !documento || !monto) {
            throw new Error("Todos los campos son obligatorios");
        }
        
        if (isNaN(monto) || monto <= 0) {
            throw new Error("El monto debe ser un número positivo");
        }
        
        // Buscar usuario
        let usuario = Usuario.usuariosBD[correoUsuario];
        
        if (!usuario) {
            usuario = UsuarioService.buscarPorDocumento(documento);
            if (!usuario) {
                throw new Error("Usuario no encontrado");
            }
        }
        
        // Verificar saldo disponible
        const saldoDisponible = this.obtenerSaldoUsuario(correoUsuario);
        if (saldoDisponible < monto) {
            throw new Error("Saldo insuficiente para realizar el retiro");
        }
        
        // Crear retiro
        const retiro = new RecargaRetiro(usuario, -monto, 0, monto);
        
        // Guardar en la base de datos
        const idRetiro = `retiro_${retiro.id_retiro}`;
        RecargaRetiro.recarga_retiroBD[idRetiro] = retiro;
        
        // Agregar a la lista de retiros del usuario
        Usuario.recargar_retirar.push(retiro);
        
        // Guardar datos
        AlmacenamientoService.guardarRecargasRetiros();
        
        return retiro;
    }
    
    // Método para obtener el saldo de un usuario
    static obtenerSaldoUsuario(correoUsuario) {
        let saldo = 0;
        
        for (const operacion of Usuario.recargar_retirar) {
            if (operacion.getUsuario().getCorreo() === correoUsuario) {
                saldo += operacion.getSaldo();
            }
        }
        
        return saldo;
    }
    
    // Método para obtener historial de operaciones de un usuario
    static obtenerHistorialUsuario(correoUsuario) {
        return Usuario.recargar_retirar.filter(op => op.getUsuario().getCorreo() === correoUsuario);
    }
    
    // Método para obtener todas las recargas
    static obtenerTodasRecargas() {
        return Object.values(RecargaRetiro.recarga_retiroBD).filter(op => op.getSaldoRecargado() > 0);
    }
    
    // Método para obtener todos los retiros
    static obtenerTodosRetiros() {
        return Object.values(RecargaRetiro.recarga_retiroBD).filter(op => op.getSaldoRetirado() > 0);
    }
}

// services/FormularioService.js
class FormularioService {
    // Método para manejar el envío del formulario de registro
    static manejarRegistro(event) {
        event.preventDefault();
        
        try {
            const formData = new FormData(event.target);
            const nombre = formData.get('nombre');
            const apellido = formData.get('apellido');
            const documento = formData.get('numero_documento');
            const telefono = formData.get('telefono');
            const email = formData.get('email');
            const contrasena = formData.get('contrasena');
            const repetirContrasena = formData.get('repetir_contrasena');
            
            // Validar contraseñas
            if (contrasena !== repetirContrasena) {
                throw new Error("Las contraseñas no coinciden");
            }
            
            // Registrar usuario
            const usuario = UsuarioService.registrarUsuario(
                nombre, apellido, documento, telefono, email, contrasena
            );
            
            alert("Usuario registrado correctamente");
            
            // Redirigir o limpiar formulario
            event.target.reset();
            
            // Cambiar a la pestaña de inicio de sesión
            document.getElementById('login-tab').click();
            
        } catch (error) {
            alert("Error al registrar: " + error.message);
        }
    }
    
    // Método para manejar el envío del formulario de inicio de sesión
    static manejarLogin(event) {
        event.preventDefault();
        
        try {
            const formData = new FormData(event.target);
            const correo = formData.get('correo');
            const password = formData.get('password');
            
            // Iniciar sesión
            const usuario = UsuarioService.login(correo, password);
            
            // Cerrar modal
            const modal = document.getElementById('formulario-login');
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            bootstrapModal.hide();
            
            // Redirigir a la página de menú principal
            window.location.href = 'Menu.html';
            
        } catch (error) {
            alert("Error al iniciar sesión: " + error.message);
        }
    }
    
    // Método para manejar el envío del formulario de recarga
    static manejarRecarga(event) {
        event.preventDefault();
        
        try {
            const correoUsuario = document.getElementById('correo-usuario').value;
            const documento = document.getElementById('documento-usuario').value;
            const monto = parseFloat(document.getElementById('monto-recarga').value);
            
            // Realizar recarga
            const recarga = RecargaRetiroService.realizarRecarga(correoUsuario, documento, monto);
            
            alert(`Recarga realizada correctamente. ID: ${recarga.id_recarga}`);
            
            // Actualizar saldo en la interfaz
            const usuarioActual = UsuarioService.getUsuarioActual();
            if (usuarioActual && usuarioActual.getCorreo() === correoUsuario) {
                const saldo = RecargaRetiroService.obtenerSaldoUsuario(correoUsuario);
                document.getElementById('user-balance').textContent = `$ ${saldo.toFixed(2)}`;
            }
            
            // Cerrar modal y limpiar formulario
            document.getElementById('recargas-modal').style.display = 'none';
            event.target.reset();
            
        } catch (error) {
            alert("Error al realizar la recarga: " + error.message);
        }
    }
    
    // Método para manejar el envío del formulario de retiro
    static manejarRetiro(event) {
        event.preventDefault();
        
        try {
            const correoUsuario = document.getElementById('correo-usuario-retiro').value;
            const documento = document.getElementById('documento-usuario-retiro').value;
            const monto = parseFloat(document.getElementById('monto-retiro').value);
            
            // Realizar retiro
            const retiro = RecargaRetiroService.realizarRetiro(correoUsuario, documento, monto);
            
            alert(`Retiro realizado correctamente. ID: ${retiro.id_retiro}`);
            
            // Actualizar saldo en la interfaz
            const usuarioActual = UsuarioService.getUsuarioActual();
            if (usuarioActual && usuarioActual.getCorreo() === correoUsuario) {
                const saldo = RecargaRetiroService.obtenerSaldoUsuario(correoUsuario);
                document.getElementById('user-balance').textContent = `$ ${saldo.toFixed(2)}`;
            }
            
            // Cerrar modal y limpiar formulario
            document.getElementById('retiros-modal').style.display = 'none';
            event.target.reset();
            
        } catch (error) {
            alert("Error al realizar el retiro: " + error.message);
        }
    }
}