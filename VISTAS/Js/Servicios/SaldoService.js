// SaldoService.js - Servicio mejorado para manejar el saldo del usuario
// Verificar que no esté ya declarado
if (typeof window.SaldoService === 'undefined') {
    
    class SaldoService {
        constructor() {
            this.saldoElement = document.getElementById('user-balance');
            this.saldoActual = 0;
            this.inicializar();
        }

        inicializar() {
            // Cargar el saldo al iniciar la página
            this.actualizarSaldoDesdeServidor();
            
            // Configurar actualización periódica del saldo (cada 30 segundos)
            setInterval(() => this.actualizarSaldoDesdeServidor(), 30000);
        }

        /**
         * Actualiza el saldo obteniendo los datos del servidor
         */
        actualizarSaldoDesdeServidor() {
            // Realizar petición al servidor para obtener el saldo actual
            fetch('http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/Usuario/Obtener_saldo.php', {
                method: 'GET',
                credentials: 'include' // Incluir cookies de sesión
            })
            .then(response => {
                console.log('Respuesta del servidor saldo:', response.status, response.statusText);
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                // Obtener el texto de la respuesta primero para debugging
                return response.text();
            })
            .then(text => {
                console.log('Respuesta texto del servidor:', text.substring(0, 200));
                
                // Intentar parsear como JSON
                try {
                    const data = JSON.parse(text);
                    
                    if (data.error) {
                        console.error('Error del servidor al obtener saldo:', data.error);
                        this.obtenerSaldoRespaldo();
                    } else {
                        // Actualizar el saldo en la interfaz y guardarlo
                        this.actualizarSaldo(data.saldo);
                        console.log('Saldo actualizado desde servidor:', data.saldo);
                    }
                } catch (parseError) {
                    console.error('Error al parsear JSON:', parseError);
                    console.log('Respuesta no válida del servidor, usando saldo de respaldo');
                    this.obtenerSaldoRespaldo();
                }
            })
            .catch(error => {
                console.error('Error al obtener saldo del servidor:', error);
                // En caso de error de conexión, usar saldo de respaldo
                this.obtenerSaldoRespaldo();
            });
        }

        /**
         * Obtiene el saldo de respaldo desde sessionStorage o DOM
         */
        obtenerSaldoRespaldo() {
            let saldoRespaldo = 0;
            
            // Primero intentar obtener de sessionStorage
            if (window.sessionStorage) {
                try {
                    const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
                    if (usuario && usuario.saldo !== undefined) {
                        saldoRespaldo = parseFloat(usuario.saldo);
                    }
                } catch (error) {
                    console.error('Error al leer sessionStorage:', error);
                }
            }
            
            // Si no hay saldo en sessionStorage, intentar obtener del DOM
            if (saldoRespaldo === 0 && this.saldoElement) {
                const saldoTexto = this.saldoElement.textContent || '$ 0';
                saldoRespaldo = parseFloat(saldoTexto.replace(/[$,\s]/g, '').trim()) || 0;
            }
            
            this.actualizarSaldo(saldoRespaldo);
            console.log('Usando saldo de respaldo:', saldoRespaldo);
        }

        /**
         * Actualiza el saldo en la interfaz y lo guarda en sessionStorage
         * @param {number} nuevoSaldo - El nuevo saldo a mostrar
         */
        actualizarSaldo(nuevoSaldo) {
            this.saldoActual = parseFloat(nuevoSaldo) || 0;
            
            // Mostrar el saldo en la interfaz
            this.mostrarSaldo(this.saldoActual);
            
            // Guardar en sessionStorage para uso posterior
            this.guardarSaldoEnSession(this.saldoActual);
        }

        /**
         * Muestra el saldo formateado en la interfaz
         * @param {number} saldo - Saldo a mostrar
         */
        mostrarSaldo(saldo) {
            if (!this.saldoElement) return;
            
            // Formatear el saldo como moneda colombiana
            const saldoFormateado = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(saldo);
            
            // Actualizar el elemento en la interfaz
            this.saldoElement.textContent = saldoFormateado;
        }

        /**
         * Guarda el saldo en sessionStorage para uso posterior
         * @param {number} saldo - Saldo a guardar
         */
        guardarSaldoEnSession(saldo) {
            if (window.sessionStorage) {
                try {
                    const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
                    usuario.saldo = saldo;
                    sessionStorage.setItem('usuario', JSON.stringify(usuario));
                } catch (error) {
                    console.error('Error al guardar saldo en sessionStorage:', error);
                }
            }
        }

        /**
         * Obtiene el saldo actual (útil para otros servicios)
         * @returns {number} Saldo actual
         */
        obtenerSaldoActual() {
            return this.saldoActual;
        }

        /**
         * Fuerza una actualización inmediata del saldo desde el servidor
         * Útil después de transacciones o cuando se necesita el saldo más reciente
         */
        forzarActualizacion() {
            return new Promise((resolve, reject) => {
                fetch('http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/Usuario/Obtener_saldo.php', {
                    method: 'GET',
                    credentials: 'include'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    return response.text();
                })
                .then(text => {
                    console.log('Respuesta forzar actualización:', text.substring(0, 100));
                    
                    try {
                        const data = JSON.parse(text);
                        
                        if (data.error) {
                            reject(new Error(data.error));
                        } else {
                            this.actualizarSaldo(data.saldo);
                            console.log('Saldo forzado actualizado:', this.saldoActual);
                            resolve(this.saldoActual);
                        }
                    } catch (parseError) {
                        console.error('Error al parsear JSON en forzar actualización:', parseError);
                        // Usar saldo de respaldo
                        this.obtenerSaldoRespaldo();
                        resolve(this.saldoActual);
                    }
                })
                .catch(error => {
                    console.error('Error al forzar actualización de saldo:', error);
                    // Usar saldo de respaldo en caso de error
                    this.obtenerSaldoRespaldo();
                    resolve(this.saldoActual);
                });
            });
        }

        /**
         * Actualiza el saldo después de una transacción local
         * @param {number} monto - Monto de la transacción
         * @param {boolean} esRecarga - true para recarga, false para retiro
         */
        actualizarSaldoLocal(monto, esRecarga) {
            const nuevoSaldo = esRecarga ? 
                this.saldoActual + parseFloat(monto) : 
                this.saldoActual - parseFloat(monto);
            
            this.actualizarSaldo(nuevoSaldo);
            
            // Programar una actualización desde el servidor en unos segundos para confirmar
            setTimeout(() => this.actualizarSaldoDesdeServidor(), 2000);
        }
    }

    // Marcar como declarado
    window.SaldoService = SaldoService;

    // Inicializar el servicio cuando el DOM esté cargado
    document.addEventListener('DOMContentLoaded', () => {
        // Solo crear si no existe ya
        if (!window.saldoService) {
            window.saldoService = new SaldoService();
            console.log('SaldoService inicializado correctamente');
        }
    });

} else {
    console.log('SaldoService ya está declarado, saltando inicialización');
}