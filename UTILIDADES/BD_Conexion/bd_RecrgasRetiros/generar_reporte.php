<?php
/**
 * Generador de reportes para recargas y retiros
 * Maneja las peticiones AJAX y genera reportes en diferentes formatos
 * Versión compatible con PHP 5.6+
 */

// CONFIGURAR ZONA HORARIA AL INICIO
date_default_timezone_set('America/Bogota'); // Cambia por tu zona horaria específica

// Verificar sesión
session_start();
if (!isset($_SESSION['usuario_id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(array('error' => 'No autorizado'));
    exit;
}

// Configurar headers para respuesta JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Incluir el controlador - RUTA CORREGIDA
require_once(__DIR__ . '/../../../CONTROLADORES/ControladorRecargaRetiro.php');

try {
    $controlador = new ControladorRecargaRetiro();
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validar datos de entrada
        if (!isset($input['tipo']) || !isset($input['fecha_inicio']) || !isset($input['fecha_fin'])) {
            echo json_encode(array(
                'success' => false,
                'error' => 'Faltan parámetros requeridos'
            ));
            exit;
        }
        
        $tipo = trim($input['tipo']);
        $fechaInicio = trim($input['fecha_inicio']);
        $fechaFin = trim($input['fecha_fin']);
        $formato = isset($input['formato']) ? trim($input['formato']) : 'json';
        
        // Validar fechas
        if (!validateDate($fechaInicio) || !validateDate($fechaFin)) {
            echo json_encode(array(
                'success' => false,
                'error' => 'Formato de fecha inválido. Use formato YYYY-MM-DD'
            ));
            exit;
        }
        
        // Validar que la fecha de inicio no sea mayor que la fecha fin
        $timestampInicio = strtotime($fechaInicio);
        $timestampFin = strtotime($fechaFin);
        
        if ($timestampInicio > $timestampFin) {
            echo json_encode(array(
                'success' => false,
                'error' => 'La fecha de inicio no puede ser mayor que la fecha fin'
            ));
            exit;
        }
        
        // Generar reporte según el tipo
        switch ($tipo) {
            case 'recargas':
                $datos = $controlador->generarReporteRecargasPorFecha($fechaInicio, $fechaFin);
                $titulo = 'Reporte de Recargas';
                break;
                
            case 'retiros':
                $datos = $controlador->generarReporteRetirosPorFecha($fechaInicio, $fechaFin);
                $titulo = 'Reporte de Retiros';
                break;
                
            case 'ambos':
                $recargas = $controlador->generarReporteRecargasPorFecha($fechaInicio, $fechaFin);
                $retiros = $controlador->generarReporteRetirosPorFecha($fechaInicio, $fechaFin);
                $datos = array(
                    'recargas' => $recargas ? $recargas : array(),
                    'retiros' => $retiros ? $retiros : array()
                );
                $titulo = 'Reporte Completo de Transacciones';
                break;
                
            default:
                echo json_encode(array(
                    'success' => false,
                    'error' => 'Tipo de reporte no válido. Use: recargas, retiros o ambos'
                ));
                exit;
        }
        
        // Verificar si hay datos
        if ($tipo !== 'ambos' && empty($datos)) {
            echo json_encode(array(
                'success' => true,
                'titulo' => $titulo,
                'fecha_inicio' => $fechaInicio,
                'fecha_fin' => $fechaFin,
                'datos' => array(),
                'resumen' => getEmptyResumen(),
                'total_registros' => 0,
                'mensaje' => 'No se encontraron datos para el período seleccionado'
            ));
            exit;
        }
        
        // Procesar datos para el reporte
        if ($tipo !== 'ambos') {
            $resumen = calcularResumen($datos, $tipo);
        } else {
            $resumen = array(
                'recargas' => calcularResumen($datos['recargas'], 'recargas'),
                'retiros' => calcularResumen($datos['retiros'], 'retiros')
            );
        }
        
        // Responder según el formato solicitado
        switch ($formato) {
            case 'json':
                echo json_encode(array(
                    'success' => true,
                    'titulo' => $titulo,
                    'fecha_inicio' => $fechaInicio,
                    'fecha_fin' => $fechaFin,
                    'datos' => $datos,
                    'resumen' => $resumen,
                    'total_registros' => $tipo !== 'ambos' ? count($datos) : (count($datos['recargas']) + count($datos['retiros']))
                ), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
                break;
                
            case 'csv':
                generarCSV($datos, $tipo, $titulo, $fechaInicio, $fechaFin);
                break;
                
            case 'excel':
                generarExcel($datos, $tipo, $titulo, $fechaInicio, $fechaFin);
                break;
                
            default:
                echo json_encode(array(
                    'success' => false,
                    'error' => 'Formato no soportado. Use: json, csv o excel'
                ));
        }
        
    } else {
        echo json_encode(array(
            'success' => false,
            'error' => 'Método no permitido. Use POST'
        ));
    }
    
} catch (Exception $e) {
    // Log del error (recomendado para producción)
    error_log("Error en generador de reportes: " . $e->getMessage() . " en " . $e->getFile() . " línea " . $e->getLine());
    
    echo json_encode(array(
        'success' => false,
        'error' => 'Error interno del servidor',
        'details' => $e->getMessage(), // Solo para debugging, remover en producción
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ));
}

/**
 * Valida el formato de fecha con manejo mejorado de errores
 */
function validateDate($date, $format = 'Y-m-d') {
    if (empty($date)) {
        return false;
    }
    
    try {
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) === $date;
    } catch (Exception $e) {
        error_log("Error validando fecha '$date': " . $e->getMessage());
        return false;
    }
}

/**
 * Calcula el resumen estadístico de los datos
 */
function calcularResumen($datos, $tipo) {
    if (empty($datos) || !is_array($datos)) {
        return getEmptyResumen();
    }
    
    try {
        $campoMonto = $tipo === 'recargas' ? 'Monto_recarga' : 'Monto_retiro';
        $montos = array();
        $usuarios = array();
        
        foreach ($datos as $item) {
            if (isset($item[$campoMonto]) && is_numeric($item[$campoMonto])) {
                $montos[] = floatval($item[$campoMonto]);
            }
            
            if (isset($item['ID_usuario'])) {
                $usuarios[] = $item['ID_usuario'];
            }
        }
        
        if (empty($montos)) {
            return getEmptyResumen();
        }
        
        return array(
            'total_transacciones' => count($datos),
            'monto_total' => array_sum($montos),
            'monto_promedio' => round(array_sum($montos) / count($montos), 2),
            'monto_maximo' => max($montos),
            'monto_minimo' => min($montos),
            'usuarios_unicos' => count(array_unique($usuarios))
        );
        
    } catch (Exception $e) {
        error_log("Error calculando resumen: " . $e->getMessage());
        return getEmptyResumen();
    }
}

/**
 * Retorna un resumen vacío
 */
function getEmptyResumen() {
    return array(
        'total_transacciones' => 0,
        'monto_total' => 0,
        'monto_promedio' => 0,
        'monto_maximo' => 0,
        'monto_minimo' => 0,
        'usuarios_unicos' => 0
    );
}

/**
 * Genera archivo CSV con mejor manejo de errores
 */
function generarCSV($datos, $tipo, $titulo, $fechaInicio, $fechaFin) {
    try {
        $filename = sanitizeFilename(strtolower(str_replace(' ', '_', $titulo)) . '_' . $fechaInicio . '_a_' . $fechaFin . '.csv');
        
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Cache-Control: max-age=0');
        
        $output = fopen('php://output', 'w');
        
        if (!$output) {
            throw new Exception('No se pudo crear el archivo CSV');
        }
        
        // BOM para UTF-8
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
        
        if ($tipo === 'ambos') {
            // Header para reporte combinado
            fputcsv($output, array('Tipo', 'ID Usuario', 'Nombre', 'Apellido', 'Documento', 'Correo', 'Fecha', 'Monto', 'Saldo'));
            
            // Datos de recargas
            if (!empty($datos['recargas'])) {
                foreach ($datos['recargas'] as $recarga) {
                    fputcsv($output, array(
                        'Recarga',
                        isset($recarga['ID_usuario']) ? $recarga['ID_usuario'] : '',
                        isset($recarga['nombre']) ? $recarga['nombre'] : '',
                        isset($recarga['apellido']) ? $recarga['apellido'] : '',
                        isset($recarga['Documento_usuario']) ? $recarga['Documento_usuario'] : '',
                        isset($recarga['Correo_usuario']) ? $recarga['Correo_usuario'] : '',
                        isset($recarga['Fecha_recarga']) ? $recarga['Fecha_recarga'] : '',
                        isset($recarga['Monto_recarga']) ? $recarga['Monto_recarga'] : 0,
                        isset($recarga['Saldo']) ? $recarga['Saldo'] : 0
                    ));
                }
            }
            
            // Datos de retiros
            if (!empty($datos['retiros'])) {
                foreach ($datos['retiros'] as $retiro) {
                    fputcsv($output, array(
                        'Retiro',
                        isset($retiro['ID_usuario']) ? $retiro['ID_usuario'] : '',
                        isset($retiro['nombre']) ? $retiro['nombre'] : '',
                        isset($retiro['apellido']) ? $retiro['apellido'] : '',
                        isset($retiro['Documento_usuario']) ? $retiro['Documento_usuario'] : '',
                        isset($retiro['Correo_usuario']) ? $retiro['Correo_usuario'] : '',
                        isset($retiro['Fecha_retiro']) ? $retiro['Fecha_retiro'] : '',
                        isset($retiro['Monto_retiro']) ? $retiro['Monto_retiro'] : 0,
                        isset($retiro['Saldo']) ? $retiro['Saldo'] : 0
                    ));
                }
            }
        } else {
            // Header específico
            if ($tipo === 'recargas') {
                fputcsv($output, array('ID Usuario', 'Nombre', 'Apellido', 'Documento', 'Correo', 'Fecha Recarga', 'Monto Recarga', 'Saldo'));
                if (!empty($datos)) {
                    foreach ($datos as $item) {
                        fputcsv($output, array(
                            isset($item['ID_usuario']) ? $item['ID_usuario'] : '',
                            isset($item['nombre']) ? $item['nombre'] : '',
                            isset($item['apellido']) ? $item['apellido'] : '',
                            isset($item['Documento_usuario']) ? $item['Documento_usuario'] : '',
                            isset($item['Correo_usuario']) ? $item['Correo_usuario'] : '',
                            isset($item['Fecha_recarga']) ? $item['Fecha_recarga'] : '',
                            isset($item['Monto_recarga']) ? $item['Monto_recarga'] : 0,
                            isset($item['Saldo']) ? $item['Saldo'] : 0
                        ));
                    }
                }
            } else {
                fputcsv($output, array('ID Usuario', 'Nombre', 'Apellido', 'Documento', 'Correo', 'Fecha Retiro', 'Monto Retiro', 'Saldo'));
                if (!empty($datos)) {
                    foreach ($datos as $item) {
                        fputcsv($output, array(
                            isset($item['ID_usuario']) ? $item['ID_usuario'] : '',
                            isset($item['nombre']) ? $item['nombre'] : '',
                            isset($item['apellido']) ? $item['apellido'] : '',
                            isset($item['Documento_usuario']) ? $item['Documento_usuario'] : '',
                            isset($item['Correo_usuario']) ? $item['Correo_usuario'] : '',
                            isset($item['Fecha_retiro']) ? $item['Fecha_retiro'] : '',
                            isset($item['Monto_retiro']) ? $item['Monto_retiro'] : 0,
                            isset($item['Saldo']) ? $item['Saldo'] : 0
                        ));
                    }
                }
            }
        }
        
        fclose($output);
        
    } catch (Exception $e) {
        error_log("Error generando CSV: " . $e->getMessage());
        header('Content-Type: application/json');
        echo json_encode(array(
            'success' => false,
            'error' => 'Error generando archivo CSV: ' . $e->getMessage()
        ));
    }
}

/**
 * Genera archivo Excel (requiere PhpSpreadsheet)
 * Esta función es básica, se puede mejorar instalando PhpSpreadsheet
 */
function generarExcel($datos, $tipo, $titulo, $fechaInicio, $fechaFin) {
    try {
        // Por ahora, generamos un CSV con extensión .xls
        // Para Excel real, se necesitaría PhpSpreadsheet
        $filename = sanitizeFilename(strtolower(str_replace(' ', '_', $titulo)) . '_' . $fechaInicio . '_a_' . $fechaFin . '.xls');
        
        header('Content-Type: application/vnd.ms-excel; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Cache-Control: max-age=0');
        
        generarCSV($datos, $tipo, $titulo, $fechaInicio, $fechaFin);
        
    } catch (Exception $e) {
        error_log("Error generando Excel: " . $e->getMessage());
        header('Content-Type: application/json');
        echo json_encode(array(
            'success' => false,
            'error' => 'Error generando archivo Excel: ' . $e->getMessage()
        ));
    }
}

/**
 * Sanitiza nombres de archivos
 */
function sanitizeFilename($filename) {
    // Remover caracteres peligrosos
    $filename = preg_replace('/[^a-zA-Z0-9._-]/', '_', $filename);
    // Limitar longitud
    $filename = substr($filename, 0, 100);
    return $filename;
}
?>