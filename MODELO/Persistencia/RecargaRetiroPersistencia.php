<?php
/**
 * Clase ReportePersistencia
 * Maneja las operaciones de base de datos para los reportes
 */
class ReportePersistencia {
    private $conexion;
    
    /**
     * Constructor de la clase ReportePersistencia
     */
    public function __construct() {
        // Incluir el archivo de conexión
        require_once(__DIR__ . '/../../UTILIDADES/BD_Conexion/conexion.php');
        
        // Obtener la conexión a la base de datos
        $this->conexion = Conexion::obtenerInstancia()->obtenerConexion();
    }
    
    /**
     * Guarda un reporte en la base de datos
     * 
     * @param Reporte $reporte Reporte a guardar
     * @return bool True si se guardó correctamente
     */
    public function guardarReporte($reporte) {
        try {
            // Preparar la consulta SQL
            $sql = "INSERT INTO reportes (id, tipo, fecha_inicio, fecha_fin, fecha_generacion, datos) 
                    VALUES (?, ?, ?, ?, ?, ?)";
            
            // Preparar la sentencia
            $stmt = $this->conexion->prepare($sql);
            
            // Convertir datos a JSON para almacenar
            $datosJSON = json_encode($reporte->getDatos(), JSON_UNESCAPED_UNICODE);
            
            // Vincular parámetros
            $stmt->bind_param(
                "ssssss",
                $reporte->getId(),
                $reporte->getTipo(),
                $reporte->getFechaInicio(),
                $reporte->getFechaFin(),
                $reporte->getFechaGeneracion(),
                $datosJSON
            );
            
            // Ejecutar la consulta
            $resultado = $stmt->execute();
            
            // Cerrar la sentencia
            $stmt->close();
            
            return $resultado;
        } catch (Exception $e) {
            // Registrar el error
            error_log("Error al guardar reporte: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Busca un reporte por su ID
     * 
     * @param string $id ID del reporte a buscar
     * @return Reporte|null Reporte encontrado o null si no existe
     */
    public function buscarReportePorId($id) {
        try {
            // Preparar la consulta SQL
            $sql = "SELECT * FROM reportes WHERE id = ?";
            
            // Preparar la sentencia
            $stmt = $this->conexion->prepare($sql);
            
            // Vincular parámetros
            $stmt->bind_param("s", $id);
            
            // Ejecutar la consulta
            $stmt->execute();
            
            // Obtener el resultado
            $resultado = $stmt->get_result();
            
            // Verificar si hay resultados
            if ($resultado->num_rows > 0) {
                // Obtener los datos
                $datos = $resultado->fetch_assoc();
                
                // Convertir datos JSON a array
                $datos['datos'] = json_decode($datos['datos'], true);
                
                // Cerrar la sentencia
                $stmt->close();
                
                // Crear y devolver el reporte
                return Reporte::fromArray([
                    'id' => $datos['id'],
                    'tipo' => $datos['tipo'],
                    'fechaInicio' => $datos['fecha_inicio'],
                    'fechaFin' => $datos['fecha_fin'],
                    'fechaGeneracion' => $datos['fecha_generacion'],
                    'datos' => $datos['datos']
                ]);
            } else {
                // Cerrar la sentencia
                $stmt->close();
                
                // No se encontró el reporte
                return null;
            }
        } catch (Exception $e) {
            // Registrar el error
            error_log("Error al buscar reporte por ID: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Lista los reportes por tipo
     * 
     * @param string $tipo Tipo de reporte (recargas o retiros)
     * @return array Array de reportes
     */
    public function listarReportesPorTipo($tipo) {
        try {
            // Preparar la consulta SQL
            $sql = "SELECT * FROM reportes WHERE tipo = ? ORDER BY fecha_generacion DESC";
            
            // Preparar la sentencia
            $stmt = $this->conexion->prepare($sql);
            
            // Vincular parámetros
            $stmt->bind_param("s", $tipo);
            
            // Ejecutar la consulta
            $stmt->execute();
            
            // Obtener el resultado
            $resultado = $stmt->get_result();
            
            // Array para almacenar los reportes
            $reportes = [];
            
            // Recorrer los resultados
            while ($datos = $resultado->fetch_assoc()) {
                // Convertir datos JSON a array
                $datos['datos'] = json_decode($datos['datos'], true);
                
                // Crear el reporte y agregarlo al array
                $reportes[] = Reporte::fromArray([
                    'id' => $datos['id'],
                    'tipo' => $datos['tipo'],
                    'fechaInicio' => $datos['fecha_inicio'],
                    'fechaFin' => $datos['fecha_fin'],
                    'fechaGeneracion' => $datos['fecha_generacion'],
                    'datos' => $datos['datos']
                ]);
            }
            
            // Cerrar la sentencia
            $stmt->close();
            
            return $reportes;
        } catch (Exception $e) {
            // Registrar el error
            error_log("Error al listar reportes por tipo: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Lista reportes por rango de fechas
     * 
     * @param string $fechaInicio Fecha inicial en formato Y-m-d
     * @param string $fechaFin Fecha final en formato Y-m-d
     * @return array Array de reportes
     */
    public function listarReportesPorFecha($fechaInicio, $fechaFin) {
        try {
            // Preparar la consulta SQL
            $sql = "SELECT * FROM reportes WHERE fecha_generacion BETWEEN ? AND ? ORDER BY fecha_generacion DESC";
            
            // Preparar la sentencia
            $stmt = $this->conexion->prepare($sql);
            
            // Ajustar fechas para incluir todo el día
            $fechaFinAjustada = $fechaFin . ' 23:59:59';
            
            // Vincular parámetros
            $stmt->bind_param("ss", $fechaInicio, $fechaFinAjustada);
            
            // Ejecutar la consulta
            $stmt->execute();
            
            // Obtener el resultado
            $resultado = $stmt->get_result();
            
            // Array para almacenar los reportes
            $reportes = [];
            
            // Recorrer los resultados
            while ($datos = $resultado->fetch_assoc()) {
                // Convertir datos JSON a array
                $datos['datos'] = json_decode($datos['datos'], true);
                
                // Crear el reporte y agregarlo al array
                $reportes[] = Reporte::fromArray([
                    'id' => $datos['id'],
                    'tipo' => $datos['tipo'],
                    'fechaInicio' => $datos['fecha_inicio'],
                    'fechaFin' => $datos['fecha_fin'],
                    'fechaGeneracion' => $datos['fecha_generacion'],
                    'datos' => $datos['datos']
                ]);
            }
            
            // Cerrar la sentencia
            $stmt->close();
            
            return $reportes;
        } catch (Exception $e) {
            // Registrar el error
            error_log("Error al listar reportes por fecha: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Elimina un reporte por su ID
     * 
     * @param string $id ID del reporte a eliminar
     * @return bool True si se eliminó correctamente
     */
    public function eliminarReporte($id) {
        try {
            // Preparar la consulta SQL
            $sql = "DELETE FROM reportes WHERE id = ?";
            
            // Preparar la sentencia
            $stmt = $this->conexion->prepare($sql);
            
            // Vincular parámetros
            $stmt->bind_param("s", $id);
            
            // Ejecutar la consulta
            $resultado = $stmt->execute();
            
            // Cerrar la sentencia
            $stmt->close();
            
            return $resultado;
        } catch (Exception $e) {
            // Registrar el error
            error_log("Error al eliminar reporte: " . $e->getMessage());
            return false;
        }
    }
}
?>