const FabricaPersistencia = require('../Persistencia/FabricaPersistencia');
const fabricaPersistencia = new FabricaPersistencia();
const CalificacionEvento = require('../Modulos/CalificacionEvento');
const { v4: uuidv4 } = require('uuid');
class LogicaCalificacion {
    PersistenciaCalificacion = fabricaPersistencia.createPersistencia('persistenciaCalificacion');
    PersistenciaEvento = fabricaPersistencia.createPersistencia('persistenciaEvento');
    PersistenciaPersona = fabricaPersistencia.createPersistencia('persistenciaPersona');
    constructor() {
        if (!LogicaCalificacion.instance) {
            LogicaCalificacion.instance = this;
        }
        return LogicaCalificacion.instance;
    }
    async buscar(idEvento, usuario) {
        return await this.PersistenciaCalificacion.buscar(idEvento, usuario);
    }

    async calificar(req, res) {
        //Verificar el evento
        var evento = await this.PersistenciaEvento.buscar(req.body.calificacionEvento.idEvento);
        if (evento != null) {
            //Verificar el usuario que no sea administrador o autor del evento
            var usuario = await this.PersistenciaPersona.buscarIdPersona(req.body.calificacionEvento.idPersona);
            if (usuario != null && usuario.estado == true && usuario.tipoUsuario == false && usuario.idPersona != evento.idPersona) {

                //Verificar si el usuario ya calificó al evento
                var calificado = await this.PersistenciaCalificacion.buscar(req.body.calificacionEvento.idEvento, req.body.calificacionEvento.idPersona);

                if (calificado.length != 0) {
                    return res.status(403).send({ message: 'El evento ya fue calificado por este usuario' });
                } else {
                    var calificacionEvento = new CalificacionEvento(uuidv4(), req.body.calificacionEvento.idEvento, req.body.calificacionEvento.idPersona,
                        req.body.calificacionEvento.calificacion, req.body.calificacionEvento.fechaCalificacion);

                    await this.PersistenciaCalificacion.calificar(calificacionEvento);
                    var evento = await this.PersistenciaEvento.buscar(calificacionEvento.idEvento);
                    var nuevaCalificacion = 0;
                    if (evento != null) {
                        if (evento.calificacion != 0) {
                            nuevaCalificacion = (evento.calificacion + calificacionEvento.calificacion) / 2;
                        } else {
                            nuevaCalificacion = calificacionEvento.calificacion;
                        }
                        evento.calificacion = nuevaCalificacion;
                        await this.PersistenciaEvento.modificar(evento);
                        return res.status(200).send({ message: 'Evento calificado' });
                    } else {
                        return res.status(403).send({ message: 'Error en el evento' });
                    }
                }
            } else {
                return res.status(403).send({ message: 'Error en el usuario' });
            }
        } else {
            return res.status(403).send({ message: 'Error en el evento' });
        }
    }

    async listar(idEvento) {
        return await this.PersistenciaCalificacion.listar(idEvento);
    }
}
module.exports = LogicaCalificacion;