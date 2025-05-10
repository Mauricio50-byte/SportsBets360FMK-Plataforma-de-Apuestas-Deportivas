<?php
/**
 * Clase que representa las transacciones de recarga y retiro en el sistema
 */
class RecargaRetiro {
// Atributos de la clase
    private $id;
    private $usuario;
    private $documento;
    private $correo;
    private $monto;
    private $fecha;

    public function __construct($usuario, $documento, $correo, $monto, $tipo_transaccion) {
        $this->usuario = $usuario;
        $this->documento = $documento;
        $this->correo = $correo;
        $this->monto = $monto;
        $this->fecha = date('Y-m-d H:i:s');
    }

    // Getters
    public function getUsuario() { return $this->usuario; }
    public function getDocumento() { return $this->documento; }
    public function getCorreo() { return $this->correo; }
    public function getMonto() { return $this->monto; }
    public function getFecha() { return $this->fecha; }
}
?>
