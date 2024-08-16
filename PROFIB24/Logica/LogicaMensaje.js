const FabricaPersistencia = require('../Persistencia/FabricaPersistencia');
const fabricaPersistencia = new FabricaPersistencia();
const MensajePrivado = require('../Modulos/MensajePrivado');
const { v4: uuidv4 } = require('uuid');
class LogicaMensaje {
    PersistenciaMensaje = fabricaPersistencia.createPersistencia('persistenciaMensaje');
    PersistenciaPersona = fabricaPersistencia.createPersistencia('persistenciaPersona');

    constructor() {
        if (!LogicaMensaje.instance) {
            LogicaMensaje.instance = this;
        }
        return LogicaMensaje.instance;
    }
    async enviar(req, res) {
        var usuario = await this.PersistenciaPersona.buscarIdPersona(req.body.usuario.idPersona);
        if (usuario != null && usuario.estado == true) {

            //Verificar que el usuario receptor del mensaje exista
            const persona = await this.PersistenciaPersona.buscar(req.body.mensaje.receptor)

            if (persona.length != 0) {
                var mensaje = new MensajePrivado(uuidv4(), req.body.mensaje.receptor, req.body.mensaje.cuerpo, req.body.mensaje.asunto,
                    req.body.mensaje.leido, req.body.mensaje.emisor, req.body.mensaje.fechaRecepcion);
                await this.PersistenciaMensaje.enviar(mensaje);
                return res.status(200).send({ message: 'Mensaje enviado' });
            } else {
                //Respuesta automatica noReply
                await this.PersistenciaMensaje.respuestaAutomatica(req.body.mensaje.receptor, req.body.mensaje.emisor);
                return res.status(403).send({ message: 'El destinatario no existe' });
            }
        } else {
            return res.status(403).send({ message: 'Error en el usuario' });
        }
    }
    async listar(usuario) {
        return await this.PersistenciaMensaje.listar(usuario)
    }

    async modificar(req, res) {
        var usuario = await this.PersistenciaPersona.buscarIdPersona(req.body.usuario.idPersona);
        if (usuario != null && usuario.estado == true) {
            var mensaje = new MensajePrivado(req.body.mensaje.idMensajePrivado, req.body.mensaje.receptor, req.body.mensaje.cuerpo, req.body.mensaje.asunto,
                req.body.mensaje.leido, req.body.mensaje.emisor, req.body.mensaje.fechaRecepcion);
            return await this.PersistenciaMensaje.modificar(mensaje);
        } else {
            return res.status(403).send({ message: 'Error en el usuario' });
        }
    }

    async eliminar(req, res) {
        var usuario = await this.PersistenciaPersona.buscarIdPersona(req.body.usuario.idPersona);
        if (usuario != null && usuario.estado == true) {
            return await this.PersistenciaMensaje.eliminar(req.body.mensaje.idMensajePrivado)
        } else {
            return res.status(403).send({ message: 'Error en el usuario' });
        }
    }
}
module.exports = LogicaMensaje;