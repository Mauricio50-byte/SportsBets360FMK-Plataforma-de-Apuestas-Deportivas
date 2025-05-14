/**
 * ReportesRecargasRetiros.js
 * Servicio para gestionar los reportes de recargas y retiros del sistema
 */

class ReporteService {
    constructor() {
        // URL base para las solicitudes al backend
        this.baseURL = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/';
        
        // Elementos UI para reportes
        this.reportesModal = document.getElementById('reportes-modal');
        this.filtroContainer = document.getElementById('filtro-reporte');
        this.resultadoContainer = document.getElementById('resultado-reporte');
        
        // Referencias a los botones de reportes
        this.botonesReporte = document.querySelectorAll('.reporte-btn');
        
        // Inicializar event listeners
        this.inicializarEventListeners();
    }
    
    /**
     * Inicializa los event listeners para los botones de reportes
     */
    inicializarEventListeners() {
        // Añadir listeners a los botones de reporte
        this.botonesReporte.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const tipoReporte = e.target.getAttribute('data-tipo');
                this.mostrarFormularioReporte(tipoReporte);
            });
        });
        
        // Enlazar los eventos de reportes específicos al link del menú
        document.getElementById('reportes-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.abrirModalReportes();
        });
    }
    
    /**
     * Abre el modal de reportes
     */
    abrirModalReportes() {
        this.reportesModal.style.display = 'block';
        
        // Limpiar contenedores
        this.filtroContainer.innerHTML = '';
        this.resultadoContainer.innerHTML = '';
    }
    
    /**
     * Muestra el formulario apropiado según el tipo de reporte seleccionado
     * @param {string} tipoReporte Tipo de reporte a mostrar
     */
    mostrarFormularioReporte(tipoReporte) {
        // Limpiar el contenedor de filtros
        this.filtroContainer.innerHTML = '';
        this.resultadoContainer.innerHTML = '';
        
        // Formulario HTML para el filtro según el tipo
        let formularioHTML = '';
        
        switch (tipoReporte) {
            case 'Reportes_recarga':
                formularioHTML = `
                    <h3>Reporte de Recargas</h3>
                    <form id="formulario-reporte-recarga" class="form-reporte">
                        <div class="form-group">
                            <label for="fecha-inicio-recarga">Fecha Inicio:</label>
                            <input type="date" id="fecha-inicio-recarga" required>
                        </div>
                        <div class="form-group">
                            <label for="fecha-fin-recarga">Fecha Fin:</label>
                            <input type="date" id="fecha-fin-recarga" required>
                        </div>
                        <button type="submit" class="submit-btn">Generar Reporte</button>
                    </form>
                `;
                break;
                
            case 'Reportes_retiro':
                formularioHTML = `
                    <h3>Reporte de Retiros</h3>
                    <form id="formulario-reporte-retiro" class="form-reporte">
                        <div class="form-group">
                            <label for="fecha-inicio-retiro">Fecha Inicio:</label>
                            <input type="date" id="fecha-inicio-retiro" required>
                        </div>
                        <div class="form-group">
                            <label for="fecha-fin-retiro">Fecha Fin:</label>
                            <input type="date" id="fecha-fin-retiro" required>
                        </div>
                        <button type="submit" class="submit-btn">Generar Reporte</button>
                    </form>
                `;
                break;
                
            case 'Reportes_usuario':
                formularioHTML = `
                    <h3>Reporte de Usuario</h3>
                    <form id="formulario-reporte-usuario" class="form-reporte">
                        <div class="form-group">
                            <label for="id-usuario-reporte">ID o Nombre de Usuario:</label>
                            <input type="text" id="id-usuario-reporte" required placeholder="Ingrese ID o nombre de usuario">
                        </div>
                        <button type="submit" class="submit-btn">Generar Reporte</button>
                    </form>
                `;
                break;
                
            default:
                formularioHTML = `
                    <div class="mensaje-alerta">
                        <p>Por favor seleccione un tipo de reporte válido</p>
                    </div>
                `;
        }
        
        // Insertar el formulario en el contenedor
        this.filtroContainer.innerHTML = formularioHTML;
        
        // Agregar event listeners a los formularios
        if (tipoReporte === 'Reportes_recarga') {
            document.getElementById('formulario-reporte-recarga').addEventListener('submit', (e) => {
                e.preventDefault();
                this.generarReporteRecargas();
            });
        } else if (tipoReporte === 'Reportes_retiro') {
            document.getElementById('formulario-reporte-retiro').addEventListener('submit', (e) => {
                e.preventDefault();
                this.generarReporteRetiros();
            });
        } else if (tipoReporte === 'Reportes_usuario') {
            document.getElementById('formulario-reporte-usuario').addEventListener('submit', (e) => {
                e.preventDefault();
                this.generarReporteUsuario();
            });
        }
    }
    
    /**
     * Genera un reporte de recargas basado en el rango de fechas
     */
    generarReporteRecargas() {
        const fechaInicio = document.getElementById('fecha-inicio-recarga').value;
        const fechaFin = document.getElementById('fecha-fin-recarga').value;
        
        if (!fechaInicio || !fechaFin) {
            this.mostrarMensaje('Por favor ingrese ambas fechas', 'error');
            return;
        }
        
        this.mostrarCargando();
        
        // Datos para la solicitud
        const formData = new FormData();
        formData.append('tipo_reporte', 'recargas');
        formData.append('fecha_inicio', fechaInicio);
        formData.append('fecha_fin', fechaFin);
        
        // Realizar petición al servidor
        fetch('http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/bd_RecrgasRetiros/generar_reporte.php', {
            method: 'POST',
            body: formData,
            credentials: 'include' // Importante: envía cookies con la solicitud
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'error') {
                this.mostrarMensaje(data.message, 'error');
                return;
            }
            this.mostrarResultadoReporteRecargas(data);
        })
        .catch(error => {
            console.error('Error al generar reporte de recargas:', error);
            this.mostrarMensaje('Error al generar el reporte. Consulte la consola para más detalles.', 'error');
        });
    }
    
    /**
     * Genera un reporte de retiros basado en el rango de fechas
     */
    generarReporteRetiros() {
        const fechaInicio = document.getElementById('fecha-inicio-retiro').value;
        const fechaFin = document.getElementById('fecha-fin-retiro').value;
        
        if (!fechaInicio || !fechaFin) {
            this.mostrarMensaje('Por favor ingrese ambas fechas', 'error');
            return;
        }
        
        this.mostrarCargando();
        
        // Datos para la solicitud
        const formData = new FormData();
        formData.append('tipo_reporte', 'retiros');
        formData.append('fecha_inicio', fechaInicio);
        formData.append('fecha_fin', fechaFin);
        
         // Realizar petición al servidor
        fetch('http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/bd_RecrgasRetiros/generar_reporte.php', {
            method: 'POST',
            body: formData,
            credentials: 'include' // Importante: envía cookies con la solicitud
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'error') {
                this.mostrarMensaje(data.message, 'error');
                return;
            }
            this.mostrarResultadoReporteRetiros(data);
        })
        .catch(error => {
            console.error('Error al generar reporte de retiros:', error);
            this.mostrarMensaje('Error al generar el reporte. Consulte la consola para más detalles.', 'error');
        });
    }
    
    /**
     * Genera un reporte de usuario específico
     */
    generarReporteUsuario() {
        const idUsuario = document.getElementById('id-usuario-reporte').value;
        
        if (!idUsuario) {
            this.mostrarMensaje('Por favor ingrese un ID o nombre de usuario', 'error');
            return;
        }
        
        this.mostrarCargando();
        
        // Datos para la solicitud
        const formData = new FormData();
        formData.append('tipo_reporte', 'usuario');
        formData.append('id_usuario', idUsuario);
        
        // Realizar petición al servidor
        fetch('http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/bd_RecrgasRetiros/generar_reporte.php', {
            method: 'POST',
            body: formData,
            credentials: 'include' // Importante: envía cookies con la solicitud
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'error') {
                this.mostrarMensaje(data.message, 'error');
                return;
            }
            this.mostrarResultadoReporteUsuario(data);
        })
        .catch(error => {
            console.error('Error al generar reporte de usuario:', error);
            this.mostrarMensaje('Error al generar el reporte. Consulte la consola para más detalles.', 'error');
        });
    }
    
    /**
     * Muestra el resultado del reporte de recargas
     * @param {Object} data Datos del reporte
     */
    mostrarResultadoReporteRecargas(data) {
        // Limpiar contenedor de resultados
        this.resultadoContainer.innerHTML = '';
        
        // Crear contenedor para el reporte
        const reporteHTML = `
            <div class="reporte-resultado">
                <h3>Reporte de Recargas</h3>
                <div class="reporte-info">
                    <p><strong>Período:</strong> ${data.periodo.inicio} al ${data.periodo.fin}</p>
                    <p><strong>Total de recargas:</strong> ${data.estadisticas.cantidad}</p>
                    <p><strong>Monto total:</strong> $${data.estadisticas.totalMonto.toFixed(2)}</p>
                    <p><strong>Monto promedio:</strong> $${data.estadisticas.promedioMonto.toFixed(2)}</p>
                </div>
                
                <h4>Detalle de Recargas</h4>
                <div class="tabla-container">
                    <table class="tabla-reporte">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Fecha</th>
                                <th>Monto</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.generarFilasTabla(data.recargas)}
                        </tbody>
                    </table>
                </div>
                
                <div class="reporte-acciones">
                    <button id="exportar-csv-recargas" class="btn-exportar">Exportar a CSV</button>
                    <button id="imprimir-recargas" class="btn-imprimir">Imprimir</button>
                </div>
            </div>
        `;
        
        // Insertar el HTML en el contenedor
        this.resultadoContainer.innerHTML = reporteHTML;
        
        // Guardar datos para exportación
        this.datosActualesReporte = data;
        
        // Añadir event listeners para los botones
        document.getElementById('exportar-csv-recargas').addEventListener('click', () => {
            this.exportarCSV(data.recargas, 'recargas');
        });
        
        document.getElementById('imprimir-recargas').addEventListener('click', () => {
            this.imprimirReporte();
        });
    }
    
    /**
     * Muestra el resultado del reporte de retiros
     * @param {Object} data Datos del reporte
     */
    mostrarResultadoReporteRetiros(data) {
        // Limpiar contenedor de resultados
        this.resultadoContainer.innerHTML = '';
        
        // Crear contenedor para el reporte
        const reporteHTML = `
            <div class="reporte-resultado">
                <h3>Reporte de Retiros</h3>
                <div class="reporte-info">
                    <p><strong>Período:</strong> ${data.periodo.inicio} al ${data.periodo.fin}</p>
                    <p><strong>Total de retiros:</strong> ${data.estadisticas.cantidad}</p>
                    <p><strong>Monto total:</strong> $${data.estadisticas.totalMonto.toFixed(2)}</p>
                    <p><strong>Monto promedio:</strong> $${data.estadisticas.promedioMonto.toFixed(2)}</p>
                </div>
                
                <h4>Detalle de Retiros</h4>
                <div class="tabla-container">
                    <table class="tabla-reporte">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Fecha</th>
                                <th>Monto</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.generarFilasTabla(data.retiros)}
                        </tbody>
                    </table>
                </div>
                
                <div class="reporte-acciones">
                    <button id="exportar-csv-retiros" class="btn-exportar">Exportar a CSV</button>
                    <button id="imprimir-retiros" class="btn-imprimir">Imprimir</button>
                </div>
            </div>
        `;
        
        // Insertar el HTML en el contenedor
        this.resultadoContainer.innerHTML = reporteHTML;
        
        // Guardar datos para exportación
        this.datosActualesReporte = data;
        
        // Añadir event listeners para los botones
        document.getElementById('exportar-csv-retiros').addEventListener('click', () => {
            this.exportarCSV(data.retiros, 'retiros');
        });
        
        document.getElementById('imprimir-retiros').addEventListener('click', () => {
            this.imprimirReporte();
        });
    }
    
    /**
     * Muestra el resultado del reporte de usuario
     * @param {Object} data Datos del reporte
     */
    mostrarResultadoReporteUsuario(data) {
        // Limpiar contenedor de resultados
        this.resultadoContainer.innerHTML = '';
        
        // Crear contenedor para el reporte
        const reporteHTML = `
            <div class="reporte-resultado">
                <h3>Reporte de Usuario</h3>
                <div class="reporte-info">
                    <p><strong>Usuario:</strong> ${data.usuario.nombre}</p>
                    <p><strong>Email:</strong> ${data.usuario.email || 'No disponible'}</p>
                    <p><strong>Balance Neto:</strong> $${data.balance.balanceNeto.toFixed(2)}</p>
                </div>
                
                <h4>Historial de Recargas</h4>
                <div class="reporte-info">
                    <p><strong>Total recargas:</strong> ${data.recargas.estadisticas.cantidad}</p>
                    <p><strong>Monto total:</strong> $${data.recargas.estadisticas.totalMonto.toFixed(2)}</p>
                </div>
                <div class="tabla-container">
                    <table class="tabla-reporte">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Monto</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.generarFilasTabla(data.recargas.datos, true)}
                        </tbody>
                    </table>
                </div>
                
                <h4>Historial de Retiros</h4>
                <div class="reporte-info">
                    <p><strong>Total retiros:</strong> ${data.retiros.estadisticas.cantidad}</p>
                    <p><strong>Monto total:</strong> $${data.retiros.estadisticas.totalMonto.toFixed(2)}</p>
                </div>
                <div class="tabla-container">
                    <table class="tabla-reporte">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Monto</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.generarFilasTabla(data.retiros.datos, true)}
                        </tbody>
                    </table>
                </div>
                
                <div class="reporte-acciones">
                    <button id="exportar-csv-usuario" class="btn-exportar">Exportar a CSV</button>
                    <button id="imprimir-usuario" class="btn-imprimir">Imprimir</button>
                </div>
            </div>
        `;
        
        // Insertar el HTML en el contenedor
        this.resultadoContainer.innerHTML = reporteHTML;
        
        // Guardar datos para exportación
        this.datosActualesReporte = data;
        
        // Añadir event listeners para los botones
        document.getElementById('exportar-csv-usuario').addEventListener('click', () => {
            this.exportarCSVUsuario(data);
        });
        
        document.getElementById('imprimir-usuario').addEventListener('click', () => {
            this.imprimirReporte();
        });
    }
    
    /**
     * Genera las filas de la tabla para un reporte
     * @param {Array} datos Datos para generar las filas
     * @param {boolean} esUsuario Indica si es un reporte de usuario (omite la columna de usuario)
     * @returns {string} HTML de las filas de la tabla
     */
    generarFilasTabla(datos, esUsuario = false) {
        if (!datos || datos.length === 0) {
            return '<tr><td colspan="5" class="sin-datos">No hay datos disponibles</td></tr>';
        }
        
        return datos.map(item => {
            // Determinar si es necesario mostrar la columna de usuario
            const columnaUsuario = esUsuario ? '' : `<td>${item.usuario || 'N/A'}</td>`;
            
            return `
                <tr>
                    <td>${item.id || 'N/A'}</td>
                    ${columnaUsuario}
                    <td>${item.fecha || 'N/A'}</td>
                    <td>$${parseFloat(item.monto).toFixed(2)}</td>
                    <td>${item.estado || 'Completado'}</td>
                </tr>
            `;
        }).join('');
    }
    
    /**
     * Exporta los datos del reporte a un archivo CSV
     * @param {Array} datos Datos a exportar
     * @param {string} nombreArchivo Nombre del archivo a generar
     */
    exportarCSV(datos, tipoReporte) {
        if (!datos || datos.length === 0) {
            this.mostrarMensaje('No hay datos para exportar', 'error');
            return;
        }
        
        this.mostrarCargando();
        
        // Datos para la solicitud
        const formData = new FormData();
        formData.append('tipo_reporte', 'exportar_csv');
        formData.append('datos_reporte', JSON.stringify(datos));
        formData.append('nombre_archivo', `reporte_${tipoReporte}_${new Date().toISOString().slice(0, 10)}`);
        
         // Realizar petición al servidor
        fetch('http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/bd_RecrgasRetiros/generar_reporte.php', {
            method: 'POST',
            body: formData,
            credentials: 'include' // Importante: envía cookies con la solicitud
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'error') {
                this.mostrarMensaje(data.message, 'error');
                return;
            }
            
            // Crear enlace para descargar el archivo
            const linkDescarga = document.createElement('a');
            linkDescarga.href = `${this.baseURL}UTILIDADES/BD_Exportada/${data.archivo}`;
            linkDescarga.download = data.archivo;
            document.body.appendChild(linkDescarga);
            linkDescarga.click();
            document.body.removeChild(linkDescarga);
            
            this.mostrarMensaje('Archivo CSV exportado con éxito', 'success');
        })
        .catch(error => {
            console.error('Error al exportar a CSV:', error);
            this.mostrarMensaje('Error al exportar el archivo CSV', 'error');
        });
    }
    
    /**
     * Exporta los datos del reporte de usuario a un archivo CSV
     * @param {Object} datos Datos del reporte de usuario
     */
    exportarCSVUsuario(datos) {
        if (!datos) {
            this.mostrarMensaje('No hay datos para exportar', 'error');
            return;
        }
        
        this.mostrarCargando();
        
        // Preparar datos para exportar (estructura específica para usuario)
        const datosExportar = {
            usuario: datos.usuario,
            recargas: {
                datos: datos.recargas.datos
            },
            retiros: {
                datos: datos.retiros.datos
            }
        };
        
        // Datos para la solicitud
        const formData = new FormData();
        formData.append('tipo_reporte', 'exportar_csv');
        formData.append('datos_reporte', JSON.stringify(datosExportar));
        formData.append('nombre_archivo', `reporte_usuario_${datos.usuario.nombre}_${new Date().toISOString().slice(0, 10)}`);
        
         // Realizar petición al servidor
        fetch('http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/bd_RecrgasRetiros/generar_reporte.php', {
            method: 'POST',
            body: formData,
            credentials: 'include' // Importante: envía cookies con la solicitud
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'error') {
                this.mostrarMensaje(data.message, 'error');
                return;
            }
            
            // Crear enlace para descargar el archivo
            const linkDescarga = document.createElement('a');
            linkDescarga.href = `${this.baseURL}UTILIDADES/BD_Exportada/${data.archivo}`;
            linkDescarga.download = data.archivo;
            document.body.appendChild(linkDescarga);
            linkDescarga.click();
            document.body.removeChild(linkDescarga);
            
            this.mostrarMensaje('Archivo CSV exportado con éxito', 'success');
        })
        .catch(error => {
            console.error('Error al exportar a CSV:', error);
            this.mostrarMensaje('Error al exportar el archivo CSV', 'error');
        });
    }
    
    /**
     * Imprime el reporte actual
     */
    imprimirReporte() {
        // Crear una ventana de impresión
        const ventanaImpresion = window.open('', '_blank');
        
        // Obtener el contenido del resultado actual
        const contenidoImprimir = this.resultadoContainer.querySelector('.reporte-resultado');
        
        if (!contenidoImprimir) {
            this.mostrarMensaje('No hay contenido para imprimir', 'error');
            ventanaImpresion.close();
            return;
        }
        
        // Crear el HTML para la ventana de impresión
        const estilosCSS = `
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                h3, h4 {
                    color: #333;
                }
                .reporte-info {
                    margin-bottom: 20px;
                }
                .tabla-reporte {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                .tabla-reporte th, .tabla-reporte td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                .tabla-reporte th {
                    background-color: #f2f2f2;
                }
                .tabla-reporte tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .reporte-acciones {
                    display: none;
                }
                @media print {
                    .no-print {
                        display: none;
                    }
                }
            </style>
        `;
        
        // Construir el HTML completo
        ventanaImpresion.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Reporte - SportsBets360FMK</title>
                ${estilosCSS}
            </head>
            <body>
                <div class="cabecera">
                    <h2>SportsBets360FMK - Reporte</h2>
                    <p>Fecha de impresión: ${new Date().toLocaleString()}</p>
                </div>
                ${contenidoImprimir.outerHTML}
                <div class="no-print">
                    <button onclick="window.print();">Imprimir</button>
                    <button onclick="window.close();">Cerrar</button>
                </div>
            </body>
            </html>
        `);
        
        // Finalizar la escritura del documento
        ventanaImpresion.document.close();
        
        // Dar tiempo al navegador para renderizar el contenido
        setTimeout(() => {
            ventanaImpresion.focus();
        }, 500);
    }
    
    /**
     * Muestra un mensaje en el contenedor de resultados
     * @param {string} mensaje Texto del mensaje
     * @param {string} tipo Tipo de mensaje (success, error, info)
     */
    mostrarMensaje(mensaje, tipo = 'info') {
        // Crear el elemento de mensaje
        const mensajeHTML = `
            <div class="mensaje mensaje-${tipo}">
                <p>${mensaje}</p>
            </div>
        `;
        
        // Si hay un mensaje previo, reemplazarlo
        const mensajeAnterior = this.resultadoContainer.querySelector('.mensaje');
        if (mensajeAnterior) {
            mensajeAnterior.outerHTML = mensajeHTML;
        } else {
            // Si no hay mensaje previo, agregar al inicio
            this.resultadoContainer.innerHTML = mensajeHTML + this.resultadoContainer.innerHTML;
        }
        
        // Auto ocultar después de unos segundos
        setTimeout(() => {
            const mensajeActual = this.resultadoContainer.querySelector('.mensaje');
            if (mensajeActual) {
                mensajeActual.style.opacity = '0';
                setTimeout(() => {
                    if (mensajeActual.parentNode) {
                        mensajeActual.parentNode.removeChild(mensajeActual);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    /**
     * Muestra un indicador de carga
     */
    mostrarCargando() {
        const cargandoHTML = `
            <div class="cargando-container">
                <div class="spinner"></div>
                <p>Cargando...</p>
            </div>
        `;
        
        // Colocar el indicador al inicio del contenedor de resultados
        this.resultadoContainer.innerHTML = cargandoHTML;
    }
}

// Inicializar el servicio de reportes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.reporteService = new ReporteService();
});