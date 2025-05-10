<?php
/**
 * Clase que representa la entidad Usuario en el sistema
 */
class Usuario {
    private $id;
    private $nombre;
    private $apellido;
    private $sexo;
    private $tipoDocumento;
    private $numeroDocumento;
    private $telefono;
    private $correo;
    private $contrasena;
    private $saldo;
    private $fechaRegistro;
    private $estado;

    /**
     * Constructor de la clase Usuario
     */
    public function __construct() {
        // Constructor vacío para permitir inicialización flexible
    }

    // Getters y Setters

    public function getId() {
        return $this->id;
    }

    public function setId($id) {
        $this->id = $id;
        return $this;
    }

    public function getNombre() {
        return $this->nombre;
    }

    public function setNombre($nombre) {
        $this->nombre = $nombre;
        return $this;
    }

    public function getApellido() {
        return $this->apellido;
    }

    public function setApellido($apellido) {
        $this->apellido = $apellido;
        return $this;
    }

    public function getSexo() {
        return $this->sexo;
    }

    public function setSexo($sexo) {
        $this->sexo = $sexo;
        return $this;
    }

    public function getTipoDocumento() {
        return $this->tipoDocumento;
    }

    public function setTipoDocumento($tipoDocumento) {
        $this->tipoDocumento = $tipoDocumento;
        return $this;
    }

    public function getNumeroDocumento() {
        return $this->numeroDocumento;
    }

    public function setNumeroDocumento($numeroDocumento) {
        $this->numeroDocumento = $numeroDocumento;
        return $this;
    }

    public function getTelefono() {
        return $this->telefono;
    }

    public function setTelefono($telefono) {
        $this->telefono = $telefono;
        return $this;
    }

    public function getCorreo() {
        return $this->correo;
    }

    public function setCorreo($correo) {
        $this->correo = $correo;
        return $this;
    }

    public function getContrasena() {
        return $this->contrasena;
    }

    public function setContrasena($contrasena) {
        $this->contrasena = $contrasena;
        return $this;
    }

    public function getSaldo() {
        return $this->saldo;
    }

    public function setSaldo($saldo) {
        $this->saldo = $saldo;
        return $this;
    }

    public function getFechaRegistro() {
        return $this->fechaRegistro;
    }

    public function setFechaRegistro($fechaRegistro) {
        $this->fechaRegistro = $fechaRegistro;
        return $this;
    }

    public function getEstado() {
        return $this->estado;
    }

    public function setEstado($estado) {
        $this->estado = $estado;
        return $this;
    }

    /**
     * Método toString para depuración
     */
    public function __toString() {
        return "Usuario {id=$this->id, nombre=$this->nombre, apellido=$this->apellido, " .
               "documento=$this->tipoDocumento $this->numeroDocumento, correo=$this->correo, " .
               "saldo=$this->saldo, estado=$this->estado}";
    }
}
?>