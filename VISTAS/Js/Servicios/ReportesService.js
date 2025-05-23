/**
 * Servicio para manejo de reportes de recargas y retiros
 * Integra con generar_reporte.php para generar reportes en diferentes formatos
 */
class ReportesService {
    constructor() {
        this.baseUrl = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/bd_RecrgasRetiros/generar_reporte.php';
        this.currentReportData = null;
        this.currentReportType = null;
        this.initializeEventListeners();
    }

    /**
     * Inicializa los event listeners para los reportes
     */
    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            // Event listener para el botón de reportes en el menú principal
            const reportesLink = document.getElementById('reportes-link');
            if (reportesLink) {
                reportesLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.mostrarMenuReportes(); // Ahora mostrará directamente en contenido principal
                    this.setActiveNavLink('reportes-link');
                });
            }

            // Event listeners para los botones de tipo de reporte
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('reporte-btn')) {
                    const tipo = e.target.getAttribute('data-tipo');
                    this.mostrarFiltrosReporte(tipo);
                }
            });
        });
    }

    /**
     * Muestra el menú principal de reportes
     */
    mostrarMenuReportes() {
        const contenidoPrincipal = document.getElementById('contenido-principal');
        
        if (!contenidoPrincipal) {
            console.error('No se encontró el elemento contenido-principal');
            return;
        }
        
        // Limpiar contenido previo
        this.limpiarFiltrosYResultados();
        
        // Crear el menú de reportes directamente en contenido principal
        const menuContainer = document.createElement('div');
        menuContainer.className = 'reportes-menu-container';
        
        menuContainer.innerHTML = `
            <div class="reportes-menu">
                <h2>Seleccionar Tipo de Reporte</h2>
                <div class="reportes-opciones">
                    <button type="button" class="btn btn-primary reporte-btn" data-tipo="Reportes_recarga">
                        <i class="bi bi-arrow-up-circle"></i>
                        Reporte de Recargas
                    </button>
                    <button type="button" class="btn btn-info reporte-btn" data-tipo="Reportes_retiro">
                        <i class="bi bi-arrow-down-circle"></i>
                        Reporte de Retiros
                    </button>
                </div>
            </div>
        `;
        
        contenidoPrincipal.innerHTML = '';
        contenidoPrincipal.appendChild(menuContainer);
        contenidoPrincipal.style.display = 'block';
    }

    /**
     * Muestra los filtros para el tipo de reporte seleccionado
     */
    mostrarFiltrosReporte(tipo) {
        this.currentReportType = tipo;
        
        // Obtener el contenido principal en lugar del filtro-reporte específico
        const contenidoPrincipal = document.getElementById('contenido-principal');
        
        if (!contenidoPrincipal) {
            console.error('No se encontró el elemento contenido-principal');
            return;
        }

        let tipoTexto = tipo === 'Reportes_recarga' ? 'Recargas' : 'Retiros';

        // Crear el contenedor para los filtros de reporte
        const filtrosContainer = document.createElement('div');
        filtrosContainer.className = 'filtros-reporte-container';
        
        // Añadir el HTML de los filtros
        filtrosContainer.innerHTML = `
            <div class="filtros-reporte">
                <h2>Filtros para Reporte de ${tipoTexto}</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="fecha-inicio">Fecha de Inicio:</label>
                        <input type="date" id="fecha-inicio" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="fecha-fin">Fecha de Fin:</label>
                        <input type="date" id="fecha-fin" class="form-control" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="formato-reporte">Formato de Exportación:</label>
                        <select id="formato-reporte" class="form-control">
                            <option value="json">Ver en Pantalla (JSON)</option>
                            <option value="csv">Descargar CSV</option>
                            <option value="excel">Descargar Excel</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-primary" onclick="window.reportesService.generarReporte()">
                        <i class="bi bi-file-earmark-text"></i> Generar Reporte
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="window.reportesService.limpiarFiltrosYResultados()">
                        <i class="bi bi-arrow-clockwise"></i> Limpiar
                    </button>
                    <button type="button" class="btn btn-success" onclick="window.reportesService.generarReporteCompleto()">
                        <i class="bi bi-file-earmark-spreadsheet"></i> Reporte Completo (Ambos)
                    </button>
                </div>
                
                <!-- Contenedor para mostrar los resultados del reporte -->
                <div id="resultados-reporte" class="resultados-reporte" style="display: none;">
                    <!-- Aquí se mostrarán los resultados -->
                </div>
            </div>
        `;
        
        // Limpiar contenido actual y añadir el contenedor de filtros
        contenidoPrincipal.innerHTML = '';
        contenidoPrincipal.appendChild(filtrosContainer);
        
        // Establecer fechas por defecto (último mes)
        this.establecerFechasPorDefecto();
    }

    /**
     * Establece fechas por defecto en los campos de fecha
     */
    establecerFechasPorDefecto() {
        const fechaFin = new Date();
        const fechaInicio = new Date();
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);
        
        const fechaInicioInput = document.getElementById('fecha-inicio');
        const fechaFinInput = document.getElementById('fecha-fin');
        
        if (fechaInicioInput) {
            fechaInicioInput.value = fechaInicio.toISOString().split('T')[0];
        }
        if (fechaFinInput) {
            fechaFinInput.value = fechaFin.toISOString().split('T')[0];
        }
    }

    /**
     * Genera el reporte según los filtros seleccionados
     */
    async generarReporte() {
        const fechaInicio = document.getElementById('fecha-inicio')?.value;
        const fechaFin = document.getElementById('fecha-fin')?.value;
        const formato = document.getElementById('formato-reporte')?.value;
        
        // Validaciones
        if (!fechaInicio || !fechaFin) {
            this.mostrarError('Por favor, selecciona las fechas de inicio y fin.');
            return;
        }
        
        if (new Date(fechaInicio) > new Date(fechaFin)) {
            this.mostrarError('La fecha de inicio no puede ser mayor que la fecha fin.');
            return;
        }
        
        // Determinar el tipo de reporte
        let tipo = this.currentReportType === 'Reportes_recarga' ? 'recargas' : 'retiros';
        
        const loadingBtn = event.target;
        const originalText = loadingBtn.innerHTML;
        loadingBtn.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i> Generando...';
        loadingBtn.disabled = true;
        
        try {
            const reporteData = {
                tipo: tipo,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                formato: formato
            };
            
            if (formato === 'json') {
                // Mostrar en pantalla
                const response = await this.enviarSolicitudReporte(reporteData);
                this.mostrarResultadosEnPantalla(response);
            } else {
                // Descargar archivo
                await this.descargarReporte(reporteData);
            }
            
        } catch (error) {
            console.error('Error al generar reporte:', error);
            this.mostrarError('Error al generar el reporte: ' + error.message);
        } finally {
            loadingBtn.innerHTML = originalText;
            loadingBtn.disabled = false;
        }
    }

    /**
     * Genera un reporte completo (recargas y retiros)
     */
    async generarReporteCompleto() {
        const fechaInicio = document.getElementById('fecha-inicio')?.value;
        const fechaFin = document.getElementById('fecha-fin')?.value;
        const formato = document.getElementById('formato-reporte')?.value;
        
        // Validaciones
        if (!fechaInicio || !fechaFin) {
            this.mostrarError('Por favor, selecciona las fechas de inicio y fin.');
            return;
        }
        
        if (new Date(fechaInicio) > new Date(fechaFin)) {
            this.mostrarError('La fecha de inicio no puede ser mayor que la fecha fin.');
            return;
        }
        
        const loadingBtn = event.target;
        const originalText = loadingBtn.innerHTML;
        loadingBtn.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i> Generando...';
        loadingBtn.disabled = true;
        
        try {
            const reporteData = {
                tipo: 'ambos',
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                formato: formato
            };
            
            if (formato === 'json') {
                // Mostrar en pantalla
                const response = await this.enviarSolicitudReporte(reporteData);
                this.mostrarResultadosEnPantalla(response);
            } else {
                // Descargar archivo
                await this.descargarReporte(reporteData);
            }
            
        } catch (error) {
            console.error('Error al generar reporte completo:', error);
            this.mostrarError('Error al generar el reporte completo: ' + error.message);
        } finally {
            loadingBtn.innerHTML = originalText;
            loadingBtn.disabled = false;
        }
    }

    /**
     * Envía la solicitud de reporte al servidor
     */
    async enviarSolicitudReporte(data) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Error desconocido en el servidor');
        }
        
        return result;
    }

    /**
     * Descarga el reporte en formato CSV o Excel
     */
    async descargarReporte(data) {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            // Obtener el nombre del archivo desde los headers o generar uno
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = `reporte_${data.tipo}_${data.fecha_inicio}_${data.fecha_fin}.${data.formato === 'excel' ? 'xls' : 'csv'}`;
            
            if (contentDisposition) {
                const matches = contentDisposition.match(/filename="(.+)"/);
                if (matches) {
                    filename = matches[1];
                }
            }
            
            // Crear blob y descargar
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            this.mostrarExito('Reporte descargado exitosamente');
            
        } catch (error) {
            throw new Error('Error al descargar el reporte: ' + error.message);
        }
    }

    /**
     * Muestra los resultados del reporte en pantalla
     */
    mostrarResultadosEnPantalla(response) {
        const resultadoContainer = document.getElementById('resultados-reporte');
        if (!resultadoContainer) {
            console.error('No se encontró el contenedor de resultados');
            return;
        }
        
        this.currentReportData = response;
        
        let html = `
            <div class="resultado-reporte">
                <div class="reporte-header">
                    <h3>${response.titulo}</h3>
                    <p><strong>Período:</strong> ${response.fecha_inicio} al ${response.fecha_fin}</p>
                    <p><strong>Total de registros:</strong> ${response.total_registros}</p>
                </div>
        `;
        
        // Mostrar resumen
        if (response.resumen) {
            html += this.generarHTMLResumen(response.resumen, response.datos);
        }
        
        // Mostrar datos
        if (response.datos) {
            html += this.generarHTMLDatos(response.datos);
        }
        
        html += `
                <div class="reporte-actions">
                    <button type="button" class="btn btn-success" onclick="window.reportesService.exportarCSV()">
                        <i class="bi bi-file-earmark-spreadsheet"></i> Exportar CSV
                    </button>
                    <button type="button" class="btn btn-primary" onclick="window.reportesService.exportarExcel()">
                        <i class="bi bi-file-earmark-excel"></i> Exportar Excel
                    </button>
                </div>
            </div>
        `;
        
        resultadoContainer.innerHTML = html;
        resultadoContainer.style.display = 'block';
    }

    /**
     * Genera HTML para el resumen estadístico
     */
    generarHTMLResumen(resumen, datos) {
        let html = '<div class="resumen-estadistico">';
        
        if (datos.recargas && datos.retiros) {
            // Reporte completo
            html += `
                <div class="row">
                    <div class="col-md-6">
                        <h4>Resumen de Recargas</h4>
                        ${this.generarTarjetasResumen(resumen.recargas)}
                    </div>
                    <div class="col-md-6">
                        <h4>Resumen de Retiros</h4>
                        ${this.generarTarjetasResumen(resumen.retiros)}
                    </div>
                </div>
            `;
        } else {
            // Reporte individual
            html += `
                <h4>Resumen Estadístico</h4>
                ${this.generarTarjetasResumen(resumen)}
            `;
        }
        
        html += '</div>';
        return html;
    }

    /**
     * Genera tarjetas de resumen estadístico
     */
    generarTarjetasResumen(resumen) {
        return `
            <div class="stats-cards">
                <div class="stats-card">
                    <div class="stats-number">${resumen.total_transacciones}</div>
                    <div class="stats-label">Total Transacciones</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">$${this.formatearNumero(resumen.monto_total)}</div>
                    <div class="stats-label">Monto Total</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">$${this.formatearNumero(resumen.monto_promedio)}</div>
                    <div class="stats-label">Promedio</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${resumen.usuarios_unicos || 0}</div>
                    <div class="stats-label">Usuarios Únicos</div>
                </div>
            </div>
        `;
    }

    /**
     * Genera HTML para mostrar los datos en tabla
     */
    generarHTMLDatos(datos) {
        let html = '<div class="datos-reporte">';
        
        if (datos.recargas && datos.retiros) {
            // Reporte completo
            html += `
                <div class="tabs-container">
                    <ul class="nav nav-tabs" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" data-bs-toggle="tab" href="#recargas-tab">
                                Recargas (${datos.recargas.length})
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="tab" href="#retiros-tab">
                                Retiros (${datos.retiros.length})
                            </a>
                        </li>
                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane fade show active" id="recargas-tab">
                            ${this.generarTabla(datos.recargas, 'recargas')}
                        </div>
                        <div class="tab-pane fade" id="retiros-tab">
                            ${this.generarTabla(datos.retiros, 'retiros')}
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Reporte individual
            const tipo = Array.isArray(datos) && datos.length > 0 && datos[0].Monto_recarga ? 'recargas' : 'retiros';
            html += this.generarTabla(datos, tipo);
        }
        
        html += '</div>';
        return html;
    }

    /**
     * Genera tabla HTML para los datos
     */
    generarTabla(datos, tipo) {
        if (!datos || datos.length === 0) {
            return '<p class="text-center">No se encontraron datos para el período seleccionado.</p>';
        }
        
        const esRecarga = tipo === 'recargas';
        const campoMonto = esRecarga ? 'Monto_recarga' : 'Monto_retiro';
        const campoFecha = esRecarga ? 'Fecha_recarga' : 'Fecha_retiro';
        
        let html = `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>ID Usuario</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Documento</th>
                            <th>Correo</th>
                            <th>Fecha</th>
                            <th>Monto</th>
                            <th>Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        datos.forEach(item => {
            html += `
                <tr>
                    <td>${item.ID_usuario}</td>
                    <td>${item.nombre}</td>
                    <td>${item.apellido}</td>
                    <td>${item.Documento_usuario}</td>
                    <td>${item.Correo_usuario}</td>
                    <td>${this.formatearFecha(item[campoFecha])}</td>
                    <td class="text-end">$${this.formatearNumero(item[campoMonto])}</td>
                    <td class="text-end">$${this.formatearNumero(item.Saldo)}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        return html;
    }

    /**
     * Exporta los datos actuales a CSV
     */
    async exportarCSV() {
        if (!this.currentReportData) {
            this.mostrarError('No hay datos para exportar');
            return;
        }
        
        const data = {
            ...this.currentReportData,
            formato: 'csv'
        };
        
        try {
            await this.descargarReporte({
                tipo: this.determinarTipoDeReporte(),
                fecha_inicio: this.currentReportData.fecha_inicio,
                fecha_fin: this.currentReportData.fecha_fin,
                formato: 'csv'
            });
        } catch (error) {
            this.mostrarError('Error al exportar CSV: ' + error.message);
        }
    }

    /**
     * Exporta los datos actuales a Excel
     */
    async exportarExcel() {
        if (!this.currentReportData) {
            this.mostrarError('No hay datos para exportar');
            return;
        }
        
        try {
            await this.descargarReporte({
                tipo: this.determinarTipoDeReporte(),
                fecha_inicio: this.currentReportData.fecha_inicio,
                fecha_fin: this.currentReportData.fecha_fin,
                formato: 'excel'
            });
        } catch (error) {
            this.mostrarError('Error al exportar Excel: ' + error.message);
        }
    }

    /**
     * Determina el tipo de reporte basado en los datos actuales
     */
    determinarTipoDeReporte() {
        if (!this.currentReportData || !this.currentReportData.datos) {
            return 'ambos';
        }
        
        const datos = this.currentReportData.datos;
        if (datos.recargas && datos.retiros) {
            return 'ambos';
        } else if (Array.isArray(datos) && datos.length > 0) {
            return datos[0].Monto_recarga ? 'recargas' : 'retiros';
        }
        
        return this.currentReportType === 'Reportes_recarga' ? 'recargas' : 'retiros';
    }

    /**
     * Limpia los filtros y resultados
     */
    limpiarFiltrosYResultados() {
        const resultadoContainer = document.getElementById('resultados-reporte');
        
        if (resultadoContainer) {
            resultadoContainer.innerHTML = '';
            resultadoContainer.style.display = 'none';
        }
        
        this.currentReportData = null;
        this.currentReportType = null;
    }

    /**
     * Cierra el modal de reportes
     */
    cerrarModalReportes() {        
        this.limpiarFiltrosYResultados();
        this.setActiveNavLink('inicio-link');
    }

    /**
     * Establece el enlace de navegación activo
     */
    setActiveNavLink(activeId) {
        // Remover clase active de todos los enlaces
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Agregar clase active al enlace seleccionado
        const activeLink = document.getElementById(activeId);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /**
     * Formatea números para mostrar
     */
    formatearNumero(numero) {
        return new Intl.NumberFormat('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numero);
    }

    /**
     * Formatea fechas para mostrar
     */
    formatearFecha(fecha) {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Muestra mensaje de error
     */
    mostrarError(mensaje) {
        // Crear toast de error
        this.mostrarToast(mensaje, 'error');
    }

    /**
     * Muestra mensaje de éxito
     */
    mostrarExito(mensaje) {
        // Crear toast de éxito
        this.mostrarToast(mensaje, 'success');
    }

    /**
     * Muestra toast notification
     */
    mostrarToast(mensaje, tipo) {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${tipo}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="bi bi-${tipo === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
                <span>${mensaje}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Mostrar toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Ocultar toast después de 5 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 5000);
    }
}

// Crear instancia global del servicio
window.reportesService = new ReportesService();