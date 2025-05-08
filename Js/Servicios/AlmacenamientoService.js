class AlmacenamientoService {
    static guardarUsuarios() {
        localStorage.setItem('usuariosBD', JSON.stringify(Usuario.usuariosBD));
    }

    static cargarUsuarios() {
        const usuarios = JSON.parse(localStorage.getItem('usuariosBD')) || {};
        Usuario.usuariosBD = usuarios;
        return usuarios;
    }

    static guardarRecargasRetiros() {
        localStorage.setItem('recargaRetiroBD', JSON.stringify(RecargaRetiro.recarga_retiroBD));
        localStorage.setItem('contadorRecarga', RecargaRetiro.contadorRecarga);
        localStorage.setItem('contadorRetiro', RecargaRetiro.contadorRetiro);
    }

    static cargarRecargasRetiros() {
        const recargasRetiros = JSON.parse(localStorage.getItem('recargaRetiroBD')) || {};
        RecargaRetiro.recarga_retiroBD = recargasRetiros;
        RecargaRetiro.contadorRecarga = parseInt(localStorage.getItem('contadorRecarga') || '0');
        RecargaRetiro.contadorRetiro = parseInt(localStorage.getItem('contadorRetiro') || '0');
        return recargasRetiros;
    }

    // Inicializar el almacenamiento al cargar la página
    static inicializar() {
        this.cargarUsuarios();
        this.cargarRecargasRetiros();
    }
}

// Inicializar el servicio de almacenamiento cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    AlmacenamientoService.inicializar();
});