<?php
// Iniciar buffer de salida para evitar "headers already sent"
ob_start();

// Iniciar sesión
session_start();

// Configurar la salida de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); // Reportar todos los errores

// Función para manejar errores de manera controlada
function manejarError($mensaje, $detalle = '') {
    error_log("Error en generar_reporte.php: $mensaje - $detalle");
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => $mensaje]);
    exit;
}

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    manejarError('Método no permitido');
}

// Para depuración, registrar los datos recibidos
error_log("Datos POST recibidos: " . print_r($_POST, true));

// Obtener el tipo de reporte solicitado
$tipoReporte = isset($_POST['tipo_reporte']) ? trim($_POST['tipo_reporte']) : '';

// Verificar que se especificó un tipo de reporte
if (empty($tipoReporte)) {
    manejarError('Tipo de reporte no especificado');
}

// Verificar que el tipo de reporte sea válido (solo recargas o retiros)
if ($tipoReporte !== 'recargas' && $tipoReporte !== 'retiros' && $tipoReporte !== 'exportar_csv') {
    manejarError('Tipo de reporte no válido. Solo se permiten reportes de recargas o retiros');
}

try {
    // Incluir el controlador
    $controladorPath = $_SERVER['DOCUMENT_ROOT'] . '/SportsBets360FMK-Plataforma-de-Apuestas-Deportivas/CONTROLADORES/ControladorReporte.php';
    
    if (!file_exists($controladorPath)) {
        manejarError('Error de ruta', "No se encuentra el archivo: $controladorPath");
    }
    
    require_once $controladorPath;
    
    // Verificar que la clase existe
    if (!class_exists('ControladorReporte')) {
        manejarError('Error al cargar el controlador', 'La clase ControladorReporte no está definida');
    }
    
    // Crear instancia del controlador
    $controlador = new ControladorReporte();
    
    $resultado = null;
    
    // Procesar según el tipo de reporte
    switch ($tipoReporte) {
        case 'recargas':
            $fechaInicio = isset($_POST['fecha_inicio']) ? trim($_POST['fecha_inicio']) : date('Y-m-d', strtotime('-30 days'));
            $fechaFin = isset($_POST['fecha_fin']) ? trim($_POST['fecha_fin']) : date('Y-m-d');
            $resultado = $controlador->generarReporteRecargas($fechaInicio, $fechaFin);
            break;
            
        case 'retiros':
            $fechaInicio = isset($_POST['fecha_inicio']) ? trim($_POST['fecha_inicio']) : date('Y-m-d', strtotime('-30 days'));
            $fechaFin = isset($_POST['fecha_fin']) ? trim($_POST['fecha_fin']) : date('Y-m-d');
            $resultado = $controlador->generarReporteRetiros($fechaInicio, $fechaFin);
            break;
            
        case 'exportar_csv':
            $datosReporte = isset($_POST['datos_reporte']) ? json_decode($_POST['datos_reporte'], true) : null;
            $nombreArchivo = isset($_POST['nombre_archivo']) ? trim($_POST['nombre_archivo']) : 'reporte_' . date('Ymd_His');
            
            if (!$datosReporte) {
                manejarError('No hay datos para exportar');
            }
            
            $rutaArchivo = $controlador->exportarReporteCSV($datosReporte, $nombreArchivo);
            
            if (!$rutaArchivo) {
                manejarError('Error al exportar a CSV');
            }
            
            $resultado = [
                'status' => 'success',
                'message' => 'Reporte exportado con éxito',
                'archivo' => basename($rutaArchivo),
                'ruta_completa' => $rutaArchivo
            ];
            break;
            
        default:
            manejarError('Tipo de reporte no válido');
    }
    
    // Devolver respuesta como JSON
    header('Content-Type: application/json');
    echo json_encode($resultado);
    
} catch (Exception $e) {
    manejarError('Error al generar el reporte', $e->getMessage());
} finally {
    // Liberar el buffer de salida
    ob_end_flush();
}
?>