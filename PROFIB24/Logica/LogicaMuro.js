const FabricaPersistencia = require('../Persistencia/FabricaPersistencia');
const fabricaPersistencia = new FabricaPersistencia();
const MensajePublico = require('../Modulos/MensajePublico');
const { v4: uuidv4 } = require('uuid');
class LogicaMuro {
    PersistenciaMuro = fabricaPersistencia.createPersistencia('persistenciaMuro');
    PersistenciaPersona = fabricaPersistencia.createPersistencia('persistenciaPersona');
    constructor() {
        if (!LogicaMuro.instance) {
            LogicaMuro.instance = this;
        }
        return LogicaMuro.instance;
    }
    async nuevo(req, res) {
        var usuario = await this.PersistenciaPersona.buscarIdPersona(req.body.usuario.idPersona);
        if (usuario != null && usuario.estado == true) {
            var mensaje = new MensajePublico(uuidv4(), req.body.mensaje.cuerpo, req.body.mensaje.idPersona, req.body.mensaje.fechaEnvio);
            return await this.PersistenciaMuro.nuevo(mensaje)
        } else {
            return res.status(403).send({ message: 'Error en el usuario' });
        }
    }
    async listar() {
        return await this.PersistenciaMuro.listar()
    }

    async eliminar(req, res) {
        var usuario = await this.PersistenciaPersona.buscarIdPersona(req.body.usuario.idPersona);
        if (usuario != null && usuario.estado == true && usuario.tipoUsuario == true) {
            await this.PersistenciaMuro.eliminar(req.body.idMensajePublico)
        } else {
            return res.status(403).send({ message: 'Error en el usuario' });
        }
    }
}
module.exports = LogicaMuro;