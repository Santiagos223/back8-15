const nodemailer = require('nodemailer');
const uuid = require('short-uuid');
const config = require('../Persistencia/Config');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const FabricaPersistencia = require('../Persistencia/FabricaPersistencia');
const fabricaPersistencia = new FabricaPersistencia();
const Persona = require('../Modulos/Persona');
class LogicaPersona {
    PersistenciaPersona = fabricaPersistencia.createPersistencia('persistenciaPersona');
    PersistenciaEvento = fabricaPersistencia.createPersistencia('persistenciaEvento');
    PersistenciaMensaje = fabricaPersistencia.createPersistencia('persistenciaMensaje');
    PersistenciaLog = fabricaPersistencia.createPersistencia('persistenciaLog');

    constructor() {
        if (!LogicaPersona.instance) {
            LogicaPersona.instance = this;
        }
        return LogicaPersona.instance;
    }

    async login(email,pass) {
        const usuarioEncontrado = await this.PersistenciaPersona.login(email,pass);

        if (usuarioEncontrado != null && usuarioEncontrado.verificado == false) {
            //La cuenta del usuario cambia a verificada si es la primera vez que ingresa
            usuarioEncontrado.verificado = true;
            await this.PersistenciaPersona.modificar(usuarioEncontrado);
        }
        return usuarioEncontrado;
    }

    async buscar(email) {
        return await this.PersistenciaPersona.buscar(email);
    }

    async buscarIdPersona(idPersona) {
        return await this.PersistenciaPersona.buscarIdPersona(idPersona);
    }

    async alta(req, res) {
        var usuario = await this.PersistenciaPersona.buscarIdPersona(req.body.usuario.idPersona);
        if (usuario != null && usuario.estado == true && usuario.tipoUsuario == true) {

            //Verificar que no exista una cuenta con el mail ingresado
            var existe = await this.PersistenciaPersona.buscar(req.body.nuevoUsuario.email);
            if (existe.length != 0) {
                if (existe[0].estado == true) {
                    return res.status(403).send({ message: 'El usuario ya existe' });
                } else {
                    //Existe con baja lógica
                    existe[0].estado = true;
                    await this.PersistenciaPersona.modificar(existe[0]);
                    return res.status(200).send({ message: 'Usuario creado' });
                }
            } else {
                var persona = new Persona(uuidv4(), req.body.nuevoUsuario.nombre, req.body.nuevoUsuario.email, req.body.nuevoUsuario.pass, req.body.nuevoUsuario.tipoUsuario,
                    req.body.nuevoUsuario.idioma, req.body.nuevoUsuario.modo, req.body.nuevoUsuario.sonidoNotificacion, req.body.nuevoUsuario.notificacion,
                    req.body.nuevoUsuario.estado, req.body.nuevoUsuario.verificado, req.body.nuevoUsuario.fechaAlta);
                await this.PersistenciaPersona.alta(persona);
                return res.status(200).send({ message: 'Usuario creado' });
            }
        } else {
            return res.status(403).send({ message: 'Error en el usuario' });
        }
    }
    async listar() {
        return await this.PersistenciaPersona.listar()
    }

    async modificar(req, res) {
        var usuario = await this.PersistenciaPersona.buscarIdPersona(req.body.usuario.idPersona);
        if (usuario != null && usuario.estado == true && (usuario.tipoUsuario == true || req.body.modificarUsuario.idPersona == usuario.idPersona)) {
            //Verificar que el usuario exista
            const existe = await this.PersistenciaPersona.buscarIdPersona(req.body.modificarUsuario.idPersona);
            if (existe != null) {
                var persona = new Persona(req.body.modificarUsuario.idPersona, req.body.modificarUsuario.nombre, req.body.modificarUsuario.email, req.body.modificarUsuario.pass, req.body.modificarUsuario.tipoUsuario,
                    req.body.modificarUsuario.idioma, req.body.modificarUsuario.modo, req.body.modificarUsuario.sonidoNotificacion, req.body.modificarUsuario.notificacion,
                    req.body.modificarUsuario.estado, req.body.modificarUsuario.verificado, req.body.modificarUsuario.fechaAlta);
                await this.PersistenciaPersona.modificar(persona)
                return res.status(200).send({ message: 'Usuario modificado' });
            } else {
                return res.status(403).send({ message: 'El usuario no existe' });
            }
        } else {
            return res.status(403).send({ message: 'Error en el usuario' });
        }
    }
    async eliminar(req, res) {
        var usuario = await this.PersistenciaPersona.buscarIdPersona(req.body.usuario.idPersona);
        if (usuario != null && usuario.estado == true && (usuario.tipoUsuario == true || req.body.idPersona == usuario.idPersona)) {
            //Verificar que el usuario exista
            const existe = await this.PersistenciaPersona.buscarIdPersona(req.body.idPersona);

            if (existe != null) {
                const eventos = await this.PersistenciaEvento.buscarIdPersona(existe.idPersona);
                if (eventos.length != 0) {
                    //Baja lógica si tiene eventos asociados
                    existe.estado = false;
                    await this.PersistenciaPersona.modificar(existe);
                } else {
                    await this.PersistenciaPersona.eliminar(existe.idPersona);
                }
                //Borrado de mensajes privados
                const mensajes = await this.PersistenciaMensaje.listar(existe.email);
                if (mensajes.length != 0) {
                    await mensajes.forEach((f) => {
                        this.PersistenciaMensaje.eliminar(f.idMensajePrivado);
                    });
                }
                return res.status(200).send({ message: 'Usuario eliminado' });
            } else {
                return res.status(403).send({ message: 'El usuario no existe' });
            }
        } else {
            return res.status(403).send({ message: 'Error en el usuario' });
        }
    }

    async registro(req, res) {
        //Verificar que no exista una cuenta con el mail ingresado
        var existe = await this.PersistenciaPersona.buscar(req.body.nuevoUsuario.email);

        if (existe.length == 0 || existe[0].estado == false) {
            var pass = uuid.generate();

            var persona = new Persona(uuidv4(), req.body.nuevoUsuario.nombre, req.body.nuevoUsuario.email, pass, req.body.nuevoUsuario.tipoUsuario,
                req.body.nuevoUsuario.idioma, req.body.nuevoUsuario.modo, req.body.nuevoUsuario.sonidoNotificacion, req.body.nuevoUsuario.notificacion,
                req.body.nuevoUsuario.estado, req.body.nuevoUsuario.verificado, req.body.nuevoUsuario.fechaAlta);
            
            var message = {
                from: "no-reply",
                to: persona.email,
                subject: "MiMontevideo App",
                text: "Plaintext version of the message",
                html: "<p> <h1>" + persona.nombre + "<br>Gracias por registrarte en MiMontevideo App!</h1> <br><h3>Datos de ingreso <br> Usuario: " + persona.email + " </h3><br><h3> Password Temporal: " + persona.pass + " </h3><br><br><h3> Saludos! <br> Equipo MiMontevideo App</h3></p>"
            };

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.nodemailer.user,
                    pass: config.nodemailer.pass 
                },
                tls: {
                    rejectUnauthorized: false
                }
            })

            transporter.sendMail(message, async (error, info) => {
                if (error) {
                    await this.PersistenciaLog.nuevo(uuidv4(), 'Error', 'Error al registrar nuevo usuario', error.message);
                    return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: error.message });
                } else {
                    if (existe.length != 0 && existe[0].estado == false) {
                        existe[0].estado = true;
                        existe[0].pass = pass;
                        existe[0].verificado = false;
                        await this.PersistenciaPersona.modificar(existe[0]);
                    } else {
                        await this.PersistenciaPersona.alta(persona)
                    }
                    return res.status(200).send({ message: 'Verificar email para continuar con el registro' });
                }
            })
        } else {
            return res.status(403).send({ message: 'El usuario se encuentra registrado' });
        }
    }

    async cambiarContrasenia(req, res) {
        if (!req.body.contraseniaActual) {
            return res.status(403).send({ message: 'Error en la contrasenia actual' });
        } else if (!req.body.nuevaContrasenia) {
            return res.status(403).send({ message: 'Error en la nueva contrasenia' });
        } else if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else {
            //Verificar que el usuario exista
            var existe = await this.PersistenciaPersona.buscarIdPersona(req.body.usuario.idPersona);
            if (existe != null && existe.estado == true) {
                if (existe.pass == req.body.contraseniaActual) {
                    existe.pass = req.body.nuevaContrasenia;
                    await this.PersistenciaPersona.modificar(existe);
                    return res.status(200).send({ message: 'Contrasenia modificada' });
                } else {
                    return res.status(403).send({ message: 'La contrasenia actual no es correcta' });
                }
            } else {
                return res.status(403).send({ message: 'Error en el usuario' });
            }
        }
    }

    async restablecer(email, res) {
        var pass = uuid.generate();
        //Verificar que el usuario exista
        var existe = await this.PersistenciaPersona.buscar(email);

        if (existe.length != 0 && existe[0].estado == true) {
            var message = {
                from: "no-reply",
                to: email,
                subject: "MiMontevideo App",
                text: "Plaintext version of the message",
                html: "<p> <h1>" + existe[0].nombre + "<br>Gracias por utilizar MiMontevideo App!</h1><br><h3> Solicitud de restablecimiento de cuenta:</h3><br><h3> Datos de ingreso<br> Usuario: " + email + " </h3><br><h3> Nuevo Password: " + pass + " </h3><br><br><h3> Saludos! <br> Equipo MiMontevideo App</h3></p>"
            };

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.nodemailer.user,
                    pass: config.nodemailer.pass
                },
                tls: {
                    rejectUnauthorized: false
                }
            })

            transporter.sendMail(message, async (error, info) => {
                if (error) {
                    await this.PersistenciaLog.nuevo(uuidv4(), 'Error', 'Error al restablecer cuenta de usuario', error.message);
                    return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: error.message });
                } else {
                    existe[0].pass = pass;
                    await this.PersistenciaPersona.modificar(existe[0]);
                    return res.status(200).send({ message: 'Verificar email para continuar con el restablecimiento de cuenta' });
                } 
            })
        } else {
            return res.status(403).send({ message: 'Usuario no registrado' });
        }
    }

    async controlUsuario() {
        //Borrado automatico de usuarios sin verificar cuenta
        const control = moment().subtract(30, 'minutes');
        var usuarios = await this.PersistenciaPersona.listar();
        usuarios.forEach(u => {
            const fechaAlta = moment(u.fechaAlta.replace('Z', ''));
            if (u.verificado == false && fechaAlta < control) {
                this.PersistenciaPersona.eliminar(u.idPersona);
            }
        });
    }
}

module.exports = LogicaPersona;