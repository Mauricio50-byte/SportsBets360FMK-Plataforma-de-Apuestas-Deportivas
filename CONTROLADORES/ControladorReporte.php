<?php
/**
 * Controlador para la generación de reportes
 * Implementa la lógica de negocio para generar reportes de recargas, retiros y usuarios
 */
class ControladorReporte {
    private $recargaRetiroPersistencia;
    private $usuarioPersistencia;
    
    /**
     * Constructor del controlador de reportes
     */
    public function __construct() {
        // Inicializar la capa de persistencia de recargas y retiros
        require_once(__DIR__ . '/../MODELO/Persistencia/RecargaRetiroPersistencia.php');
        $this->recargaRetiroPersistencia = new RecargaRetiroPersistencia();
        
        // Inicializar la persistencia de usuarios
        require_once(__DIR__ . '/../MODELO/Persistencia/UsuarioPersistencia.php');
        $this->usuarioPersistencia = new UsuarioPersistencia();
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
     * Genera un reporte de usuario con sus transacciones
     * 
     * @param int|string $idUsuario ID o nombre del usuario
     * @return array Datos del reporte de usuario
     */
    public function generarReporteUsuario($idUsuario) {
        try {
            // Si es un nombre de usuario en lugar de ID, obtener el ID
            if (!is_numeric($idUsuario)) {
                $usuarioInfo = $this->usuarioPersistencia->buscarUsuarioPorNombre($idUsuario);
                if ($usuarioInfo && isset($usuarioInfo['ID'])) {
                    $idUsuario = $usuarioInfo['ID'];
                } else {
                    return [
                        'status' => 'error',
                        'message' => 'Usuario no encontrado'
                    ];
                }
            }
            
            // Obtener datos del usuario
            $usuario = $this->usuarioPersistencia->obtenerUsuarioPorId($idUsuario);
            
            if (!$usuario) {
                return [
                    'status' => 'error',
                    'message' => 'Usuario no encontrado'
                ];
            }
            
            // Obtener historial de recargas
            $recargas = $this->recargaRetiroPersistencia->listarRecargasPorUsuario($idUsuario);
            
            // Obtener historial de retiros
            $retiros = $this->recargaRetiroPersistencia->listarRetirosPorUsuario($idUsuario);
            
            // Calcular estadísticas de recargas
            $totalRecargas = 0;
            $cantidadRecargas = count($recargas);
            foreach ($recargas as $recarga) {
                $totalRecargas += floatval($recarga['monto']);
            }
            
            // Calcular estadísticas de retiros
            $totalRetiros = 0;
            $cantidadRetiros = count($retiros);
            foreach ($retiros as $retiro) {
                $totalRetiros += floatval($retiro['monto']);
            }
            
            return [
                'status' => 'success',
                'usuario' => $usuario,
                'recargas' => [
                    'datos' => $recargas,
                    'estadisticas' => [
                        'cantidad' => $cantidadRecargas,
                        'totalMonto' => $totalRecargas,
                        'promedioMonto' => $cantidadRecargas > 0 ? $totalRecargas / $cantidadRecargas : 0
                    ]
                ],
                'retiros' => [
                    'datos' => $retiros,
                    'estadisticas' => [
                        'cantidad' => $cantidadRetiros,
                        'totalMonto' => $totalRetiros,
                        'promedioMonto' => $cantidadRetiros > 0 ? $totalRetiros / $cantidadRetiros : 0
                    ]
                ],
                'balance' => [
                    'totalRecargas' => $totalRecargas,
                    'totalRetiros' => $totalRetiros,
                    'balanceNeto' => $totalRecargas - $totalRetiros
                ]
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Error al generar el reporte de usuario: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Genera un reporte global de transacciones del sistema
     * 
     * @param string $fechaInicio Fecha inicial en formato Y-m-d
     * @param string $fechaFin Fecha final en formato Y-m-d
     * @return array Datos del reporte global
     */
    public function generarReporteGlobal($fechaInicio, $fechaFin) {
        // Validar el formato de las fechas
        if (!$this->validarFormatoFecha($fechaInicio) || !$this->validarFormatoFecha($fechaFin)) {
            return [
                'status' => 'error',
                'message' => 'Formato de fecha inválido. Use YYYY-MM-DD'
            ];
        }
        
        try {
            // Obtener reportes de recargas y retiros
            $reporteRecargas = $this->generarReporteRecargas($fechaInicio, $fechaFin);
            $reporteRetiros = $this->generarReporteRetiros($fechaInicio, $fechaFin);
            
            if ($reporteRecargas['status'] === 'error' || $reporteRetiros['status'] === 'error') {
                return [
                    'status' => 'error',
                    'message' => 'Error al generar el reporte global'
                ];
            }
            
            // Obtener estadísticas globales
            $totalRecargas = $reporteRecargas['estadisticas']['totalMonto'] ?? 0;
            $totalRetiros = $reporteRetiros['estadisticas']['totalMonto'] ?? 0;
            $balanceNeto = $totalRecargas - $totalRetiros;
            
            return [
                'status' => 'success',
                'periodo' => [
                    'inicio' => $fechaInicio,
                    'fin' => $fechaFin
                ],
                'recargas' => $reporteRecargas,
                'retiros' => $reporteRetiros,
                'estadisticasGlobales' => [
                    'totalRecargas' => $totalRecargas,
                    'totalRetiros' => $totalRetiros,
                    'balanceNeto' => $balanceNeto,
                    'cantidadRecargas' => $reporteRecargas['estadisticas']['cantidad'] ?? 0,
                    'cantidadRetiros' => $reporteRetiros['estadisticas']['cantidad'] ?? 0
                ]
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Error al generar el reporte global: ' . $e->getMessage()
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
            } elseif (isset($datos['usuario']) && is_array($datos['usuario'])) {
                // Reporte de usuario
                // Encabezados para datos de usuario
                $encabezadosUsuario = array_keys($datos['usuario']);
                fputcsv($archivo, $encabezadosUsuario);
                
                // Datos de usuario
                fputcsv($archivo, $datos['usuario']);
                
                // Separador
                fputcsv($archivo, ['']);
                
                // Estadísticas de recargas
                fputcsv($archivo, ['RECARGAS']);
                
                if (isset($datos['recargas']['datos']) && count($datos['recargas']['datos']) > 0) {
                    $encabezadosRecargas = array_keys($datos['recargas']['datos'][0]);
                    fputcsv($archivo, $encabezadosRecargas);
                    
                    foreach ($datos['recargas']['datos'] as $recarga) {
                        fputcsv($archivo, $recarga);
                    }
                }
                
                // Separador
                fputcsv($archivo, ['']);
                
                // Estadísticas de retiros
                fputcsv($archivo, ['RETIROS']);
                
                if (isset($datos['retiros']['datos']) && count($datos['retiros']['datos']) > 0) {
                    $encabezadosRetiros = array_keys($datos['retiros']['datos'][0]);
                    fputcsv($archivo, $encabezadosRetiros);
                    
                    foreach ($datos['retiros']['datos'] as $retiro) {
                        fputcsv($archivo, $retiro);
                    }
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