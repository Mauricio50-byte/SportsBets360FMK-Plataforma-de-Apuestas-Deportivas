<?php
/**
 * Controlador para la generación de reportes
 * Implementa la lógica de negocio para generar reportes de recargas y retiros
 */
class ControladorReporte {
    private $recargaRetiroPersistencia;
    
    /**
     * Constructor del controlador de reportes
     */
    public function __construct() {
        // Inicializar la capa de persistencia de recargas y retiros
        require_once(__DIR__ . '/../MODELO/Persistencia/RecargaRetiroPersistencia.php');
        $this->recargaRetiroPersistencia = new RecargaRetiroPersistencia();
    }
    
    /**
     * Genera un reporte de recargas por rango de fechas
     * 
     * @param string $fechaInicio Fecha inicial en formato Y-m-d
     * @param string $fechaFin Fecha final en formato Y-m-d
     * @return array Datos del reporte de recargas
     */
    public function generarReporteRecargas($fechaInicio, $fechaFin) {
        // Validar el formato de las fechas
        if (!$this->validarFormatoFecha($fechaInicio) || !$this->validarFormatoFecha($fechaFin)) {
            return [
                'status' => 'error',
                'message' => 'Formato de fecha inválido. Use YYYY-MM-DD'
            ];
        }
        
        try {
            // Obtener datos de recargas del período
            $recargas = $this->recargaRetiroPersistencia->listarRecargasPorFecha($fechaInicio, $fechaFin);
            
            // Calcular totales y estadísticas
            $totalMonto = 0;
            $cantidadRecargas = count($recargas);
            
            foreach ($recargas as $recarga) {
                $totalMonto += floatval($recarga['monto']);
            }
            
            return [
                'status' => 'success',
                'recargas' => $recargas,
                'estadisticas' => [
                    'cantidad' => $cantidadRecargas,
                    'totalMonto' => $totalMonto,
                    'promedioMonto' => $cantidadRecargas > 0 ? $totalMonto / $cantidadRecargas : 0
                ],
                'periodo' => [
                    'inicio' => $fechaInicio,
                    'fin' => $fechaFin
                ]
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Error al generar el reporte de recargas: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Genera un reporte de retiros por rango de fechas
     * 
     * @param string $fechaInicio Fecha inicial en formato Y-m-d
     * @param string $fechaFin Fecha final en formato Y-m-d
     * @return array Datos del reporte de retiros
     */
    public function generarReporteRetiros($fechaInicio, $fechaFin) {
        // Validar el formato de las fechas
        if (!$this->validarFormatoFecha($fechaInicio) || !$this->validarFormatoFecha($fechaFin)) {
            return [
                'status' => 'error',
                'message' => 'Formato de fecha inválido. Use YYYY-MM-DD'
            ];
        }
        
        try {
            // Obtener datos de retiros del período
            $retiros = $this->recargaRetiroPersistencia->listarRetirosPorFecha($fechaInicio, $fechaFin);
            
            // Calcular totales y estadísticas
            $totalMonto = 0;
            $cantidadRetiros = count($retiros);
            
            foreach ($retiros as $retiro) {
                $totalMonto += floatval($retiro['monto']);
            }
            
            return [
                'status' => 'success',
                'retiros' => $retiros,
                'estadisticas' => [
                    'cantidad' => $cantidadRetiros,
                    'totalMonto' => $totalMonto,
                    'promedioMonto' => $cantidadRetiros > 0 ? $totalMonto / $cantidadRetiros : 0
                ],
                'periodo' => [
                    'inicio' => $fechaInicio,
                    'fin' => $fechaFin
                ]
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Error al generar el reporte de retiros: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Valida el formato de fecha Y-m-d
     * 
     * @param string $fecha Fecha a validar
     * @return bool True si el formato es válido
     */
    private function validarFormatoFecha($fecha) {
        $format = 'Y-m-d';
        $d = DateTime::createFromFormat($format, $fecha);
        return $d && $d->format($format) === $fecha;
    }
    
    /**
     * Exporta un reporte a formato CSV
     * 
     * @param array $datos Datos del reporte
     * @param string $nombreArchivo Nombre del archivo CSV
     * @return string|bool Ruta del archivo generado o false si hay error
     */
    public function exportarReporteCSV($datos, $nombreArchivo) {
        try {
            $rutaArchivo = __DIR__ . '/../UTILIDADES/BD_Exportada/' . $nombreArchivo . '.csv';
            
            // Abrir archivo para escritura
            $archivo = fopen($rutaArchivo, 'w');
            
            if (!$archivo) {
                return false;
            }
            
            // Si hay registros, escribir encabezados según la estructura
            if (isset($datos['recargas']) && is_array($datos['recargas']) && count($datos['recargas']) > 0) {
                // Encabezados para recargas
                $encabezados = array_keys($datos['recargas'][0]);
                fputcsv($archivo, $encabezados);
                
                // Datos de recargas
                foreach ($datos['recargas'] as $recarga) {
                    fputcsv($archivo, $recarga);
                }
            } elseif (isset($datos['retiros']) && is_array($datos['retiros']) && count($datos['retiros']) > 0) {
                // Encabezados para retiros
                $encabezados = array_keys($datos['retiros'][0]);
                fputcsv($archivo, $encabezados);
                
                // Datos de retiros
                foreach ($datos['retiros'] as $retiro) {
                    fputcsv($archivo, $retiro);
                }
            } else {
                // Estructura no reconocida, guardar información general
                fputcsv($archivo, ['REPORTE', date('Y-m-d H:i:s')]);
                fputcsv($archivo, ['No hay datos para mostrar']);
            }
            
            fclose($archivo);
            return $rutaArchivo;
            
        } catch (Exception $e) {
            error_log("Error al exportar reporte a CSV: " . $e->getMessage());
            return false;
        }
    }
}
?>