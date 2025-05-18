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
        this.PREDICCIONES_KEY = 'predicciones-futbol';
        this.APUESTAS_KEY = 'apuestas-futbol';
        
        // Inicializar enfrentamientos
        this.enfrentamientos = this.obtenerEnfrentamientosDia();
        
        // Inicializar predicciones
        this.predicciones = this.obtenerPredicciones();
        
        // Inicializar apuestas
        this.apuestas = this.obtenerApuestas();
        
        // Contador de aciertos
        this.contadorAciertos = this.obtenerContadorAciertos();
        
        // Saldo del usuario
        this.saldoUsuario = this.obtenerSaldoUsuario();
        
        // Iniciar intervalo para actualización automática
        this.iniciarActualizacionAutomatica();
    }
    
    /**
     * Obtiene el saldo del usuario actual
     * @returns {number} - Saldo del usuario
     */
    obtenerSaldoUsuario() {
        // Primero intentamos obtener el saldo del elemento HTML
        const saldoElement = document.getElementById('saldo-usuario');
        if (saldoElement) {
            const saldo = parseFloat(saldoElement.textContent.replace(/[^\d.-]/g, ''));
            if (!isNaN(saldo)) {
                return saldo;
            }
        }
        
        // Si no es posible, usamos localStorage como respaldo
        const saldoGuardado = localStorage.getItem('saldo-usuario');
        return saldoGuardado ? parseFloat(saldoGuardado) : 0;
    }
    
    /**
     * Actualiza el saldo del usuario en la interfaz y en localStorage
     * @param {number} nuevoSaldo - Nuevo saldo del usuario
     */
    actualizarSaldoUsuarioLocal(nuevoSaldo) {
        // Actualizar la propiedad del objeto
        this.saldoUsuario = nuevoSaldo;
        
        // Actualizar en localStorage como respaldo
        localStorage.setItem('saldo-usuario', nuevoSaldo.toString());
        
        // Actualizar en la interfaz si existe el elemento
        const saldoElement = document.getElementById('saldo-usuario');
        if (saldoElement) {
            saldoElement.textContent = `$${nuevoSaldo.toFixed(2)}`;
        }
    }
    
    /**
     * Actualiza el saldo del usuario en la base de datos
     * @param {number} monto - Monto a agregar (positivo) o restar (negativo)
     * @param {string} tipo - Tipo de transacción ('apuesta' o 'ganancia')
     * @param {string} partidoId - ID del partido asociado a la transacción
     * @returns {Promise<boolean>} - true si fue exitoso, false en caso contrario
     */
    async actualizarSaldoUsuarioBD(monto, tipo, partidoId) {
        try {
            const url = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/CONTROLADORES/TransaccionController.php';
            const datos = new FormData();
            datos.append('accion', 'actualizarSaldo');
            datos.append('monto', monto);
            datos.append('tipo', tipo);
            datos.append('referencia', `partido-${partidoId}`);
            
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });
            
            const resultado = await respuesta.json();
            
            if (resultado.exito) {
                // Actualizar el saldo localmente
                this.actualizarSaldoUsuarioLocal(resultado.saldo);
                return true;
            } else {
                console.error('Error al actualizar saldo:', resultado.mensaje);
                return false;
            }
        } catch (error) {
            console.error('Error de conexión al actualizar saldo:', error);
            return false;
        }
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
            
            // Verificar si los enfrentamientos son del día actual
            if (datos.fecha === hoy) {
                return datos.enfrentamientos;
            }
        }
        
        // Si no hay enfrentamientos guardados o son de otro día, generar nuevos
        const nuevosEnfrentamientos = this.generarEnfrentamientosAleatorios();
        
        // Guardar en localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
            fecha: hoy,
            enfrentamientos: nuevosEnfrentamientos
        }));
        
        // Reiniciar predicciones y apuestas en nuevo día
        localStorage.removeItem(this.PREDICCIONES_KEY);
        localStorage.removeItem(this.APUESTAS_KEY);
        this.predicciones = {};
        this.apuestas = {};
        
        // Reiniciar contador de aciertos
        localStorage.setItem('contador-aciertos', JSON.stringify({
            total: 0,
            aciertos: 0,
            montoApostado: 0,
            montoGanado: 0
        }));
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
        const contadorGuardado = localStorage.getItem('contador-aciertos');
        const contadorDefault = { 
            total: 0, 
            aciertos: 0, 
            montoApostado: 0,
            montoGanado: 0
        };
        
        if (contadorGuardado) {
            const contador = JSON.parse(contadorGuardado);
            // Asegurar que tenga todas las propiedades
            return {...contadorDefault, ...contador};
        }
        
        return contadorDefault;
    }
    
    /**
     * Guarda una predicción con apuesta
     * @param {string} partidoId - ID del partido
     * @param {string} prediccion - Predicción (local, empate, visitante)
     * @param {number} montoApuesta - Monto apostado
     */
    async guardarPrediccion(partidoId, prediccion, montoApuesta) {
        // Convertir a número
        montoApuesta = parseFloat(montoApuesta);
        
        // Validar que sea un número válido y mayor que cero
        if (isNaN(montoApuesta) || montoApuesta <= 0) {
            alert('Por favor ingrese un monto válido para apostar');
            return;
        }
        
        // Validar que tenga saldo suficiente
        if (montoApuesta > this.saldoUsuario) {
            alert('Saldo insuficiente para realizar esta apuesta');
            return;
        }
        
        // Encontrar el enfrentamiento
        const enfrentamiento = this.enfrentamientos.find(e => e.id === partidoId);
        if (!enfrentamiento) {
            console.error('No se encontró el enfrentamiento');
            return;
        }
        
        // Calcular posible ganancia según la cuota
        const cuota = enfrentamiento.cuotas[prediccion];
        const posibleGanancia = montoApuesta * cuota;
        
        // Actualizar el saldo en la BD (restar la apuesta)
        const resultado = await this.actualizarSaldoUsuarioBD(-montoApuesta, 'apuesta', partidoId);
        if (!resultado) {
            alert('Error al procesar la apuesta. Inténtelo nuevamente.');
            return;
        }
        
        // Guardar la predicción
        this.predicciones[partidoId] = prediccion;
        localStorage.setItem(this.PREDICCIONES_KEY, JSON.stringify(this.predicciones));
        
        // Guardar la apuesta
        this.apuestas[partidoId] = {
            monto: montoApuesta,
            cuota: cuota,
            posibleGanancia: posibleGanancia
        };
        localStorage.setItem(this.APUESTAS_KEY, JSON.stringify(this.apuestas));
        
        // Actualizar contador de montos apostados
        this.contadorAciertos.montoApostado += montoApuesta;
        localStorage.setItem('contador-aciertos', JSON.stringify(this.contadorAciertos));
        
        // Marcar el partido como que ya se ha hecho predicción
        this.enfrentamientos = this.enfrentamientos.map(e => {
            if (e.id === partidoId) {
                return {...e, resultadoPredicho: true};
            }
            return e;
        });
        
        // Actualizar en storage
        const datosGuardados = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
        if (datosGuardados.enfrentamientos) {
            datosGuardados.enfrentamientos = this.enfrentamientos;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(datosGuardados));
        }
        
        // Volver a renderizar
        this.renderizarEnfrentamientos();
    }
    
    /**
     * Verifica si la predicción fue correcta y actualiza el contador y saldo
     * @param {Object} enfrentamiento - Enfrentamiento finalizado
     */
    async verificarPrediccion(enfrentamiento) {
        const prediccion = this.predicciones[enfrentamiento.id];
        
        // Si no hay predicción para este partido, salir
        if (!prediccion) return;
        
        const apuesta = this.apuestas[enfrentamiento.id];
        // Si no hay apuesta para este partido, salir
        if (!apuesta) return;
        
        const golesLocal = enfrentamiento.resultado.golesLocal;
        const golesVisitante = enfrentamiento.resultado.golesVisitante;
        let resultadoReal;
        
        // Determinar resultado real
        if (golesLocal > golesVisitante) {
            resultadoReal = 'local';
        } else if (golesLocal < golesVisitante) {
            resultadoReal = 'visitante';
        } else {
            resultadoReal = 'empate';
        }
        
        // Verificar si la predicción fue acertada
        const acierto = prediccion === resultadoReal;
        
        // Actualizar contador
        this.contadorAciertos.total++;
        
        if (acierto) {
            this.contadorAciertos.aciertos++;
            
            // Calcular la ganancia
            const ganancia = apuesta.posibleGanancia;
            
            // Acreditar la ganancia al saldo del usuario
            await this.actualizarSaldoUsuarioBD(ganancia, 'ganancia', enfrentamiento.id);
            
            // Actualizar el contador de ganancias
            this.contadorAciertos.montoGanado += ganancia;
        }
        
        // Guardar contador actualizado
        localStorage.setItem('contador-aciertos', JSON.stringify(this.contadorAciertos));
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
        
        // Mostrar el saldo actual del usuario
        const saldoContainer = document.createElement('div');
        saldoContainer.className = 'saldo-container';
        saldoContainer.innerHTML = `
            <h3>Tu Saldo Actual</h3>
            <div class="saldo" id="saldo-usuario">$${this.saldoUsuario.toFixed(2)}</div>
        `;
        container.appendChild(saldoContainer);
        
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
        // Buscar si ya existe el resumen, si no, crearlo
        let resumenElement = document.querySelector('.resumen-predicciones');
        
        if (!resumenElement) {
            resumenElement = document.createElement('div');
            resumenElement.className = 'resumen-predicciones';
            document.querySelector('.futbol-container').appendChild(resumenElement);
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