const moment = require('moment');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const FabricaPersistencia = require('../Persistencia/FabricaPersistencia');
const fabricaPersistencia = new FabricaPersistencia();
const MensajePrivado = require('../Modulos/MensajePrivado');
const Evento = require('../Modulos/Evento');
class LogicaEvento {
    PersistenciaEvento = fabricaPersistencia.createPersistencia('persistenciaEvento');
    PersistenciaPersona = fabricaPersistencia.createPersistencia('persistenciaPersona');
    PersistenciaMensaje = fabricaPersistencia.createPersistencia('persistenciaMensaje');
    PersistenciaCalificacion = fabricaPersistencia.createPersistencia('persistenciaCalificacion');
    PersistenciaCategoria = fabricaPersistencia.createPersistencia('persistenciaCategoria');

    constructor() {
        if (!LogicaEvento.instance) {
            LogicaEvento.instance = this;
        }
        return LogicaEvento.instance;
    }
    async buscar(idEvento) {
        return await this.PersistenciaEvento.buscar(idEvento)
    }
    async buscarIdPersona(idPersona) {
        return await this.PersistenciaEvento.buscarIdPersona(idPersona)
    }

    async nuevo(req, res) {
        //Verificar usuario
        var usuario = await this.PersistenciaPersona.buscarIdPersona(req.body.usuario.idPersona);
        if (usuario != null && usuario.estado == true) {

            //Verificar que la categoria exista
            var categoria = await this.PersistenciaCategoria.buscarId(req.body.evento.idCategoriaEvento);
            if (categoria == null || categoria.estado == false) {
                return res.status(403).send({ message: 'Categoria no disponible' });
            } else {
                var evento = new Evento(uuidv4(), req.body.evento.nombre, req.body.evento.descripcion, req.body.evento.latitud,
                    req.body.evento.longitud, req.body.evento.idCategoriaEvento, req.body.evento.icono,
                    req.body.evento.idPersona, req.body.evento.imagen, req.body.evento.sonido, req.body.evento.visual,
                    req.body.evento.duracion, req.body.evento.fechaRecordatorio, req.body.evento.estado, req.body.evento.calificacion,
                    req.body.evento.fechaCreacion);

                const filePath = 'data/uploaded_image' + uuidv4() + '.jpg';
                const base64 = evento.imagen.replace(/^data:image\/\w+;base64,/, '');
                //Se guarda archivo en ruta local en aws
                fs.writeFile(filePath, base64, 'base64', async (err) => {
                    if (err) {
                        return res.status(403).send('Error al guardar imagen');
                    } else {
                        const eventoExiste = await this.PersistenciaEvento.buscarCoordenadas(evento.latitud, evento.longitud)
                        if (eventoExiste == null) {
                            const result = await cloudinary.uploader.upload(filePath, { folder: 'eventos' });
                            const imageLink = result.secure_url;
                            for (var i = 1; i <= evento.duracion; i++) {
                                evento.fechaRecordatorio.push(moment().add(i, 'day').format('YYYY/MM/DD'));
                            }
                            evento.imagen = imageLink;
                            await this.PersistenciaEvento.nuevo(evento);
                            return res.status(200).send({ message: 'Evento creado' });
                        } else {
                            return res.status(403).send({ message: 'El evento ya existe' });
                        }
                    }
                })
            }
        } else {
            return res.status(403).send({ message: 'Error en el usuario' });
        }
    }

    async listar() {
        return await this.PersistenciaEvento.listar()
    }
    async modificar(req, res) {
        //Verificar si el usuario es administrador o autor del evento
        var usuario = await this.PersistenciaPersona.buscarIdPersona(req.body.usuario.idPersona);
        if (usuario != null && usuario.estado == true && (usuario.tipoUsuario == true || usuario.idPersona == req.body.evento.idPersona)) {
            //Verificar que la categoria exista
            var categoria = await this.PersistenciaCategoria.buscarId(req.body.evento.idCategoriaEvento);
            if (categoria == null || categoria.estado == false) {
                return res.status(403).send({ message: 'Categoria no disponible' });
            } else {
                var evento = new Evento(req.body.evento.idEvento, req.body.evento.nombre, req.body.evento.descripcion, req.body.evento.latitud,
                    req.body.evento.longitud, req.body.evento.idCategoriaEvento, req.body.evento.icono,
                    req.body.evento.idPersona, req.body.evento.imagen, req.body.evento.sonido, req.body.evento.visual,
                    req.body.evento.duracion, req.body.evento.fechaRecordatorio, req.body.evento.estado, req.body.evento.calificacion,
                    req.body.evento.fechaCreacion);

                //Notificar evento finalizado
                if (evento.estado == false) {
                    var calificaciones = await this.PersistenciaCalificacion.listar(evento.idEvento);
                    for (const calificacion of calificaciones) {
                        var persona = await this.PersistenciaPersona.buscarIdPersona(calificacion.idPersona);
                        if (persona != null) {
                            var fecha = moment().format("YYYY/MM/DD");
                            var asunto = "Evento:" + evento.nombre + " - finalizado";
                            var cuerpo = "Evento:" + evento.nombre + " Descripcion: " + evento.descripcion + " - finalizado " + fecha;
                            var mensaje = new MensajePrivado(uuidv4(), persona.email, cuerpo, asunto,
                                false, "No-Reply", fecha);
                            await this.PersistenciaMensaje.enviar(mensaje);
                        }
                    }
                }
                //Si se modifico la imagen llega con base64 y se guarda
                //De lo contrario llega con el link del server, la imagen no se guarda
                if (evento.imagen.includes("base64")) {
                    const filePath = 'data/uploaded_image' + uuidv4() + '.jpg';
                    const base64 = evento.imagen.replace(/^data:image\/\w+;base64,/, '');
                    //Se guarda archivo en ruta local en aws
                    fs.writeFile(filePath, base64, 'base64', async (err) => {
                        if (err) {
                            return res.status(403).send('Error al guardar imagen');
                        } else {
                            const result = await cloudinary.uploader.upload(filePath, { folder: 'eventos' });
                            const imageLink = result.secure_url;
                            evento.imagen = imageLink;
                            await this.PersistenciaEvento.modificar(evento);
                            return res.status(200).send({ message: 'Evento modificado' });
                        }
                    })
                } else {
                    await this.PersistenciaEvento.modificar(evento);
                    return res.status(200).send({ message: 'Evento modificado' });
                }
            }
        } else {
            return res.status(403).send({ message: 'Error en el usuario' });
        }
    }

    async listarRecordatorios(usuario) {
        var data = await this.PersistenciaEvento.listarRecordatorios(usuario)
        var recordatorios = [];
        var dateActual = moment().format("YYYY/MM/DD");
        for (var evento of data) {
            var dateCreacion = moment(new Date(evento.fechaCreacion));
            if (dateCreacion < moment().subtract(5, 'd')) {
                evento.estado = false;
                await this.PersistenciaEvento.modificar(evento);
            } else {
                for (var f of evento.fechaRecordatorio) {
                    var dateRecordatorio = moment(new Date(f)).format("YYYY/MM/DD");
                    if (dateActual == dateRecordatorio) {
                        recordatorios.push(evento);
                    }
                }
            } 
        }
        return recordatorios;
    }
}
module.exports = LogicaEvento;