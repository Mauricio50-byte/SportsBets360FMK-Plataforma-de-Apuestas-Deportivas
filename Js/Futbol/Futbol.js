/**
 * Clase para gestionar los enfrentamientos de fútbol
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
        
        // Inicializar enfrentamientos
        this.enfrentamientos = this.obtenerEnfrentamientosDia();
        
        // Iniciar intervalo para actualización automática
        this.iniciarActualizacionAutomatica();
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
            
            // Generar horario aleatorio entre 9:00 y 21:00
            const hora = Math.floor(Math.random() * 13) + 9; // 9 a 21
            const minuto = Math.random() < 0.5 ? 0 : 30; // 00 o 30
            
            enfrentamientos.push({
                id: `partido-${i + 1}`,
                equipoLocal: equipoLocal,
                equipoVisitante: equipoVisitante,
                hora: String(hora).padStart(2, '0'),
                minuto: String(minuto).padStart(2, '0'),
                resultado: {
                    golesLocal: null,
                    golesVisitante: null
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
        
        // Añadir cada enfrentamiento
        this.enfrentamientos.forEach(enfrentamiento => {
            const estado = this.determinarEstadoEnfrentamiento(enfrentamiento);
            
            const enfrentamientoHTML = document.createElement('div');
            enfrentamientoHTML.className = 'enfrentamiento';
            
            // Contenido del enfrentamiento
            enfrentamientoHTML.innerHTML = `
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
            
            container.appendChild(enfrentamientoHTML);
        });
    }
    
    /**
     * Inicia la actualización automática de enfrentamientos
     */
    iniciarActualizacionAutomatica() {
        // Actualizar cada minuto para reflejar cambios de estado
        setInterval(() => {
            this.renderizarEnfrentamientos();
        }, 60000);
        
        // Verificar cambio de día a medianoche
        setInterval(() => {
            const hoy = this.obtenerFechaActual();
            const datosGuardados = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{"fecha": ""}');
            
            if (datosGuardados.fecha !== hoy) {
                // Nuevo día, generar nuevos enfrentamientos
                this.enfrentamientos = this.generarEnfrentamientosAleatorios();
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
                    fecha: hoy,
                    enfrentamientos: this.enfrentamientos
                }));
                this.renderizarEnfrentamientos();
            }
        }, 60000);
    }
}

/**
 * Inicialización al cargar la página
 */
document.addEventListener('DOMContentLoaded', () => {
    let manager = null;
    
    // Función para cargar la sección de fútbol
    const cargarSeccionFutbol = () => {
        // Si no existe, crear instancia del gestor de enfrentamientos
        if (!manager) {
            manager = new EnfrentamientosFutbol();
        }
        
        // Renderizar enfrentamientos
        manager.renderizarEnfrentamientos();
    };
    
    // Si estamos en la página de fútbol, inicializar directamente
    if (document.querySelector('.futbol-container')) {
        cargarSeccionFutbol();
    }
    
    // Agregar manejador de eventos para botón fútbol en menú principal
    const setupButtonListeners = () => {
        const botonesFutbol = document.querySelectorAll('.sport-button');
        
        botonesFutbol.forEach(boton => {
            if (boton.querySelector('.sport-name')?.textContent === 'FÚTBOL') {
                boton.addEventListener('click', () => {
                    const contenidoPrincipal = document.getElementById('contenido-principal');
                    if (contenidoPrincipal) {
                        // Cargar HTML de fútbol mediante fetch
                        fetch('../Html/futbol.html')
                            .then(response => response.text())
                            .then(html => {
                                contenidoPrincipal.innerHTML = html;
                                cargarSeccionFutbol();
                            })
                            .catch(error => {
                                console.error('Error al cargar la sección de fútbol:', error);
                                contenidoPrincipal.innerHTML = '<div class="error-message">Error al cargar los enfrentamientos</div>';
                            });
                    }
                });
            }
        });
    };
    
    // Configurar botones si estamos en la página principal
    if (document.querySelector('.sport-button')) {
        setupButtonListeners();
    }
});