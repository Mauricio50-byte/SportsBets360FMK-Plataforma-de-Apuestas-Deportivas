<?php
/**
 * Clase de conexión a la base de datos MySQL
 * Implementa el patrón Singleton para asegurar una única instancia de conexión
 */
class Conexion {
    private static $instancia;
    private $conexion;
    private $host = "localhost";
    private $db = "bd_pltf_apuestas";
    private $usuario = "root";
    private $password = "root";
    private $charset = "utf8mb4";

    /**
     * Constructor privado para evitar crear nuevas instancias directamente
     */
    private function __construct() {
        try {
            $dsn = "mysql:host={$this->host};port=3306;dbname={$this->db};charset={$this->charset}";
            $opciones = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ];
            
            $this->conexion = new PDO($dsn, $this->usuario, $this->password, $opciones);
            
        } catch (PDOException $e) {
            die("Error de conexión: " . $e->getMessage());
        }
    }

    /**
     * Método para obtener la instancia única de conexión
     * @return Conexion
     */
    public static function obtenerInstancia() {
        if (!isset(self::$instancia)) {
            self::$instancia = new self();
        }
        return self::$instancia;
    }

    /**
     * Obtiene la conexión PDO
     * @return PDO
     */
    public function obtenerConexion() {
        return $this->conexion;
    }

    /**
     * Ejecuta una consulta preparada y devuelve todos los resultados
     * @param string $sql Consulta SQL
     * @param array $parametros Parámetros para la consulta
     * @return array Resultados de la consulta
     */
    public function ejecutarConsulta($sql, $parametros = []) {
        try {
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute($parametros);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            echo "Error en la consulta: " . $e->getMessage();
            return [];
        }
    }

    /**
     * Ejecuta una consulta INSERT, UPDATE o DELETE
     * @param string $sql Consulta SQL
     * @param array $parametros Parámetros para la consulta
     * @return int Número de filas afectadas
     */
    public function ejecutarActualizacion($sql, $parametros = []) {
        try {
            $stmt = $this->conexion->prepare($sql);
            $stmt->execute($parametros);
            return $stmt->rowCount();
        } catch (PDOException $e) {
            echo "Error en la actualización: " . $e->getMessage();
            return 0;
        }
    }

    /**
     * Inicia una transacción
     */
    public function iniciarTransaccion() {
        $this->conexion->beginTransaction();
    }

    /**
     * Confirma una transacción
     */
    public function confirmarTransaccion() {
        $this->conexion->commit();
    }

    /**
     * Deshace una transacción
     */
    public function deshacerTransaccion() {
        $this->conexion->rollBack();
    }

    /**
     * Obtiene el último ID insertado
     * @return string El último ID insertado
     */
    public function obtenerUltimoId() {
        return $this->conexion->lastInsertId();
    }
}
?>