<?php
/**
 * Clase RecargaRetiro - Entidad para representar transacciones de recarga y retiro
 * Adaptada para trabajar con la estructura de la base de datos existente
 */
class RecargaRetiro {
    private $id;
    private $idUsuario;
    private $documentoUsuario;
    private $correoUsuario;
    private $fecha;
    private $monto;
    private $saldo;
    private $tipo; // 'recarga' o 'retiro'
    
    /**
     * Constructor de la clase RecargaRetiro
     * @param string $usuario Nombre de usuario o ID
     * @param string $documento Número de documento del usuario
     * @param string $correo Correo electrónico del usuario
     * @param float $monto Monto de la transacción
     * @param string $tipo Tipo de transacción ('recarga' o 'retiro')
     */
    public function __construct($usuario, $documento, $correo, $monto, $tipo) {
        // Configurar zona horaria por defecto para evitar warnings
        date_default_timezone_set('America/Bogota');
        
        $this->idUsuario = $usuario;
        $this->documentoUsuario = $documento;
        $this->correoUsuario = $correo;
        $this->fecha = date('Y-m-d');
        $this->monto = floatval($monto);
        $this->tipo = strtolower($tipo);
        $this->saldo = 0; // Se calculará al momento de procesar la transacción
    }
    
    /**
     * Obtiene el ID de la transacción
     * @return int ID de la transacción
     */
    public function getId() {
        return $this->id;
    }
    
    /**
     * Establece el ID de la transacción
     * @param int $id ID de la transacción
     */
    public function setId($id) {
        $this->id = $id;
    }
    
    /**
     * Obtiene el ID del usuario
     * @return int ID del usuario
     */
    public function getIdUsuario() {
        return $this->idUsuario;
    }
    
    /**
     * Obtiene el documento del usuario
     * @return string Documento del usuario
     */
    public function getDocumentoUsuario() {
        return $this->documentoUsuario;
    }
    
    /**
     * Obtiene el correo del usuario
     * @return string Correo del usuario
     */
    public function getCorreoUsuario() {
        return $this->correoUsuario;
    }
    
    /**
     * Obtiene la fecha de la transacción
     * @return string Fecha en formato Y-m-d
     */
    public function getFecha() {
        return $this->fecha;
    }
    
    /**
     * Obtiene el monto de la transacción
     * @return float Monto de la transacción
     */
    public function getMonto() {
        return $this->monto;
    }
    
    /**
     * Establece el saldo resultante después de la transacción
     * @param float $saldo Saldo resultante
     */
    public function setSaldo($saldo) {
        $this->saldo = $saldo;
    }
    
    /**
     * Obtiene el saldo resultante después de la transacción
     * @return float Saldo resultante
     */
    public function getSaldo() {
        return $this->saldo;
    }
    
    /**
     * Obtiene el tipo de transacción
     * @return string Tipo de transacción ('recarga' o 'retiro')
     */
    public function getTipo() {
        return $this->tipo;
    }
}
?>