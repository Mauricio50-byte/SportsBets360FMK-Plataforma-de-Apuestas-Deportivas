<?php
/**
 * Controlador para gestionar las operaciones de recarga y retiro
 * Implementa la lógica de negocio para las transacciones de saldo
 */
class ControladorRecargaRetiro {
    private $recargaRetiroPersistencia;
    
    /**
     * Constructor del controlador de recarga y retiro
     */
    public function __construct() {
        // Inicializar la capa de persistencia
        require_once(__DIR__ . '/../MODELO/Persistencia/RecargaRetiroPersistencia.php');
        $this->recargaRetiroPersistencia = new RecargaRetiroPersistencia();
    }
    
    /**
     * Método para procesar una recarga de saldo
     * @param array $datosRecarga Array con los datos de la recarga
     * @return array Respuesta del proceso con estado y mensaje
     */
    public function procesarRecarga($datosRecarga) {
        // Validar datos requeridos
        if (empty($datosRecarga['usuario']) || empty($datosRecarga['documento']) || 
            empty($datosRecarga['correo']) || empty($datosRecarga['monto'])) {
            return [
                'status' => 'error',
                'message' => 'Todos los campos son obligatorios'
            ];
        }
        
        // Validar que el monto sea positivo
        if (!is_numeric($datosRecarga['monto']) || $datosRecarga['monto'] <= 0) {
            return [
                'status' => 'error',
                'message' => 'El monto debe ser un valor positivo'
            ];
        }
        
        // Validar correo electrónico
        $correo = filter_var($datosRecarga['correo'], FILTER_SANITIZE_EMAIL);
        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            return [
                'status' => 'error',
                'message' => 'El correo electrónico no es válido'
            ];
        }
        
        // Validar documento (solo números)
        if (!preg_match('/^[0-9]+$/', $datosRecarga['documento'])) {
            return [
                'status' => 'error',
                'message' => 'El número de documento solo debe contener números'
            ];
        }
        
        // Crear objeto RecargaRetiro
        require_once(__DIR__ . '/../MODELO/Entidades/RecargaRetiro.php');
        $recarga = new RecargaRetiro(
            $datosRecarga['usuario'],
            $datosRecarga['documento'],
            $datosRecarga['correo'],
            $datosRecarga['monto'],
            'recarga'
        );
        
        // Registrar recarga en la base de datos
        $resultado = $this->recargaRetiroPersistencia->registrarRecarga($recarga);
        
        if ($resultado === true) {
            return [
                'status' => 'success',
                'message' => 'Recarga realizada con éxito',
                'monto' => $datosRecarga['monto']
            ];
        } else {
            return [
                'status' => 'error',
                'message' => $resultado
            ];
        }
    }
    
    /**
     * Método para procesar un retiro de saldo
     * @param array $datosRetiro Array con los datos del retiro
     * @return array Respuesta del proceso con estado y mensaje
     */
    public function procesarRetiro($datosRetiro) {
        // Validar datos requeridos
        if (empty($datosRetiro['usuario']) || empty($datosRetiro['documento']) || 
            empty($datosRetiro['correo']) || empty($datosRetiro['monto'])) {
            return [
                'status' => 'error',
                'message' => 'Todos los campos son obligatorios'
            ];
        }
        
        // Validar que el monto sea positivo
        if (!is_numeric($datosRetiro['monto']) || $datosRetiro['monto'] <= 0) {
            return [
                'status' => 'error',
                'message' => 'El monto debe ser un valor positivo'
            ];
        }
        
        // Validar correo electrónico
        $correo = filter_var($datosRetiro['correo'], FILTER_SANITIZE_EMAIL);
        if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
            return [
                'status' => 'error',
                'message' => 'El correo electrónico no es válido'
            ];
        }
        
        // Validar documento (solo números)
        if (!preg_match('/^[0-9]+$/', $datosRetiro['documento'])) {
            return [
                'status' => 'error',
                'message' => 'El número de documento solo debe contener números'
            ];
        }
        
        // Crear objeto RecargaRetiro
        require_once(__DIR__ . '/../MODELO/Entidades/RecargaRetiro.php');
        $retiro = new RecargaRetiro(
            $datosRetiro['usuario'],
            $datosRetiro['documento'],
            $datosRetiro['correo'],
            $datosRetiro['monto'],
            'retiro'
        );
        
        // Registrar retiro en la base de datos
        $resultado = $this->recargaRetiroPersistencia->registrarRetiro($retiro);
        
        if ($resultado === true) {
            return [
                'status' => 'success',
                'message' => 'Retiro procesado con éxito',
                'monto' => $datosRetiro['monto']
            ];
        } else {
            return [
                'status' => 'error',
                'message' => $resultado
            ];
        }
    }
    
    /**
     * Método para obtener el historial de recargas de un usuario
     * @param int $idUsuario ID del usuario
     * @return array Lista de recargas del usuario
     */
    public function obtenerHistorialRecargas($idUsuario) {
        return $this->recargaRetiroPersistencia->listarRecargasPorUsuario($idUsuario);
    }
    
    /**
     * Método para obtener el historial de retiros de un usuario
     * @param int $idUsuario ID del usuario
     * @return array Lista de retiros del usuario
     */
    public function obtenerHistorialRetiros($idUsuario) {
        return $this->recargaRetiroPersistencia->listarRetirosPorUsuario($idUsuario);
    }
    
    /**
     * Método para generar reporte de recargas por fecha
     * @param string $fechaInicio Fecha de inicio formato Y-m-d
     * @param string $fechaFin Fecha de fin formato Y-m-d
     * @return array Lista de recargas en el rango de fechas
     */
    public function generarReporteRecargasPorFecha($fechaInicio, $fechaFin) {
        return $this->recargaRetiroPersistencia->listarRecargasPorFecha($fechaInicio, $fechaFin);
    }
    
    /**
     * Método para generar reporte de retiros por fecha
     * @param string $fechaInicio Fecha de inicio formato Y-m-d
     * @param string $fechaFin Fecha de fin formato Y-m-d
     * @return array Lista de retiros en el rango de fechas
     */
    public function generarReporteRetirosPorFecha($fechaInicio, $fechaFin) {
        return $this->recargaRetiroPersistencia->listarRetirosPorFecha($fechaInicio, $fechaFin);
    }
}
?>