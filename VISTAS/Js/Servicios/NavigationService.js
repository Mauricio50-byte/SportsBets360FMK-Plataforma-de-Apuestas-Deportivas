// NavigationService.js - Servicio para gestionar la navegación entre secciones

document.addEventListener('DOMContentLoaded', function() {
    console.log('NavigationService cargado correctamente');
    
    // Seleccionar elementos del menú
    const inicioLink = document.getElementById('inicio-link');
    const recargasLink = document.getElementById('recargas-link');
    const retirosLink = document.getElementById('retiros-link');
    const reportesLink = document.getElementById('reportes-link');
    
    // Seleccionar botones deportes
    const sportButtons = document.querySelectorAll('.sport-button');
    
    // Seleccionar elementos del sidebar
    const sidebarItems = document.querySelectorAll('.sport-display');
    
    // Función para cargar contenido de Fútbol
    function cargarContenidoFutbol() {
        console.log('Intentando cargar contenido de fútbol');
        const contenidoPrincipal = document.getElementById('contenido-principal');
        
        if (!contenidoPrincipal) {
            console.error('No se encontró el elemento contenido-principal');
            return;
        }
        
        // Crear el contenedor para el contenido de fútbol
        const futbolContainer = document.createElement('div');
        futbolContainer.className = 'futbol-container';
        
        // Añadir el HTML del contenido de fútbol
        futbolContainer.innerHTML = `
            <div class="futbol-container">
                <h2 class="futbol-title">Enfrentamientos de Fútbol del Día</h2>
                <p class="fecha-enfrentamientos" id="fecha-actual">Cargando fecha...</p>
                
                <div class="enfrentamientos-container" id="enfrentamientos-container">
                    <!-- Aquí se cargarán dinámicamente los enfrentamientos -->
                    <div class="cargando">Cargando enfrentamientos...</div>
                </div>
                
                <div class="leyenda">
                    <div class="estado-item">
                        <span class="estado-indicator no-comenzado"></span>
                        <span>No ha comenzado</span>
                    </div>
                    <div class="estado-item">
                        <span class="estado-indicator en-vivo"></span>
                        <span>En vivo</span>
                    </div>
                    <div class="estado-item">
                        <span class="estado-indicator finalizado"></span>
                        <span>Finalizado</span>
                    </div>
                </div>
                
                <!-- Instrucciones para el juego de predicción -->
                <div class="prediccion-instrucciones">
                    <h3>¡Adivina el Resultado!</h3>
                    <p>Haz tu predicción sobre los partidos que aún no han comenzado.</p>
                </div>
            </div>
        `;
        
        // Limpiar contenido actual y añadir el contenedor de fútbol
        contenidoPrincipal.innerHTML = '';
        contenidoPrincipal.appendChild(futbolContainer);
        
        // Cargar los estilos si no están ya cargados
        cargarEstilosFutbol();
        
        // Cargar y ejecutar el script de Fútbol
        cargarScriptFutbol();
    }
    
    // Función para cargar estilos de Fútbol
    function cargarEstilosFutbol() {
        if (!document.querySelector('link[href*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/Futbol.css"]')) {
            console.log('Cargando estilos de Fútbol');
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/Futbol.css';
            document.head.appendChild(link);
        }
    }
    
    // Función para cargar script de Fútbol
    function cargarScriptFutbol() {
        // Verificar si ya existe el script
        if (!document.querySelector('script[src*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Futbol/Futbol.js"]')) {
            console.log('Cargando script de Fútbol');
            const script = document.createElement('script');
            script.src = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Futbol/Futbol.js';
            script.onload = function() {
                console.log('Script de Fútbol cargado correctamente');
                // Si existe la clase, inicializar
                if (typeof EnfrentamientosFutbol === 'function') {
                    console.log('Inicializando EnfrentamientosFutbol');
                    const manager = new EnfrentamientosFutbol();
                    manager.renderizarEnfrentamientos();
                } else {
                    console.error('La clase EnfrentamientosFutbol no está disponible');
                }
            };
            document.body.appendChild(script);
        } else {
            console.log('Script de Fútbol ya está cargado, inicializando');
            // Si el script ya está cargado, intentar inicializar
            if (typeof EnfrentamientosFutbol === 'function') {
                const manager = new EnfrentamientosFutbol();
                manager.renderizarEnfrentamientos();
            }
        }
    }
    
    // Añadir eventos para los botones de deportes
    sportButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            sportButtons.forEach(btn => btn.classList.remove('active'));
            // Añadir clase active al botón actual
            this.classList.add('active');
            
            // Verificar qué deporte se ha seleccionado
            const sportName = this.querySelector('.sport-name')?.textContent;
            console.log('Deporte seleccionado:', sportName);
            
            if (sportName === 'FÚTBOL') {
                cargarContenidoFutbol();
            } else if (sportName === 'EN VIVO') {
                // Cargar contenido de eventos en vivo
                // Implementación futura
            } else {
                // Mostrar mensaje de funcionalidad en desarrollo
                const contenidoPrincipal = document.getElementById('contenido-principal');
                if (contenidoPrincipal) {
                    contenidoPrincipal.innerHTML = `
                        <div class="mensaje-desarrollo">
                            <h3>Próximamente</h3>
                            <p>La sección de ${sportName} estará disponible pronto.</p>
                        </div>
                    `;
                }
            }
        });
    });
    
    // Añadir eventos para los elementos del sidebar
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            const sportText = this.textContent.trim();
            console.log('Deporte seleccionado desde sidebar:', sportText);
            
            if (sportText === '⚽ Futbol') {
                cargarContenidoFutbol();
            } else {
                // Mostrar mensaje de funcionalidad en desarrollo
                const contenidoPrincipal = document.getElementById('contenido-principal');
                if (contenidoPrincipal) {
                    contenidoPrincipal.innerHTML = `
                        <div class="mensaje-desarrollo">
                            <h3>Próximamente</h3>
                            <p>La sección de ${sportText} estará disponible pronto.</p>
                        </div>
                    `;
                }
            }
        });
    });
    
    // Añadir un poco de CSS para el mensaje de desarrollo
    const style = document.createElement('style');
    style.textContent = `
        .mensaje-desarrollo {
            text-align: center;
            padding: 50px 20px;
            color: #666;
        }
        .mensaje-desarrollo h3 {
            font-size: 24px;
            margin-bottom: 15px;
            color: #1a3b5d;
        }
    `;
    document.head.appendChild(style);
    
});