// SaldoService.js - Servicio para manejar el saldo del usuario
class SaldoService {
    constructor() {
        this.saldoElement = document.getElementById('user-balance');
        this.inicializar();
    }

    inicializar() {
        // Cargar el saldo al iniciar la página
        this.actualizarSaldo();
        
        // Configurar actualización periódica del saldo (cada 30 segundos)
        setInterval(() => this.actualizarSaldo(), 30000);
    }

    actualizarSaldo() {
        // Realizar petición al servidor para obtener el saldo actual
        fetch('http://localhost/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/UTILIDADES/BD_Conexion/Usuario/Obtener_saldo.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error('Error al obtener saldo:', data.error);
                // Si hay error, mostrar 0 o mantener el valor anterior
                this.mostrarSaldo(0);
            } else {
                // Actualizar el saldo en la interfaz
                this.mostrarSaldo(data.saldo);
            }
        })
        .catch(error => {
            console.error('Error al obtener saldo:', error);
            // En caso de error, mantener el saldo actual o mostrar un indicador de error
        });
    }

    mostrarSaldo(saldo) {
        // Formatear el saldo como moneda
        const saldoFormateado = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(saldo);
        
        // Actualizar el elemento en la interfaz
        if (this.saldoElement) {
            this.saldoElement.textContent = saldoFormateado;
        }
    }
}

// Inicializar el servicio cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia del servicio de saldo
    window.saldoService = new SaldoService();
});