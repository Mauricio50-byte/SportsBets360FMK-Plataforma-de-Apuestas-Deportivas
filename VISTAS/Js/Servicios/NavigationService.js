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
        if (!document.querySelector('link[href*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/Deportes/Futbol.css"]')) {
            console.log('Cargando estilos de Fútbol');
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/Deportes/Futbol.css';
            document.head.appendChild(link);
        }
    }
    
    // Función para cargar script de Fútbol
    function cargarScriptFutbol() {
        // Verificar si ya existe el script
        if (!document.querySelector('script[src*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Deportes/Futbol.js"]')) {
            console.log('Cargando script de Fútbol');
            const script = document.createElement('script');
            script.src = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Deportes/Futbol.js';
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
    
    // TENIS
    // Función para cargar contenido de Tenis
    function cargarContenidoTenis() {
        console.log('Intentando cargar contenido de tenis');
        const contenidoPrincipal = document.getElementById('contenido-principal');
        
        if (!contenidoPrincipal) {
            console.error('No se encontró el elemento contenido-principal');
            return;
        }
        
        // Crear el contenedor para el contenido de tenis
        const tenisContainer = document.createElement('div');
        tenisContainer.className = 'tenis-container';
        
        // Añadir el HTML del contenido de tenis
        tenisContainer.innerHTML = `
            <div class="tenis-container">
                <h2 class="tenis-title">Enfrentamientos de Tenis del Día</h2>
                <p class="fecha-enfrentamientos" id="fecha-actual-tenis">Cargando fecha...</p>
                
                <div class="enfrentamientos-container" id="enfrentamientos-container-tenis">
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
            
        
        // Limpiar contenido actual y añadir el contenedor de tenis
        contenidoPrincipal.innerHTML = '';
        contenidoPrincipal.appendChild(tenisContainer);
        
        // Cargar los estilos si no están ya cargados
        cargarEstilosTenis();
        
        // Cargar y ejecutar el script de Tenis
        cargarScriptTenis();
    }
    
    // Función para cargar estilos de Tenis
    function cargarEstilosTenis() {
        if (!document.querySelector('link[href*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/Deportes/Tenis.css"]')) {
            console.log('Cargando estilos de Tenis');
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/Deportes/Tenis.css';
            document.head.appendChild(link);
        }
    }

    // Función para cargar script de Tenis
    function cargarScriptTenis() {
        // Verificar si ya existe el script
        if (!document.querySelector('script[src*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Deportes/Tenis.js"]')) {
            console.log('Cargando script de Fútbol');
            const script = document.createElement('script');
            script.src = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Deportes/Tenis.js';
            script.onload = function() {
                console.log('Script de Fútbol cargado correctamente');
                // Si existe la clase, inicializar
                if (typeof EnfrentamientosTenis === 'function') {
                    console.log('Inicializando EnfrentamientosFutbol');
                    const manager = new EnfrentamientosTenis();
                    manager.renderizarEnfrentamientos();
                } else {
                    console.error('La clase EnfrentamientosFutbol no está disponible');
                }
            };
            document.body.appendChild(script);
        } else {
            console.log('Script de Fútbol ya está cargado, inicializando');
            // Si el script ya está cargado, intentar inicializar
            if (typeof EnfrentamientosTenis === 'function') {
                const manager = new EnfrentamientosTenis();
                manager.renderizarEnfrentamientos();
            }
        }
    }
    // BOXEO
    // Función para cargar contenido de Boxeo
    function cargarContenidoBoxeo() {
        console.log('Intentando cargar contenido de boxeo');
        const contenidoPrincipal = document.getElementById('contenido-principal');
        
        if (!contenidoPrincipal) {
            console.error('No se encontró el elemento contenido-principal');
            return;
        }
        
        // Crear el contenedor para el contenido de boxeo
        const boxeoContainer = document.createElement('div');
        boxeoContainer.className = 'boxeo-container';
        
        // Añadir el HTML del contenido de boxeo
        boxeoContainer.innerHTML = `
            <div class="boxeo-container">
                <h2 class="boxeo-title">Combates de Boxeo del Día</h2>
                <p class="fecha-combates" id="fecha-actual-boxeo">Cargando fecha...</p>
                
                <div class="combates-container" id="combates-container-boxeo">
                    <!-- Aquí se cargarán dinámicamente los combates -->
                    <div class="cargando">Cargando combates...</div>
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
                    <h3>¡Adivina el Ganador!</h3>
                    <p>Haz tu predicción sobre los combates que aún no han comenzado.</p>
                </div>
            </div>
        `;
        
        // Limpiar contenido actual y añadir el contenedor de boxeo
        contenidoPrincipal.innerHTML = '';
        contenidoPrincipal.appendChild(boxeoContainer);
        
        // Cargar los estilos si no están ya cargados
        cargarEstilosBoxeo();
        
        // Cargar y ejecutar el script de Boxeo
        cargarScriptBoxeo();
    }

    // Función para cargar estilos de Boxeo
    function cargarEstilosBoxeo() {
        if (!document.querySelector('link[href*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/Boxeo.css"]')) {
            console.log('Cargando estilos de Boxeo');
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/Boxeo.css';
            document.head.appendChild(link);
        }
    }

    // Función para cargar script de Boxeo
    function cargarScriptBoxeo() {
        // Verificar si ya existe el script
        if (!document.querySelector('script[src*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Boxeo/Boxeo.js"]')) {
            console.log('Cargando script de Boxeo');
            const script = document.createElement('script');
            script.src = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Boxeo/Boxeo.js';
            script.onload = function() {
                console.log('Script de Boxeo cargado correctamente');
                // Si existe la clase, inicializar
                if (typeof CombatesBoxeo === 'function') {
                    console.log('Inicializando CombatesBoxeo');
                    const manager = new CombatesBoxeo();
                    manager.renderizarCombates();
                } else {
                    console.error('La clase CombatesBoxeo no está disponible');
                }
            };
            document.body.appendChild(script);
        } else {
            console.log('Script de Boxeo ya está cargado, inicializando');
            // Si el script ya está cargado, intentar inicializar
            if (typeof CombatesBoxeo === 'function') {
                const manager = new CombatesBoxeo();
                manager.renderizarCombates();
            }
        }
    }

    // BALONCESTO
    // Función para cargar contenido de Baloncesto
    function cargarContenidoBaloncesto() {
        console.log('Intentando cargar contenido de baloncesto');
        const contenidoPrincipal = document.getElementById('contenido-principal');
        
        if (!contenidoPrincipal) {
            console.error('No se encontró el elemento contenido-principal');
            return;
        }
        
        // Crear el contenedor para el contenido de baloncesto
        const baloncestoContainer = document.createElement('div');
        baloncestoContainer.className = 'baloncesto-container';
        
        // Añadir el HTML del contenido de baloncesto
        baloncestoContainer.innerHTML = `
            <div class="baloncesto-container">
                <h2 class="baloncesto-title">Partidos de Baloncesto del Día</h2>
                <p class="fecha-partidos" id="fecha-actual-baloncesto">Cargando fecha...</p>
                
                <div class="partidos-container" id="partidos-container-baloncesto">
                    <!-- Aquí se cargarán dinámicamente los partidos -->
                    <div class="cargando">Cargando partidos...</div>
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
        
        // Limpiar contenido actual y añadir el contenedor de baloncesto
        contenidoPrincipal.innerHTML = '';
        contenidoPrincipal.appendChild(baloncestoContainer);
        
        // Cargar los estilos si no están ya cargados
        cargarEstilosBaloncesto();
        
        // Cargar y ejecutar el script de Baloncesto
        cargarScriptBaloncesto();
    }
    
    // Función para cargar estilos de Baloncesto
    function cargarEstilosBaloncesto() {
        if (!document.querySelector('link[href*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/Baloncesto.css"]')) {
            console.log('Cargando estilos de Baloncesto');
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/Baloncesto.css';
            document.head.appendChild(link);
        }
    }
    
    // Función para cargar script de Baloncesto
    function cargarScriptBaloncesto() {
        // Verificar si ya existe el script
        if (!document.querySelector('script[src*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Baloncesto/Baloncesto.js"]')) {
            console.log('Cargando script de Baloncesto');
            const script = document.createElement('script');
            script.src = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Baloncesto/Baloncesto.js';
            script.onload = function() {
                console.log('Script de Baloncesto cargado correctamente');
                // Si existe la clase, inicializar
                if (typeof PartidosBaloncesto === 'function') {
                    console.log('Inicializando PartidosBaloncesto');
                    const manager = new PartidosBaloncesto();
                    manager.renderizarPartidos();
                } else {
                    console.error('La clase PartidosBaloncesto no está disponible');
                }
            };
            document.body.appendChild(script);
        } else {
            console.log('Script de Baloncesto ya está cargado, inicializando');
            // Si el script ya está cargado, intentar inicializar
            if (typeof PartidosBaloncesto === 'function') {
                const manager = new PartidosBaloncesto();
                manager.renderizarPartidos();
            }
        }
    }
    
    // FÚTBOL AMERICANO
    // Función para cargar contenido de Fútbol Americano
    function cargarContenidoFutbolAmericano() {
        console.log('Intentando cargar contenido de fútbol americano');
        const contenidoPrincipal = document.getElementById('contenido-principal');
        
        if (!contenidoPrincipal) {
            console.error('No se encontró el elemento contenido-principal');
            return;
        }
        
        // Crear el contenedor para el contenido de fútbol americano
        const futbolAmericanoContainer = document.createElement('div');
        futbolAmericanoContainer.className = 'futbol-americano-container';
        
        // Añadir el HTML del contenido de fútbol americano
        futbolAmericanoContainer.innerHTML = `
            <div class="futbol-americano-container">
                <h2 class="futbol-americano-title">Partidos de Fútbol Americano del Día</h2>
                <p class="fecha-partidos" id="fecha-actual-futbol-americano">Cargando fecha...</p>
                
                <div class="partidos-container" id="partidos-container-futbol-americano">
                    <!-- Aquí se cargarán dinámicamente los partidos -->
                    <div class="cargando">Cargando partidos...</div>
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
        
        // Limpiar contenido actual y añadir el contenedor de fútbol americano
        contenidoPrincipal.innerHTML = '';
        contenidoPrincipal.appendChild(futbolAmericanoContainer);
        
        // Cargar los estilos si no están ya cargados
        cargarEstilosFutbolAmericano();
        
        // Cargar y ejecutar el script de Fútbol Americano
        cargarScriptFutbolAmericano();
    }
    
    // Función para cargar estilos de Fútbol Americano
    function cargarEstilosFutbolAmericano() {
        if (!document.querySelector('link[href*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/FutbolAmericano.css"]')) {
            console.log('Cargando estilos de Fútbol Americano');
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/FutbolAmericano.css';
            document.head.appendChild(link);
        }
    }
    
    // Función para cargar script de Fútbol Americano
    function cargarScriptFutbolAmericano() {
        // Verificar si ya existe el script
        if (!document.querySelector('script[src*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/FutbolAmericano/FutbolAmericano.js"]')) {
            console.log('Cargando script de Fútbol Americano');
            const script = document.createElement('script');
            script.src = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/FutbolAmericano/FutbolAmericano.js';
            script.onload = function() {
                console.log('Script de Fútbol Americano cargado correctamente');
                // Si existe la clase, inicializar
                if (typeof PartidosFutbolAmericano === 'function') {
                    console.log('Inicializando PartidosFutbolAmericano');
                    const manager = new PartidosFutbolAmericano();
                    manager.renderizarPartidos();
                } else {
                    console.error('La clase PartidosFutbolAmericano no está disponible');
                }
            };
            document.body.appendChild(script);
        } else {
            console.log('Script de Fútbol Americano ya está cargado, inicializando');
            // Si el script ya está cargado, intentar inicializar
            if (typeof PartidosFutbolAmericano === 'function') {
                const manager = new PartidosFutbolAmericano();
                manager.renderizarPartidos();
            }
        }
    }
    
    // BÉISBOL
    // Función para cargar contenido de Béisbol
    function cargarContenidoBeisbol() {
        console.log('Intentando cargar contenido de béisbol');
        const contenidoPrincipal = document.getElementById('contenido-principal');
        
        if (!contenidoPrincipal) {
            console.error('No se encontró el elemento contenido-principal');
            return;
        }
        
        // Crear el contenedor para el contenido de béisbol
        const beisbolContainer = document.createElement('div');
        beisbolContainer.className = 'beisbol-container';
        
        // Añadir el HTML del contenido de béisbol
        beisbolContainer.innerHTML = `
            <div class="beisbol-container">
                <h2 class="beisbol-title">Partidos de Béisbol del Día</h2>
                <p class="fecha-partidos" id="fecha-actual-beisbol">Cargando fecha...</p>
                
                <div class="partidos-container" id="partidos-container-beisbol">
                    <!-- Aquí se cargarán dinámicamente los partidos -->
                    <div class="cargando">Cargando partidos...</div>
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
        
        // Limpiar contenido actual y añadir el contenedor de béisbol
        contenidoPrincipal.innerHTML = '';
        contenidoPrincipal.appendChild(beisbolContainer);
        
        // Cargar los estilos si no están ya cargados
        cargarEstilosBeisbol();
        
        // Cargar y ejecutar el script de Béisbol
        cargarScriptBeisbol();
    }
    
    // Función para cargar estilos de Béisbol
    function cargarEstilosBeisbol() {
        if (!document.querySelector('link[href*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/Beisbol.css"]')) {
            console.log('Cargando estilos de Béisbol');
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/Beisbol.css';
            document.head.appendChild(link);
        }
    }
    
    // Función para cargar script de Béisbol
    function cargarScriptBeisbol() {
        // Verificar si ya existe el script
        if (!document.querySelector('script[src*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Beisbol/Beisbol.js"]')) {
            console.log('Cargando script de Béisbol');
            const script = document.createElement('script');
            script.src = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Beisbol/Beisbol.js';
            script.onload = function() {
                console.log('Script de Béisbol cargado correctamente');
                // Si existe la clase, inicializar
                if (typeof PartidosBeisbol === 'function') {
                    console.log('Inicializando PartidosBeisbol');
                    const manager = new PartidosBeisbol();
                    manager.renderizarPartidos();
                } else {
                    console.error('La clase PartidosBeisbol no está disponible');
                }
            };
            document.body.appendChild(script);
        } else {
            console.log('Script de Béisbol ya está cargado, inicializando');
            // Si el script ya está cargado, intentar inicializar
            if (typeof PartidosBeisbol === 'function') {
                const manager = new PartidosBeisbol();
                manager.renderizarPartidos();
            }
        }
    }
    
    // VOLEIBOL
    // Función para cargar contenido de Voleibol
    function cargarContenidoVoleibol() {
        console.log('Intentando cargar contenido de voleibol');
        const contenidoPrincipal = document.getElementById('contenido-principal');
        
        if (!contenidoPrincipal) {
            console.error('No se encontró el elemento contenido-principal');
            return;
        }
        
        // Crear el contenedor para el contenido de voleibol
        const voleibolContainer = document.createElement('div');
        voleibolContainer.className = 'voleibol-container';
        
        // Añadir el HTML del contenido de voleibol
        voleibolContainer.innerHTML = `
            <div class="voleibol-container">
                <h2 class="voleibol-title">Partidos de Voleibol del Día</h2>
                <p class="fecha-partidos" id="fecha-actual-voleibol">Cargando fecha...</p>
                
                <div class="partidos-container" id="partidos-container-voleibol">
                    <!-- Aquí se cargarán dinámicamente los partidos -->
                    <div class="cargando">Cargando partidos...</div>
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
        
        // Limpiar contenido actual y añadir el contenedor de voleibol
        contenidoPrincipal.innerHTML = '';
        contenidoPrincipal.appendChild(voleibolContainer);
        
        // Cargar los estilos si no están ya cargados
        cargarEstilosVoleibol();
        
        // Cargar y ejecutar el script de Voleibol
        cargarScriptVoleibol();
    }
    
    // Función para cargar estilos de Voleibol
    function cargarEstilosVoleibol() {
        if (!document.querySelector('link[href*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/Voleibol.css"]')) {
            console.log('Cargando estilos de Voleibol');
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Css/Voleibol.css';
            document.head.appendChild(link);
        }
    }
    
    // Función para cargar script de Voleibol
    function cargarScriptVoleibol() {
        // Verificar si ya existe el script
        if (!document.querySelector('script[src*="http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Voleibol/Voleibol.js"]')) {
            console.log('Cargando script de Voleibol');
            const script = document.createElement('script');
            script.src = 'http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/VISTAS/Js/Voleibol/Voleibol.js';
            script.onload = function() {
                console.log('Script de Voleibol cargado correctamente');
                // Si existe la clase, inicializar
                if (typeof PartidosVoleibol === 'function') {
                    console.log('Inicializando PartidosVoleibol');
                    const manager = new PartidosVoleibol();
                    manager.renderizarPartidos();
                } else {
                    console.error('La clase PartidosVoleibol no está disponible');
                }
            };
            document.body.appendChild(script);
        } else {
            console.log('Script de Voleibol ya está cargado, inicializando');
            // Si el script ya está cargado, intentar inicializar
            if (typeof PartidosVoleibol === 'function') {
                const manager = new PartidosVoleibol();
                manager.renderizarPartidos();
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
            } else if (sportName === 'TENIS') {
                cargarContenidoTenis();
            } else if (sportName === 'BOXEO') {
                cargarContenidoBoxeo();
            } else if (sportName === 'BALONCESTO') {
                cargarContenidoBaloncesto();
            } else if (sportName === 'FÚTBOL AMERICANO') {
                cargarContenidoFutbolAmericano();
            } else if (sportName === 'BÉISBOL') {
                cargarContenidoBeisbol();
            } else if (sportName === 'VOLEIBOL') {
                cargarContenidoVoleibol();
            } else if (sportName === 'EN VIVO') {
                // Cargar contenido de eventos en vivo
                // Implementación futura
                const contenidoPrincipal = document.getElementById('contenido-principal');
                if (contenidoPrincipal) {
                    contenidoPrincipal.innerHTML = `
                        <div class="mensaje-desarrollo">
                            <h3>Próximamente</h3>
                            <p>La sección de eventos EN VIVO estará disponible pronto.</p>
                        </div>
                    `;
                }
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
            } else if (sportText === '🎾 Tenis') {
                cargarContenidoTenis();
            } else if (sportText === '🥊 Boxeo') {
                cargarContenidoBoxeo();
            } else if (sportText === '🏀 Baloncesto') {
                cargarContenidoBaloncesto();
            } else if (sportText === '🏈 Fútbol Americano') {
                cargarContenidoFutbolAmericano();
            } else if (sportText === '⚾ Béisbol') {
                cargarContenidoBeisbol();
            } else if (sportText === '🏐 Voleibol') {
                cargarContenidoVoleibol();
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