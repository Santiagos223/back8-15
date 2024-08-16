const Mensaje = require('./Mensaje');

class MensajePrivado extends Mensaje {
    constructor(idMensajePrivado, receptor, cuerpo, asunto, leido, emisor, fechaRecepcion) {
        super(cuerpo)
        this.idMensajePrivado = idMensajePrivado;
        this.receptor = receptor;
        this.asunto = asunto;
        this.leido = Boolean(leido);
        this.emisor = emisor;
        this.fechaRecepcion = fechaRecepcion;
    }
}

module.exports = MensajePrivado;