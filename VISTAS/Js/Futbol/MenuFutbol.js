// Este script maneja la carga del contenido de Fútbol en el menú principal

document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar el botón de fútbol en el menú lateral
    const futbolMenuItem = document.querySelector('.menu-item:contains("⚽ Futbol")');
    
    // Seleccionar el botón de fútbol en los deportes
    const futbolButton = document.querySelector('.sport-button:nth-child(2)');
    
    // Función para cargar el contenido de Fútbol
    function cargarContenidoFutbol() {
        const contenidoPrincipal = document.getElementById('contenido-principal');
        
        // Eliminar el contenido actual
        contenidoPrincipal.innerHTML = '';
        
        // Crear el contenedor para el contenido de fútbol
        const futbolContainer = document.createElement('div');
        futbolContainer.className = 'futbol-container';
        
        // Añadir el HTML del contenido de fútbol
        futbolContainer.innerHTML = `
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
        `;
        
        // Añadir el contenedor al contenido principal
        contenidoPrincipal.appendChild(futbolContainer);
        
        // Cargar y ejecutar el script de Fútbol
        cargarScriptFutbol();
        
        // Añadir los estilos de Fútbol si no están ya cargados
        cargarEstilosFutbol();
    }
    
    // Función para cargar dinámicamente el script de Fútbol.js
    function cargarScriptFutbol() {
        // Verificar si ya existe el script
        if (!document.querySelector('script[src="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Futbol/Futbol.js"]')) {
            const script = document.createElement('script');
            script.src = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Futbol/Futbol.js';
            document.body.appendChild(script);
        } else {
            // Si el script ya está cargado, podemos intentar inicializarlo de nuevo
            if (typeof inicializarFutbol === 'function') {
                inicializarFutbol();
            }
        }
    }
    
    // Función para cargar los estilos de Fútbol
    function cargarEstilosFutbol() {
        // Verificar si ya existe el enlace de estilos
        if (!document.querySelector('link[href="../Css/Futbol.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/Futbol.css';
            document.head.appendChild(link);
        }
    }
    
    // Evento para el botón de fútbol en el menú lateral
    if (futbolMenuItem) {
        futbolMenuItem.addEventListener('click', function() {
            cargarContenidoFutbol();
        });
    }
    
    // Evento para el botón de fútbol en los deportes
    if (futbolButton) {
        futbolButton.addEventListener('click', function() {
            cargarContenidoFutbol();
        });
    }
    
    // Solucionamos el problema del selector :contains que no es estándar
    // Añadimos un polyfill para :contains
    if (!document.querySelector('.menu-item:contains("⚽ Futbol")')) {
        // Si el selector anterior no funciona, usamos una alternativa
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            if (item.textContent.includes('⚽ Futbol')) {
                item.addEventListener('click', function() {
                    cargarContenidoFutbol();
                });
            }
        });
        
        // También para el botón de deportes
        const sportButtons = document.querySelectorAll('.sport-button');
        sportButtons.forEach(button => {
            if (button.textContent.includes('FÚTBOL')) {
                button.addEventListener('click', function() {
                    cargarContenidoFutbol();
                });
            }
        });
    }
});