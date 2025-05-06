/**
 * NavigationService.js
 * Servicio encargado de gestionar la navegación entre secciones
 */

class NavigationService {
    /**
     * Inicializa el servicio de navegación
     */
    static init() {
        // Inicializar los eventos relacionados con la navegación
        this.initEventos();
    }

    /**
     * Inicializa los eventos relacionados con la navegación
     */
    static initEventos() {
        // Eventos para navegación principal
        const inicioLinkEl = document.getElementById('inicio-link');
        const resultadosLinkEl = document.getElementById('resultados-link');
        const recargasLinkEl = document.getElementById('recargas-link');
        const retirosLinkEl = document.getElementById('retiros-link');
        const reportesLinkEl = document.getElementById('reportes-link');
        
        if (inicioLinkEl) inicioLinkEl.addEventListener('click', this.mostrarInicio);
        if (resultadosLinkEl) resultadosLinkEl.addEventListener('click', this.mostrarResultados);
        if (recargasLinkEl) recargasLinkEl.addEventListener('click', RecargaService.mostrarRecargas);
        if (retirosLinkEl) retirosLinkEl.addEventListener('click', RetiroService.mostrarRetiros);
        if (reportesLinkEl) reportesLinkEl.addEventListener('click', ReporteService.mostrarReportes);
        
        // Eventos para los botones de deportes
        const sportButtons = document.querySelectorAll('.sport-button');
        sportButtons.forEach(button => {
            button.addEventListener('click', () => {
                sportButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const deporteEl = button.querySelector('.sport-name');
                if (deporteEl) {
                    this.mostrarDeporte(deporteEl.textContent);
                }
            });
        });
        
        // Inicializar los elementos del menú lateral
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuItems.forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
                this.mostrarDeporte(item.textContent.trim());
                UIService.closeSidebar();
            });
        });
    }

    /**
     * Muestra la página de inicio
     */
    static mostrarInicio() {
        UIService.mostrarSeccion('inicio');
        const contenidoPrincipal = document.getElementById('contenido-principal');
        if (contenidoPrincipal) {
            contenidoPrincipal.innerHTML = `
                <div class="bienvenida-container">
                    <h2>Bienvenido a SportsBets360FMK</h2>
                    <p>La mejor plataforma de apuestas deportivas</p>
                    <p>Selecciona un deporte para comenzar a apostar</p>
                </div>
            `;
        }
    }

    /**
     * Muestra la página de resultados
     */
    static mostrarResultados() {
        UIService.mostrarSeccion('resultados');
        const contenidoPrincipal = document.getElementById('contenido-principal');
        if (contenidoPrincipal) {
            contenidoPrincipal.innerHTML = `
                <h2>Resultados Deportivos</h2>
                <p>Aquí podrás ver los resultados de los eventos deportivos más recientes.</p>
                <div class="resultados-placeholder">
                    <p>Cargando resultados...</p>
                </div>
            `;
        }
        // Aquí se cargarían los resultados desde una API
    }

    /**
     * Muestra la página del deporte seleccionado
     * @param {string} deporte - Nombre del deporte a mostrar
     */
    static mostrarDeporte(deporte) {
        const contenidoPrincipal = document.getElementById('contenido-principal');
        if (contenidoPrincipal) {
            contenidoPrincipal.innerHTML = `
                <h2>${deporte}</h2>
                <p>Próximos partidos para apostar:</p>
                <div class="eventos-deportivos">
                    <p>Cargando eventos de ${deporte}...</p>
                </div>
            `;
        }
        // Aquí se cargarían los eventos desde una API
    }
}