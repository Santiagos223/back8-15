const Mensaje = require('./Mensaje');
class MensajePublico extends Mensaje {
    constructor(idMensajePublico, cuerpo, idPersona, fechaEnvio) {
        super(cuerpo)
        this.idMensajePublico = idMensajePublico;
        this.idPersona = idPersona;
        this.fechaEnvio = fechaEnvio;
    }
}
module.exports = MensajePublico;