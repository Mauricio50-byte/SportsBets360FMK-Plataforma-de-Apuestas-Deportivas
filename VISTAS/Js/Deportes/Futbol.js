/**
 * Clase para gestionar los enfrentamientos de fútbol y apuestas
 * @class
 */
class EnfrentamientosFutbol {
    /**
     * Constructor de la clase
     */
    constructor() {
        this.equipos = [
            { id: "RM01", nombre: "Real Madrid", pais: "España", ciudad: "Madrid", liga: "La Liga" },
            { id: "FCB01", nombre: "FC Barcelona", pais: "España", ciudad: "Barcelona", liga: "La Liga" },
            { id: "MU01", nombre: "Manchester United", pais: "Inglaterra", ciudad: "Manchester", liga: "Premier League" },
            { id: "LIV01", nombre: "Liverpool FC", pais: "Inglaterra", ciudad: "Liverpool", liga: "Premier League" },
            { id: "BAY01", nombre: "Bayern Munich", pais: "Alemania", ciudad: "Munich", liga: "Bundesliga" },
            { id: "MIL01", nombre: "AC Milan", pais: "Italia", ciudad: "Milan", liga: "Serie A" },
            { id: "PSG01", nombre: "Paris Saint-Germain", pais: "Francia", ciudad: "Paris", liga: "Ligue 1" },
            { id: "JUV01", nombre: "Juventus", pais: "Italia", ciudad: "Turin", liga: "Serie A" },
            { id: "CHE01", nombre: "Chelsea FC", pais: "Inglaterra", ciudad: "Londres", liga: "Premier League" },
            { id: "ARS01", nombre: "Arsenal FC", pais: "Inglaterra", ciudad: "Londres", liga: "Premier League" },
            { id: "BVB01", nombre: "Borussia Dortmund", pais: "Alemania", ciudad: "Dortmund", liga: "Bundesliga" },
            { id: "MC01", nombre: "Manchester City", pais: "Inglaterra", ciudad: "Manchester", liga: "Premier League" },
            { id: "ATM01", nombre: "Atletico Madrid", pais: "España", ciudad: "Madrid", liga: "La Liga" },
            { id: "INT01", nombre: "Inter Milan", pais: "Italia", ciudad: "Milan", liga: "Serie A" },
            { id: "TOT01", nombre: "Tottenham Hotspur", pais: "Inglaterra", ciudad: "Londres", liga: "Premier League" },
            { id: "BET01", nombre: "Real Betis", pais: "España", ciudad: "Sevilla", liga: "La Liga" },
            { id: "VAL01", nombre: "Valencia CF", pais: "España", ciudad: "Valencia", liga: "La Liga" },
            { id: "SEV01", nombre: "Sevilla FC", pais: "España", ciudad: "Sevilla", liga: "La Liga" },
            { id: "NAP01", nombre: "Napoli", pais: "Italia", ciudad: "Nápoles", liga: "Serie A" },
            { id: "ROM01", nombre: "AS Roma", pais: "Italia", ciudad: "Roma", liga: "Serie A" }
        ];
        
            // Clave para almacenamiento local 
            this.STORAGE_KEY = 'enfrentamientos-futbol';
            this.usuarioId = null; // Inicializar como null
            
            // Inicializar enfrentamientos como array vacío para evitar errores
            this.enfrentamientos = [];
            
            // Inicializar saldo y enfrentamientos
            this.saldoUsuario = 0; // Valor inicial hasta que se cargue

            // Inicializar contador de aciertos por defecto para evitar undefined
            this.contadorAciertos = { 
                total: 0, 
                aciertos: 0, 
                montoApostado: 0,
                montoGanado: 0
            };
            
            // Obtener saldo de sesión y luego inicializar lo demás
            this.obtenerSaldoUsuario().then(() => {
                // MODIFICADO: Ahora las claves incluyen el ID del usuario
                this.PREDICCIONES_KEY = `predicciones-futbol-${this.usuarioId || 'guest'}`;
                this.APUESTAS_KEY = `apuestas-futbol-${this.usuarioId || 'guest'}`;
                this.CONTADOR_KEY = `contador-aciertos-${this.usuarioId || 'guest'}`;
                
                // Inicializar enfrentamientos
                this.enfrentamientos = this.obtenerEnfrentamientosDia();
                
                // Inicializar predicciones
                this.predicciones = this.obtenerPredicciones();
                
                // Inicializar apuestas
                this.apuestas = this.obtenerApuestas();
                
                // Actualizar contador de aciertos
                this.contadorAciertos = this.obtenerContadorAciertos();
                
                // Iniciar intervalo para actualización automática
                this.iniciarActualizacionAutomatica();
            });
        }
    
    // Method to check if user is authenticated
    async verificarSesion() {
        try {
            const response = await fetch('http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/Usuario/check_session.php', {
                credentials: 'include'
            });
            
            if (!response.ok) {
                console.log("Error de conexión al verificar sesión");
                return false;
            }
            
            const textoRespuesta = await response.text();
            
            if (!textoRespuesta.trim()) {
                console.log("Respuesta vacía del servidor");
                return false;
            }
            
            let data;
            try {
                data = JSON.parse(textoRespuesta);
            } catch (jsonError) {
                console.log("Respuesta de sesión no es JSON válido:", textoRespuesta);
                return false;
            }
            
            if (data.loggedIn) {
                this.usuarioId = data.id;
                this.usuarioNombre = data.nombre;
                this.saldoUsuario = parseFloat(data.saldo || 0);
                
                // NUEVO: Actualizar sessionStorage
                sessionStorage.setItem('usuarioSaldo', this.saldoUsuario.toString());
                sessionStorage.setItem('usuarioId', this.usuarioId.toString());
                
                return true;
            } else {
                console.log("Usuario no autenticado");
                this.usuarioId = 'guest'; // Asignar guest para usuarios no autenticados
                return false;
            }
        } catch (error) {
            console.error("Error al verificar sesión:", error);
            this.usuarioId = 'guest'; // Asignar guest en caso de error
            return false;
        }
    }
    
    /**
     * Función para actualizar el saldo del usuario localmente (en la interfaz)
     * @param {number} nuevoSaldo - Nuevo saldo a mostrar
     */
    actualizarSaldoUsuarioLocal(nuevoSaldo) {
        // Actualizar la propiedad en la clase
        this.saldoUsuario = parseFloat(nuevoSaldo);
        
        // MODIFICADO: Actualizar tanto localStorage como sessionStorage
        const claveUsuario = this.usuarioId && this.usuarioId !== 'guest' ? `usuario-${this.usuarioId}` : 'usuario';
        localStorage.setItem(claveUsuario, this.saldoUsuario.toString());
        sessionStorage.setItem('user-balance', this.saldoUsuario.toString());
        
        // Actualizar elementos de la interfaz
        const elementosSaldo = document.querySelectorAll('.usuario');
        if (elementosSaldo.length > 0) {
            elementosSaldo.forEach(elemento => {
                elemento.textContent = `$${this.saldoUsuario.toFixed(2)}`;
            });
        } else {
            const saldoElement = document.getElementById('usuario');
            if (saldoElement) {
                saldoElement.textContent = `$${this.saldoUsuario.toFixed(2)}`;
            }
        }
        
        // Opcional: Disparar un evento personalizado para notificar cambios en el saldo
        document.dispatchEvent(new CustomEvent('saldoActualizado', { 
            detail: { saldo: this.saldoUsuario } 
        }));
        
        console.log(`Saldo actualizado localmente: $${this.saldoUsuario.toFixed(2)}`);

        // Notificar al menú principal sobre el cambio de saldo
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'saldoActualizado',
                saldo: this.saldoUsuario
            }, '*');
        } else {
            window.dispatchEvent(new CustomEvent('saldoGlobalActualizado', {
                detail: { saldo: this.saldoUsuario }
            }));
        }
    }

    /**
     * Modifica la función actualizarSaldoUsuarioBD para manejar mejor la autenticación
     * @param {number} monto - Monto a agregar (positivo) o restar (negativo)
     * @param {string} tipo - Tipo de transacción ('apuesta' o 'ganancia')
     * @param {string} partidoId - ID del partido asociado a la transacción
     * @returns {Promise<boolean>} - true si fue exitoso, false en caso contrario
     */
    async actualizarSaldoUsuarioBD(monto, tipo, partidoId) {
        try {
            // Primero verificar si el usuario está autenticado
            const sesionResult = await this.verificarSesion();
            
            if (!sesionResult) {
                console.log('Usuario no autenticado, utilizando modo offline');
                // Si no está autenticado, actualizar solo localmente
                this.actualizarSaldoUsuarioLocal(this.saldoUsuario + parseFloat(monto));
                return true;
            }
            
            // Si está autenticado, seguir con la actualización en la BD
            const url = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/Usuario/actualizar_saldo.php';
            
            const datos = new FormData();
            datos.append('monto', monto.toString());
            datos.append('tipo', tipo);
            datos.append('referencia', `partido-${partidoId}`);
            
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos,
                credentials: 'include' // Incluir cookies de sesión
            });
            
            if (!respuesta.ok) {
                throw new Error(`HTTP error! status: ${respuesta.status}`);
            }
            
            // Obtener el texto de la respuesta primero
            const textoRespuesta = await respuesta.text();
            
            // Verificar si la respuesta está vacía
            if (!textoRespuesta.trim()) {
                throw new Error('Respuesta vacía del servidor');
            }
            
            let resultado;
            try {
                resultado = JSON.parse(textoRespuesta);
            } catch (jsonError) {
                console.error('Error al parsear JSON:', jsonError);
                console.error('Respuesta del servidor:', textoRespuesta);
                throw new Error('Respuesta del servidor no es JSON válido');
            }
            
            if (resultado.exito) {
                // Actualizar el saldo localmente con el valor de la BD
                this.actualizarSaldoUsuarioLocal(resultado.saldo);
                return true;
            } else {
                console.error('Error al actualizar saldo:', resultado.mensaje);
                // Actualizar localmente como fallback
                this.actualizarSaldoUsuarioLocal(this.saldoUsuario + parseFloat(monto));
                return true;
            }
        } catch (error) {
            console.error('Error de conexión al actualizar saldo:', error);
            // Continuar con una actualización local como fallback
            this.actualizarSaldoUsuarioLocal(this.saldoUsuario + parseFloat(monto));
            return true;
        }
    }


    /**
     * Modifica la función obtenerSaldoUsuario para manejar mejor la autenticación
     * @returns {Promise<number>} - Saldo del usuario
     */
    obtenerSaldoUsuario() {
        return new Promise((resolve, reject) => {
            fetch('http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/Usuario/check_session.php', {
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.text();
            })
            .then(textoRespuesta => {
                if (!textoRespuesta.trim()) {
                    throw new Error('Respuesta vacía del servidor');
                }
                
                const data = JSON.parse(textoRespuesta);
                
                if (data.loggedIn) {
                    this.usuarioId = data.id;
                    this.saldoUsuario = parseFloat(data.saldo || 0);
                    
                    // MODIFICADO: Guardar en ambos storages con clave específica del usuario
                    const claveUsuario = `usuario-${this.usuarioId}`;
                    localStorage.setItem(claveUsuario, this.saldoUsuario.toString());
                    sessionStorage.setItem('usuarioSaldo', this.saldoUsuario.toString());
                    sessionStorage.setItem('usuarioId', this.usuarioId.toString());
                    
                    resolve(this.saldoUsuario);
                } else {
                    console.log('Usuario no autenticado, usando modo offline');
                    this.usuarioId = 'guest';
                    
                    // MODIFICADO: Usar clave específica para usuario guest
                    const saldoGuardado = localStorage.getItem('usuario-guest');
                    this.saldoUsuario = saldoGuardado ? parseFloat(saldoGuardado) : 1000;
                    localStorage.setItem('usuario-guest', this.saldoUsuario.toString());
                    sessionStorage.setItem('usuarioSaldo', this.saldoUsuario.toString());
                    
                    resolve(this.saldoUsuario);
                }
            })
            .catch(error => {
                console.error('Error al obtener saldo de sesión:', error);
                this.usuarioId = 'guest';
                
                // MODIFICADO: Fallback con clave específica
                const saldoGuardado = localStorage.getItem('usuario-guest');
                this.saldoUsuario = saldoGuardado ? parseFloat(saldoGuardado) : 1000;
                localStorage.setItem('usuario-guest', this.saldoUsuario.toString());
                sessionStorage.setItem('usuarioSaldo', this.saldoUsuario.toString());
                
                resolve(this.saldoUsuario);
            });
        });
    }

    /**
     * Obtiene los enfrentamientos almacenados o genera nuevos
     * @returns {Array} - Enfrentamientos del día
     */
    obtenerEnfrentamientosDia() {
        const hoy = this.obtenerFechaActual();
        const enfrentamientosGuardados = localStorage.getItem(this.STORAGE_KEY);
        
        if (enfrentamientosGuardados) {
            const datos = JSON.parse(enfrentamientosGuardados);
            
            if (datos.fecha === hoy) {
                return datos.enfrentamientos;
            }
        }
        
        const nuevosEnfrentamientos = this.generarEnfrentamientosAleatorios();
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
            fecha: hoy,
            enfrentamientos: nuevosEnfrentamientos
        }));
        
        // MODIFICADO: Reiniciar con claves específicas del usuario
        if (this.PREDICCIONES_KEY) localStorage.removeItem(this.PREDICCIONES_KEY);
        if (this.APUESTAS_KEY) localStorage.removeItem(this.APUESTAS_KEY);
        if (this.CONTADOR_KEY) localStorage.removeItem(this.CONTADOR_KEY);
        
        this.predicciones = {};
        this.apuestas = {};
        
        this.contadorAciertos = { total: 0, aciertos: 0, montoApostado: 0, montoGanado: 0 };
        
        return nuevosEnfrentamientos;
    }
    
    
    /**
     * Obtiene la fecha actual en formato YYYY-MM-DD
     * @returns {string} - Fecha actual
     */
    obtenerFechaActual() {
        const fecha = new Date();
        return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
    }
    
    /**
     * Genera 10 enfrentamientos aleatorios con horarios
     * @returns {Array} - Enfrentamientos generados
     */
    generarEnfrentamientosAleatorios() {
        // Crear copia de equipos y mezclarlos
        const equiposMezclados = [...this.equipos];
        this.mezclarArray(equiposMezclados);
        
        const enfrentamientos = [];
        
        // Generar 10 enfrentamientos
        for (let i = 0; i < 10; i++) {
            // Tomar dos equipos distintos por enfrentamiento
            const equipoLocal = equiposMezclados[i * 2];
            const equipoVisitante = equiposMezclados[i * 2 + 1];
            
            // Generar horario aleatorio entre 7:00 y 21:00
            const hora = Math.floor(Math.random() * 13) + 7 // 7 a 21
            const minuto = Math.random() < 0.5 ? 0 : 30; // 00 o 30
            
            // Generar cuotas para cada resultado posible
            const cuotaLocal = parseFloat((Math.random() * 2 + 1.2).toFixed(2)); // Entre 1.2 y 3.2
            const cuotaEmpate = parseFloat((Math.random() * 2 + 2).toFixed(2)); // Entre 2 y 4
            const cuotaVisitante = parseFloat((Math.random() * 2 + 1.5).toFixed(2)); // Entre 1.5 y 3.5
            
            enfrentamientos.push({
                id: `partido-${i + 1}`,
                equipoLocal: equipoLocal,
                equipoVisitante: equipoVisitante,
                hora: String(hora).padStart(2, '0'),
                minuto: String(minuto).padStart(2, '0'),
                resultado: {
                    golesLocal: null,
                    golesVisitante: null
                },
                resultadoPredicho: false,
                cuotas: {
                    local: cuotaLocal,
                    empate: cuotaEmpate,
                    visitante: cuotaVisitante
                }
            });
        }
        
        // Ordenar enfrentamientos por hora
        return enfrentamientos.sort((a, b) => {
            return parseInt(a.hora + a.minuto) - parseInt(b.hora + b.minuto);
        });
    }
    
    /**
     * Mezcla aleatoriamente un array (algoritmo Fisher-Yates)
     * @param {Array} array - Array a mezclar
     */
    mezclarArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    /**
     * Determina el estado actual de un enfrentamiento
     * @param {Object} enfrentamiento - Datos del enfrentamiento
     * @returns {Object} - Estado y clase CSS
     */
    determinarEstadoEnfrentamiento(enfrentamiento) {
        const ahora = new Date();
        const horaActual = ahora.getHours();
        const minutoActual = ahora.getMinutes();
        
        const horaPartido = parseInt(enfrentamiento.hora);
        const minutoPartido = parseInt(enfrentamiento.minuto);
        
        // Duración de 90 minutos (1h30m)
        const finPartidoHora = horaPartido + 1;
        const finPartidoMinuto = minutoPartido + 30;
        
        // Ajustar minutos excedentes
        let horaFinAjustada = finPartidoHora;
        let minutoFinAjustado = finPartidoMinuto;
        
        if (minutoFinAjustado >= 60) {
            horaFinAjustada++;
            minutoFinAjustado -= 60;
        }
        
        // Verificar si el partido ya terminó
        if (
            horaActual > horaFinAjustada || 
            (horaActual === horaFinAjustada && minutoActual > minutoFinAjustado)
        ) {
            // Si terminó, generar resultado aleatorio si no existe
            if (enfrentamiento.resultado.golesLocal === null) {
                enfrentamiento.resultado.golesLocal = Math.floor(Math.random() * 5);
                enfrentamiento.resultado.golesVisitante = Math.floor(Math.random() * 5);
                
                // Guardar resultado en localStorage
                this.actualizarEnfrentamientoEnStorage(enfrentamiento);
                
                // Verificar si se hizo predicción y actualizar contador
                this.verificarPrediccion(enfrentamiento);
            }
            
            return {
                texto: "Finalizado",
                clase: "finalizado"
            };
        }
        
        // Verificar si el partido está en curso
        if (
            (horaActual > horaPartido || 
            (horaActual === horaPartido && minutoActual >= minutoPartido)) &&
            (horaActual < horaFinAjustada || 
            (horaActual === horaFinAjustada && minutoActual <= minutoFinAjustado))
        ) {
            return {
                texto: "En vivo",
                clase: "en-vivo"
            };
        }
        
        // Si no ha comenzado
        return {
            texto: "No ha comenzado",
            clase: "no-comenzado"
        };
    }
    
    /**
     * Actualiza un enfrentamiento en el almacenamiento local
     * @param {Object} enfrentamiento - Enfrentamiento a actualizar
     */
    actualizarEnfrentamientoEnStorage(enfrentamiento) {
        const datosGuardados = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
        
        if (datosGuardados.enfrentamientos) {
            // Buscar y actualizar el enfrentamiento específico
            datosGuardados.enfrentamientos = datosGuardados.enfrentamientos.map(e => {
                if (e.id === enfrentamiento.id) {
                    return {...e, resultado: enfrentamiento.resultado};
                }
                return e;
            });
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(datosGuardados));
        }
    }
    
    /**
     * Obtiene las predicciones guardadas
     * @returns {Object} - Predicciones guardadas
     */
    obtenerPredicciones() {
        const prediccionesGuardadas = localStorage.getItem(this.PREDICCIONES_KEY);
        return prediccionesGuardadas ? JSON.parse(prediccionesGuardadas) : {};
    }
    
    /**
     * Obtiene las apuestas guardadas
     * @returns {Object} - Apuestas guardadas
     */
    obtenerApuestas() {
        const apuestasGuardadas = localStorage.getItem(this.APUESTAS_KEY);
        return apuestasGuardadas ? JSON.parse(apuestasGuardadas) : {};
    }
    
    /**
     * Obtiene el contador de aciertos
     * @returns {Object} - Contador de aciertos
     */
    obtenerContadorAciertos() {
        const contadorGuardado = localStorage.getItem(this.CONTADOR_KEY);
        const contadorDefault = { 
            total: 0, 
            aciertos: 0, 
            montoApostado: 0,
            montoGanado: 0
        };
        
        if (contadorGuardado) {
            const contador = JSON.parse(contadorGuardado);
            return {...contadorDefault, ...contador};
        }
        
        return contadorDefault;
    }
    
    
    async guardarPrediccion(partidoId, prediccion, montoApuesta) {
        montoApuesta = parseFloat(montoApuesta);
        
        if (isNaN(montoApuesta) || montoApuesta <= 0) {
            alert('Por favor ingrese un monto válido para apostar');
            return;
        }
        
        if (montoApuesta > this.saldoUsuario) {
            alert('Saldo insuficiente para realizar esta apuesta');
            return;
        }
        
        const enfrentamiento = this.enfrentamientos.find(e => e.id === partidoId);
        if (!enfrentamiento) {
            console.error('No se encontró el enfrentamiento');
            return;
        }
        
        const cuota = enfrentamiento.cuotas[prediccion];
        const posibleGanancia = montoApuesta * cuota;
        
        const resultado = await this.actualizarSaldoUsuarioBD(-montoApuesta, 'apuesta', partidoId);
        
        if (!resultado) {
            alert('Error al actualizar el saldo en la base de datos. La apuesta se procesará en modo offline.');
        }
        
        // MODIFICADO: Usar claves específicas del usuario
        this.predicciones[partidoId] = prediccion;
        localStorage.setItem(this.PREDICCIONES_KEY, JSON.stringify(this.predicciones));
        
        this.apuestas[partidoId] = {
            monto: montoApuesta,
            cuota: cuota,
            posibleGanancia: posibleGanancia
        };
        localStorage.setItem(this.APUESTAS_KEY, JSON.stringify(this.apuestas));
        
        // NUEVO: Actualizar sessionStorage también
        sessionStorage.setItem('usuarioSaldo', this.saldoUsuario.toString());
        
        this.contadorAciertos.montoApostado += montoApuesta;
        localStorage.setItem(this.CONTADOR_KEY, JSON.stringify(this.contadorAciertos));
        
        this.enfrentamientos = this.enfrentamientos.map(e => {
            if (e.id === partidoId) {
                return {...e, resultadoPredicho: true};
            }
            return e;
        });
        
        const datosGuardados = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
        if (datosGuardados.enfrentamientos) {
            datosGuardados.enfrentamientos = this.enfrentamientos;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(datosGuardados));
        }
        
        this.renderizarEnfrentamientos();
    }


    
    /**
     * Verifica si la predicción fue correcta y actualiza el contador y saldo
     * @param {Object} enfrentamiento - Enfrentamiento finalizado
     */
    async verificarPrediccion(enfrentamiento) {
        const prediccion = this.predicciones[enfrentamiento.id];
        
        if (!prediccion) return;
        
        const apuesta = this.apuestas[enfrentamiento.id];
        if (!apuesta) return;
        
        const golesLocal = enfrentamiento.resultado.golesLocal;
        const golesVisitante = enfrentamiento.resultado.golesVisitante;
        let resultadoReal;
        
        if (golesLocal > golesVisitante) {
            resultadoReal = 'local';
        } else if (golesLocal < golesVisitante) {
            resultadoReal = 'visitante';
        } else {
            resultadoReal = 'empate';
        }
        
        const acierto = prediccion === resultadoReal;
        
        this.contadorAciertos.total++;
        
        if (acierto) {
            this.contadorAciertos.aciertos++;
            
            const ganancia = apuesta.posibleGanancia;
            
            try {
                await this.actualizarSaldoUsuarioBD(ganancia, 'ganancia', enfrentamiento.id);
            } catch (error) {
                console.error('Error al acreditar ganancia:', error);
                this.saldoUsuario += ganancia;
                const claveUsuario = this.usuarioId && this.usuarioId !== 'guest' ? `usuario-${this.usuarioId}` : 'usuario-guest';
                localStorage.setItem(claveUsuario, this.saldoUsuario.toString());
                // NUEVO: Actualizar sessionStorage
                sessionStorage.setItem('usuarioSaldo', this.saldoUsuario.toString());
            }
            
            this.contadorAciertos.montoGanado += ganancia;
        }
        
        // MODIFICADO: Usar clave específica del usuario
        localStorage.setItem(this.CONTADOR_KEY, JSON.stringify(this.contadorAciertos));
    }
    
    /**
     * Renderiza los enfrentamientos en el contenedor
     */
        renderizarEnfrentamientos() {
        const container = document.getElementById('enfrentamientos-container');
        const fechaElement = document.getElementById('fecha-actual');
        
        if (!container || !fechaElement) return;
        
        // Mostrar fecha actual formateada
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = new Date().toLocaleDateString('es-ES', opciones);
        fechaElement.textContent = fechaFormateada;
        
        // Limpiar contenedor
        container.innerHTML = '';

        // Verificar que this.enfrentamientos esté definido antes de usar forEach
        if (!this.enfrentamientos || !Array.isArray(this.enfrentamientos)) {
            console.error('Enfrentamientos no disponibles o no es un array válido');
            container.innerHTML = '<div class="error-mensaje">No se pudieron cargar los enfrentamientos. Por favor, recargue la página.</div>';
            return;
        }

        if (!this.contadorAciertos) {
        this.contadorAciertos = this.obtenerContadorAciertos();
        }
        
        // Mostrar resumen de predicciones
        this.mostrarResumenPredicciones();
    
        
        // Añadir cada enfrentamiento
        this.enfrentamientos.forEach(enfrentamiento => {
            const estado = this.determinarEstadoEnfrentamiento(enfrentamiento);
            
            const enfrentamientoHTML = document.createElement('div');
            enfrentamientoHTML.className = 'enfrentamiento';
            enfrentamientoHTML.dataset.id = enfrentamiento.id;
            
            // Contenido básico del enfrentamiento
            let contenidoHTML = `
                <div class="horario">${enfrentamiento.hora}:${enfrentamiento.minuto}</div>
                <div class="equipos">
                    <div class="equipo">
                        <div class="equipo-nombre">${enfrentamiento.equipoLocal.nombre}</div>
                        <div class="equipo-pais">${enfrentamiento.equipoLocal.pais}</div>
                    </div>
                    <div class="versus">VS</div>
                    <div class="equipo">
                        <div class="equipo-nombre">${enfrentamiento.equipoVisitante.nombre}</div>
                        <div class="equipo-pais">${enfrentamiento.equipoVisitante.pais}</div>
                    </div>
                </div>
                <div class="estado ${estado.clase}">
                    ${estado.texto}
                    ${estado.clase === 'finalizado' ? 
                        `<div class="resultado">${enfrentamiento.resultado.golesLocal} - ${enfrentamiento.resultado.golesVisitante}</div>` : 
                        ''}
                </div>
            `;
            
            // Si el partido no ha comenzado y no se ha predicho, añadir formulario de apuesta
            if (estado.clase === 'no-comenzado' && !enfrentamiento.resultadoPredicho) {
                contenidoHTML += `
                    <div class="cuotas-container">
                        <div class="cuota-item">
                            <span class="cuota-texto">Local</span>
                            <span class="cuota-valor">${enfrentamiento.cuotas.local}</span>
                        </div>
                        <div class="cuota-item">
                            <span class="cuota-texto">Empate</span>
                            <span class="cuota-valor">${enfrentamiento.cuotas.empate}</span>
                        </div>
                        <div class="cuota-item">
                            <span class="cuota-texto">Visitante</span>
                            <span class="cuota-valor">${enfrentamiento.cuotas.visitante}</span>
                        </div>
                    </div>
                    <div class="apuesta-form">
                        <div class="form-group">
                            <label for="monto-${enfrentamiento.id}">Monto a apostar:</label>
                            <input type="number" id="monto-${enfrentamiento.id}" min="1" step="1" placeholder="$" class="monto-apuesta">
                        </div>
                        <div class="prediccion-botones">
                            <button class="btn-prediccion btn-pierde" data-prediccion="visitante" data-partido="${enfrentamiento.id}">Visitante</button>
                            <button class="btn-prediccion btn-empate" data-prediccion="empate" data-partido="${enfrentamiento.id}">Empate</button>
                            <button class="btn-prediccion btn-gana" data-prediccion="local" data-partido="${enfrentamiento.id}">Local</button>
                        </div>
                    </div>
                `;
            }
            
            // Si se ha hecho una predicción para este partido, mostrarla
            const prediccion = this.predicciones[enfrentamiento.id];
            const apuesta = this.apuestas[enfrentamiento.id];
            
            if (prediccion && apuesta) {
                let textoPred = '';
                switch (prediccion) {
                    case 'local': textoPred = 'Gana Local'; break;
                    case 'visitante': textoPred = 'Gana Visitante'; break;
                    case 'empate': textoPred = 'Empate'; break;
                }
                
                contenidoHTML += `
                    <div class="apuesta-info">
                        <div class="prediccion-hecha">Tu predicción: ${textoPred}</div>
                        <div class="monto-apostado">Monto apostado: $${apuesta.monto.toFixed(2)}</div>
                        <div class="posible-ganancia">Posible ganancia: $${apuesta.posibleGanancia.toFixed(2)}</div>
                    </div>
                `;
                
                // Si el partido ha finalizado, verificar si acertó
                if (estado.clase === 'finalizado') {
                    const golesLocal = enfrentamiento.resultado.golesLocal;
                    const golesVisitante = enfrentamiento.resultado.golesVisitante;
                    let resultadoReal;
                    
                    if (golesLocal > golesVisitante) {
                        resultadoReal = 'local';
                    } else if (golesLocal < golesVisitante) {
                        resultadoReal = 'visitante';
                    } else {
                        resultadoReal = 'empate';
                    }
                    
                    const acertado = prediccion === resultadoReal;
                    
                    contenidoHTML += `
                        <div class="prediccion-resultado ${acertado ? 'prediccion-correcta' : 'prediccion-incorrecta'}">
                            ${acertado ? 
                                `¡Acertaste! Ganaste $${apuesta.posibleGanancia.toFixed(2)}` : 
                                `No acertaste. Perdiste $${apuesta.monto.toFixed(2)}`}
                        </div>
                    `;
                }
            }
            
            enfrentamientoHTML.innerHTML = contenidoHTML;
            container.appendChild(enfrentamientoHTML);
        });
        
        // Agregar evento a los botones de predicción
        const botonesPrediccion = document.querySelectorAll('.btn-prediccion');
        botonesPrediccion.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const prediccion = e.target.dataset.prediccion;
                const partidoId = e.target.dataset.partido;
                // Obtener el monto apostado del input correspondiente
                const inputMonto = document.getElementById(`monto-${partidoId}`);
                const montoApuesta = inputMonto ? inputMonto.value : '';
                
                // Guardar predicción y apuesta
                this.guardarPrediccion(partidoId, prediccion, montoApuesta);
            });
        });
        
        // Mostrar resumen de predicciones
        this.mostrarResumenPredicciones();
    }
    
    /**
     * Muestra el resumen de predicciones acertadas
     */
        mostrarResumenPredicciones() {
        // Comprobar que this.contadorAciertos existe
        if (!this.contadorAciertos) {
            this.contadorAciertos = this.obtenerContadorAciertos();
        }
        
        // Buscar si ya existe el resumen, si no, crearlo
        let resumenElement = document.querySelector('.resumen-predicciones');
        
        if (!resumenElement) {
            resumenElement = document.createElement('div');
            resumenElement.className = 'resumen-predicciones';
            const container = document.querySelector('.futbol-container');
            if (container) {
                container.appendChild(resumenElement);
            }
        }
        
        // Actualizar contenido del resumen
        const porcentaje = this.contadorAciertos.total > 0 
            ? Math.round((this.contadorAciertos.aciertos / this.contadorAciertos.total) * 100) 
            : 0;
            
        const retornoInversion = this.contadorAciertos.montoApostado > 0
            ? ((this.contadorAciertos.montoGanado / this.contadorAciertos.montoApostado) * 100).toFixed(2)
            : 0;
            
        resumenElement.innerHTML = `
            <h3>Resumen de Predicciones</h3>
            <div class="contador-predicciones">
                Has acertado <span>${this.contadorAciertos.aciertos}</span> de 
                <span>${this.contadorAciertos.total}</span> predicciones (${porcentaje}%)
            </div>
            <div class="resumen-financiero">
                <div>Monto total apostado: $${this.contadorAciertos.montoApostado.toFixed(2)}</div>
                <div>Monto total ganado: $${this.contadorAciertos.montoGanado.toFixed(2)}</div>
                <div>Retorno de inversión: ${retornoInversion}%</div>
            </div>
        `;
}
    
    /**
     * Inicia la actualización automática de enfrentamientos
     */
    iniciarActualizacionAutomatica() {
        // Actualizar cada minuto
        setInterval(() => {
            this.renderizarEnfrentamientos();
        }, 60000); // 60 segundos
        
        // Primera renderización inmediata
        this.renderizarEnfrentamientos();
    }
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const app = new EnfrentamientosFutbol();
});