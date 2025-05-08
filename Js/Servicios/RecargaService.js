/**
 * RecargaService.js
 * Servicio encargado de gestionar las operaciones relacionadas con recargas
 */

class RecargaService {
    /**
     * Inicializa el servicio de recargas
     */
    static init() {
        // Inicializar los eventos relacionados con recargas
        this.initEventos();
    }

    /**
     * Inicializa los eventos relacionados con recargas
     */
    static initEventos() {
        // Eventos para el formulario de recarga
        const recargarFormEl = document.getElementById('recargar-form');
        if (recargarFormEl) {
            recargarFormEl.addEventListener('submit', this.procesarRecarga);
        }

        // Eventos para la carga de imágenes
        const uploadAreaEl = document.getElementById('upload-area');
        const comprobanteEl = document.getElementById('comprobante');
        const removeImageEl = document.getElementById('remove-image');
        
        if (uploadAreaEl && comprobanteEl) {
            uploadAreaEl.addEventListener('click', () => {
                comprobanteEl.click();
            });
        }
        
        if (comprobanteEl) {
            comprobanteEl.addEventListener('change', this.mostrarVistaPrevia);
        }
        
        if (removeImageEl) {
            removeImageEl.addEventListener('click', this.eliminarImagen);
        }

        // Eventos para autocompletado de datos de usuario
        const correoUsuarioEl = document.getElementById('correo-usuario');
        const documentoUsuarioEl = document.getElementById('documento-usuario');
        
        if (correoUsuarioEl) {
            correoUsuarioEl.addEventListener('blur', this.buscarUsuarioPorCorreo);
        }
        
        if (documentoUsuarioEl) {
            documentoUsuarioEl.addEventListener('blur', this.buscarUsuarioPorDocumento);
        }
    }

    /**
     * Muestra el formulario de recargas
     */
    static mostrarRecargas() {
        const modal = document.getElementById('recargas-modal');
        if (modal) {
            modal.style.display = 'block';
            
            // Establecer fecha actual
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
            
            // Ocultar previsualización de imagen
            const previewContainer = document.getElementById('preview-container');
            if (previewContainer) {
                previewContainer.classList.add('preview-hidden');
            }
        }
    }

    /**
     * Procesa el formulario de recarga
     * @param {Event} e - Evento de submit del formulario
     */
    static procesarRecarga(e) {
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
            UIService.mostrarMensaje('Error: Algunos elementos del formulario no se encontraron.');
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
            UIService.mostrarMensaje('Por favor, complete todos los campos obligatorios.');
            return;
        }
        
        if (montoRecarga <= 0) {
            UIService.mostrarMensaje('El monto de recarga debe ser mayor a cero.');
            return;
        }
        
        // Comprobar si hay un elemento para subir comprobante
        if (comprobanteEl && !comprobante) {
            UIService.mostrarMensaje('Por favor, suba un comprobante de pago.');
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
            // Actualizar saldo del usuario
            const usuarioActualizado = StorageDB.actualizarSaldo(correo, montoRecarga);
            
            // Guardar registro de recarga
            StorageDB.saveRecarga(recarga);
            
            // Actualizar saldo en la interfaz
            UIService.actualizarSaldoEnUI(usuarioActualizado ? usuarioActualizado.saldo : 0);
            
            // Mostrar mensaje de éxito
            UIService.mostrarMensaje(`Recarga procesada correctamente.\nSu nuevo saldo es: $${usuarioActualizado ? usuarioActualizado.saldo : 'Actualizado'}`);
            
            // Cerrar modal y resetear formulario
            const recargarForm = document.getElementById('recargar-form');
            if (recargarForm) {
                recargarForm.reset();
            }
            
            const previewContainer = document.getElementById('preview-container');
            if (previewContainer) {
                previewContainer.classList.add('preview-hidden');
            }
            
            UIService.cerrarModal();
            
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
            UIService.mostrarMensaje('Ocurrió un error al procesar su recarga. Por favor, inténtelo de nuevo más tarde.');
        }
    }

    /**
     * Muestra la vista previa de la imagen seleccionada
     * @param {Event} e - Evento change del input file
     */
    static mostrarVistaPrevia(e) {
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

    /**
     * Elimina la imagen seleccionada
     */
    static eliminarImagen() {
        const comprobante = document.getElementById('comprobante');
        const previewContainer = document.getElementById('preview-container');
        
        if (comprobante) comprobante.value = '';
        if (previewContainer) previewContainer.classList.add('preview-hidden');
    }

    /**
     * Busca un usuario por correo y autocompleta los campos del formulario
     */
    static buscarUsuarioPorCorreo() {
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

    /**
     * Busca un usuario por documento y autocompleta los campos del formulario
     */
    static buscarUsuarioPorDocumento() {
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
}