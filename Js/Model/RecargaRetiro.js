class RecargaRetiro {
    constructor(usuario = null, saldo = 0, saldoRecargado = 0, saldoRetirado = 0) {
        this.id_recarga = RecargaRetiro.generarIdRecarga();
        this.id_retiro = RecargaRetiro.generarIdRetiro();
        this.usuario = usuario;
        this.saldo = saldo;
        this.saldoRecargado = saldoRecargado;
        this.saldoRetirado = saldoRetirado;
        this.fecha = new Date();
    }

    // Getters
    getUsuario() { return this.usuario; }
    getSaldo() { return this.saldo; }
    getSaldoRecargado() { return this.saldoRecargado; }
    getSaldoRetirado() { return this.saldoRetirado; }
    getFecha() { return this.fecha; }

    // Setters
    setUsuario(usuario) { this.usuario = usuario; }
    setSaldo(saldo) { this.saldo = saldo; }
    setSaldoRecargado(saldoRecargado) { this.saldoRecargado = saldoRecargado; }
    setSaldoRetirado(saldoRetirado) { this.saldoRetirado = saldoRetirado; }

    // Método estático para generar IDs únicos
    static generarIdRecarga() {
        RecargaRetiro.contadorRecarga = (RecargaRetiro.contadorRecarga || 0) + 1;
        return RecargaRetiro.contadorRecarga;
    }

    static generarIdRetiro() {
        RecargaRetiro.contadorRetiro = (RecargaRetiro.contadorRetiro || 0) + 1;
        return RecargaRetiro.contadorRetiro;
    }
}

// Almacenamiento estático
RecargaRetiro.recarga_retiroBD = {};
RecargaRetiro.contadorRecarga = 0;
RecargaRetiro.contadorRetiro = 0;