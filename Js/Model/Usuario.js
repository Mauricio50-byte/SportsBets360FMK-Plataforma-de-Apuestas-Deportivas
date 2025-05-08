class Usuario {
    constructor(nombre = "", apellido = "", sexo = "", tipo_documento = "", documento = "", 
        telefono = "", correo = "", contraseña = "") {
            
        this.nombre = nombre;
        this.apellidos = apellido;
        this.sexo = sexo;
        this.tipo_documento = tipo_documento;
        this.documento = documento;
        this.telefono = telefono;
        this.correo = correo;
        this.contraseña = contraseña;
    }

    // Getters
    getNombre() { return this.nombre; }
    getApellidos() { return this.apellido; }
    getSexo() { return this.sexo; }
    getTipoDocumento() { return this.tipo_documento; } 
    getDocumento() { return this.documento; }
    getTelefono() { return this.telefono; }
    getCorreo() { return this.correo; }
    getContraseña() { return this.contraseña; }

    // Setters
    setNombre(nombre) { this.nombre = nombre; }
    setApellidos(apellidos) { this.apellido = apellido; }
    setSexo(sexo) { this.sexo = sexo; }
    setTipoDocumento(tipo_documento) { this.tipo_documento = tipo_documento; }
    setDocumento(documento) { this.documento = documento; }
    setTelefono(telefono) { this.telefono = telefono; }
    setCorreo(correo) { this.correo = correo; }
    setContraseña(contraseña) { this.contraseña = contraseña; }

    // Método para el nombre completo
    getNombreCompleto() {
        return `${this.nombre} ${this.apellido}`;
    }
}

// Almacenamiento estático de los usuarios en memoria
Usuario.usuariosBD = {};
Usuario.recargar_retirar = [];
