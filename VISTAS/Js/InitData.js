// initData.js - Script para inicializar datos de prueba
// Función para inicializar datos de prueba
function inicializarDatosPrueba() {
    // Verificar si ya hay datos cargados
    if (Object.keys(Usuario.usuariosBD).length > 0) {
        console.log("Ya existen datos en el sistema");
        return;
    }
    
    console.log("Inicializando datos de prueba...");
    
    // Crear usuarios de prueba
    try {
        const usuario1 = UsuarioService.registrarUsuario(
            "Juan", "Pérez", "1234567890", "3001234567", "juan@example.com", "password123"
        );
        
        const usuario2 = UsuarioService.registrarUsuario(
            "María", "López", "0987654321", "3109876543", "maria@example.com", "password123"
        );
        
        const usuario3 = UsuarioService.registrarUsuario(
            "Carlos", "Gómez", "5678901234", "3205678901", "carlos@example.com", "password123"
        );
        
        console.log("Usuarios de prueba creados");
        
        // Crear algunas recargas y retiros de prueba
        const recarga1 = RecargaRetiroService.realizarRecarga("juan@example.com", "", 100000);
        const recarga2 = RecargaRetiroService.realizarRecarga("maria@example.com", "", 150000);
        const recarga3 = RecargaRetiroService.realizarRecarga("carlos@example.com", "", 200000);
        
        console.log("Recargas de prueba creadas");
        
        const retiro1 = RecargaRetiroService.realizarRetiro("juan@example.com", "", 25000);
        const retiro2 = RecargaRetiroService.realizarRetiro("maria@example.com", "", 50000);
        
        console.log("Retiros de prueba creados");
        
        console.log("Datos de prueba inicializados correctamente");
    } catch (error) {
        console.error("Error al inicializar datos de prueba:", error);
    }
}

// Ejecutar la inicialización cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    // Primero cargar los datos existentes
    AlmacenamientoService.inicializar();
    
    // Luego agregar datos de prueba si es necesario
    inicializarDatosPrueba();
    
    // Verificar la página actual y configurar eventos
    const currentPath = window.location.pathname;
    
    // Si estamos en index.html, configurar los formularios de login/registro
    if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
        configurarFormulariosIndex();
    }
    
    // Si estamos en Menu.html, configurar la interfaz según el usuario logueado
    if (currentPath.includes('Menu.html')) {
        configurarInterfazMenu();
    }
    
    console.log("Sistema inicializado correctamente");
});

// Función para verificar si es la primera vez que se ejecuta la aplicación
function esInicializacionInicial() {
    return localStorage.getItem('inicializado') === null;
}

// Función para marcar como inicializado
function marcarComoInicializado() {
    localStorage.setItem('inicializado', 'true');
}

// Botón para limpiar datos (para desarrollo)
function limpiarDatos() {
    localStorage.clear();
    sessionStorage.clear();
    console.log("Datos borrados, recargando página...");
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Agregar botón de reset solo en entorno de desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', function() {
        const resetBtn = document.createElement('button');
        resetBtn.textContent = "Reiniciar Datos";
        resetBtn.style.position = "fixed";
        resetBtn.style.bottom = "10px";
        resetBtn.style.right = "10px";
        resetBtn.style.zIndex = "9999";
        resetBtn.style.padding = "5px 10px";
        resetBtn.style.backgroundColor = "#f44336";
        resetBtn.style.color = "white";
        resetBtn.style.border = "none";
        resetBtn.style.borderRadius = "4px";
        resetBtn.style.cursor = "pointer";
        resetBtn.onclick = limpiarDatos;
        
        document.body.appendChild(resetBtn);
    });
}