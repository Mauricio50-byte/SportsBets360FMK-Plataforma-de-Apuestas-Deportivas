<?php
/**
 * Clase Reporte
 * Contiene la estructura de datos para los reportes del sistema
 */
class Reporte {
    private $id;
    private $tipo; // recargas, retiros, usuario, global
    private $fechaInicio;
    private $fechaFin;
    private $idUsuario;
    private $fechaGeneracion;
    private $datos; // Contendrá un array con los datos del reporte

    /**
     * Constructor de la clase Reporte
     * 
     * @param string $tipo Tipo de reporte (recargas, retiros, usuario, global)
     * @param string $fechaInicio Fecha de inicio del reporte (formato Y-m-d)
     * @param string $fechaFin Fecha de fin del reporte (formato Y-m-d)
     * @param int|null $idUsuario ID del usuario para reportes de usuario específico
     */
    public function __construct($tipo, $fechaInicio = null, $fechaFin = null, $idUsuario = null) {
        $this->id = uniqid('REP_', true);
        $this->tipo = $tipo;
        $this->fechaInicio = $fechaInicio ?: date('Y-m-d', strtotime('-30 days'));
        $this->fechaFin = $fechaFin ?: date('Y-m-d');
        $this->idUsuario = $idUsuario;
        $this->fechaGeneracion = date('Y-m-d H:i:s');
        $this->datos = array();
    }

    /**
     * Obtiene el ID del reporte
     * 
     * @return string ID del reporte
     */
    public function getId() {
        return $this->id;
    }

    /**
     * Establece el ID del reporte
     * 
     * @param string $id ID del reporte
     */
    public function setId($id) {
        $this->id = $id;
    }

    /**
     * Obtiene el tipo de reporte
     * 
     * @return string Tipo de reporte
     */
    public function getTipo() {
        return $this->tipo;
    }

    /**
     * Establece el tipo de reporte
     * 
     * @param string $tipo Tipo de reporte
     */
    public function setTipo($tipo) {
        $this->tipo = $tipo;
    }

    /**
     * Obtiene la fecha de inicio del reporte
     * 
     * @return string Fecha de inicio
     */
    public function getFechaInicio() {
        return $this->fechaInicio;
    }

    /**
     * Establece la fecha de inicio del reporte
     * 
     * @param string $fechaInicio Fecha de inicio
     */
    public function setFechaInicio($fechaInicio) {
        $this->fechaInicio = $fechaInicio;
    }

    /**
     * Obtiene la fecha de fin del reporte
     * 
     * @return string Fecha de fin
     */
    public function getFechaFin() {
        return $this->fechaFin;
    }

    /**
     * Establece la fecha de fin del reporte
     * 
     * @param string $fechaFin Fecha de fin
     */
    public function setFechaFin($fechaFin) {
        $this->fechaFin = $fechaFin;
    }

    /**
     * Obtiene el ID del usuario del reporte
     * 
     * @return int|null ID del usuario
     */
    public function getIdUsuario() {
        return $this->idUsuario;
    }

    /**
     * Establece el ID del usuario del reporte
     * 
     * @param int $idUsuario ID del usuario
     */
    public function setIdUsuario($idUsuario) {
        $this->idUsuario = $idUsuario;
    }

    /**
     * Obtiene la fecha de generación del reporte
     * 
     * @return string Fecha de generación
     */
    public function getFechaGeneracion() {
        return $this->fechaGeneracion;
    }

    /**
     * Establece la fecha de generación del reporte
     * 
     * @param string $fechaGeneracion Fecha de generación
     */
    public function setFechaGeneracion($fechaGeneracion) {
        $this->fechaGeneracion = $fechaGeneracion;
    }

    /**
     * Obtiene los datos del reporte
     * 
     * @return array Datos del reporte
     */
    public function getDatos() {
        return $this->datos;
    }

    /**
     * Establece los datos del reporte
     * 
     * @param array $datos Datos del reporte
     */
    public function setDatos($datos) {
        $this->datos = $datos;
    }

    /**
     * Convierte la instancia a un array asociativo
     * 
     * @return array Datos del reporte como array
     */
    public function toArray() {
        return [
            'id' => $this->id,
            'tipo' => $this->tipo,
            'fechaInicio' => $this->fechaInicio,
            'fechaFin' => $this->fechaFin,
            'idUsuario' => $this->idUsuario,
            'fechaGeneracion' => $this->fechaGeneracion,
            'datos' => $this->datos
        ];
    }

    /**
     * Crea una instancia de Reporte a partir de un array
     * 
     * @param array $datos Datos para crear el reporte
     * @return Reporte Nueva instancia
     */
    public static function fromArray($datos) {
        $reporte = new Reporte(
            $datos['tipo'],
            $datos['fechaInicio'] ?? null,
            $datos['fechaFin'] ?? null,
            $datos['idUsuario'] ?? null
        );
        
        if (isset($datos['id'])) {
            $reporte->setId($datos['id']);
        }
        
        if (isset($datos['fechaGeneracion'])) {
            $reporte->setFechaGeneracion($datos['fechaGeneracion']);
        }
        
        if (isset($datos['datos'])) {
            $reporte->setDatos($datos['datos']);
        }
        
        return $reporte;
    }
}
?>