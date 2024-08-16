class Persona {
    constructor(idPersona, nombre, email, pass, tipoUsuario, idioma, modo, sonidoNotificacion, notificacion, estado, verificado, fechaAlta) {
        this.idPersona = idPersona;
        this.nombre = nombre;
        this.email = email;
        this.pass = pass;
        this.tipoUsuario = Boolean(tipoUsuario);
        this.idioma = idioma;
        this.modo = modo;
        this.sonidoNotificacion = sonidoNotificacion;
        this.notificacion = Boolean(notificacion);
        this.estado = Boolean(estado);
        this.verificado = Boolean(verificado);
        this.fechaAlta = fechaAlta;
    }
}

module.exports = Persona;