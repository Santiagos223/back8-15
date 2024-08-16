'use strict';
const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const Log = require('../Modulos/Log');
const { v4: uuidv4 } = require('uuid');
const FabricaLogica = require('../Logica/FabricaLogica');
const fabricaLogica = new FabricaLogica();
const logicaPersona = fabricaLogica.createLogica('logicaPersona');
const logicaLog = fabricaLogica.createLogica('logicaLog');

router.post('/login/ingresar', async (req, res) => {
    try {
        var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!req.body.email || !req.body.email.match(emailFormat)) {
            return res.status(403).send({ message: 'Error en el email' });
        } else if (!req.body.pass) {
            return res.status(403).send({ message: 'Error en la contrasenia' });
        } else {
            var persona = await logicaPersona.login(req.body.email, req.body.pass);
            if (persona != null) {
                return res.status(200).send(JSON.parse(JSON.stringify({ persona })));
            } else {
                return res.status(403).send({ message: 'Usuario y/o contrasenia incorrecta' });
            } 
        }    
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error en login', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/crear/nuevo', async (req, res) => {
    try {
        var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.nuevoUsuario.nombre || req.body.nuevoUsuario.nombre.length > 15) {
            return res.status(403).send({ message: 'Error en el nombre. 15 caracteres como maximo' });
        } else if (!req.body.nuevoUsuario.email || !req.body.nuevoUsuario.email.match(emailFormat)) {
            return res.status(403).send({ message: 'Error en el email' });
        } else if (!req.body.nuevoUsuario.pass) {
            return res.status(403).send({ message: 'Error en la contrasenia' });
        } else if (req.body.nuevoUsuario.tipoUsuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.nuevoUsuario.idioma && (req.body.nuevoUsuario.idioma != 'Esp' || req.body.nuevoUsuario.idioma != 'Eng' || req.body.nuevoUsuario.idioma != 'Por')) {
            return res.status(403).send({ message: 'Error en el idioma' });
        } else if (req.body.nuevoUsuario.modo == null) {
            return res.status(403).send({ message: 'Error en el modo' });
        } else if (!req.body.nuevoUsuario.sonidoNotificacion) {
            return res.status(403).send({ message: 'Error en la opcion sonido' });
        } else if (req.body.nuevoUsuario.notificacion == null) {
            return res.status(403).send({ message: 'Error en opcion notificacion' });
        } else if (req.body.nuevoUsuario.estado != true) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (req.body.nuevoUsuario.verificado == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.nuevoUsuario.fechaAlta) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else {
            return await logicaPersona.alta(req, res);
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al crear usuario', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/listar/registros', async (req, res) => {
    try {
        var usuarios = await logicaPersona.listar();
        return res.send(JSON.parse(JSON.stringify({ usuarios })));
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al listar usuarios', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/modificar/registro', async (req, res) => {
    try {
        var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.modificarUsuario.idPersona) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.modificarUsuario.nombre || req.body.modificarUsuario.nombre.length > 15) {
            return res.status(403).send({ message: 'Error en el nombre. 15 caracteres como maximo' });
        } else if (!req.body.modificarUsuario.email || !req.body.modificarUsuario.email.match(emailFormat)) {
            return res.status(403).send({ message: 'Error en el email' });
        } else if (!req.body.modificarUsuario.pass) {
            return res.status(403).send({ message: 'Error en la contrasenia' });
        } else if (req.body.modificarUsuario.tipoUsuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.modificarUsuario.idioma && (req.body.modificarUsuario.idioma != 'Esp' || req.body.modificarUsuario.idioma != 'Eng' || req.body.modificarUsuario.idioma != 'Por')) {
            return res.status(403).send({ message: 'Error en el idioma' });
        } else if (!req.body.modificarUsuario.modo && (req.body.modificarUsuario.modo != 'Normal' || req.body.modificarUsuario.modo != 'Oscuro')) {
            return res.status(403).send({ message: 'Error en el modo' });
        } else if (!req.body.modificarUsuario.sonidoNotificacion) {
            return res.status(403).send({ message: 'Error en la opcion sonido' });
        } else if (req.body.modificarUsuario.notificacion == null) {
            return res.status(403).send({ message: 'Error en opcion notificacion' });
        } else if (req.body.modificarUsuario.estado == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (req.body.modificarUsuario.verificado == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else {
            return await logicaPersona.modificar(req, res);
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al modificar usuario', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/registrar/nuevo', async (req, res) => {
    try {
        var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!req.body.nuevoUsuario.nombre || req.body.nuevoUsuario.nombre.length > 15) {
            return res.status(403).send({ message: 'Error en el nombre. 15 caracteres como maximo' });
        } else if (!req.body.nuevoUsuario.email || !req.body.nuevoUsuario.email.match(emailFormat)) {
            return res.status(403).send({ message: 'Error en el email' });
        } else if (req.body.nuevoUsuario.tipoUsuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.nuevoUsuario.idioma && (req.body.nuevoUsuario.idioma != 'Esp' || req.body.nuevoUsuario.idioma != 'Eng' || req.body.nuevoUsuario.idioma != 'Por')) {
            return res.status(403).send({ message: 'Error en el idioma' });
        } else if (req.body.nuevoUsuario.modo == null) {
            return res.status(403).send({ message: 'Error en el modo' });
        } else if (!req.body.nuevoUsuario.sonidoNotificacion) {
            return res.status(403).send({ message: 'Error en la opcion sonido' });
        } else if (req.body.nuevoUsuario.notificacion == null) {
            return res.status(403).send({ message: 'Error en opcion notificacion' });
        } else if (req.body.nuevoUsuario.estado != true) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (req.body.nuevoUsuario.verificado == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.nuevoUsuario.fechaAlta) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else {
            return await logicaPersona.registro(req, res);
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al registrar nuevo usuario', ex.message != null ? ex.message: 'Error' );
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/eliminar/registro', async (req, res) => {
    try {
        if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.idPersona) {
            return res.status(403).send({ message: 'Error al eliminar usuario' });
        } else {
            return await logicaPersona.eliminar(req, res);
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al eliminar usuario', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/restablecer/registro', async (req, res) => {
    try {
        var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!req.body.email || !req.body.email.match(emailFormat)) {
            return res.status(403).send({ message: 'Error en el email' });
        } else {
            return await logicaPersona.restablecer(req.body.email, res);
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al restablecer cuenta', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/cambiar/contrasenia', async (req, res) => {
    try {
        return await logicaPersona.cambiarContrasenia(req, res);
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al modificar contraseña', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

cron.schedule('*/30 * * * *', async () => {
    try {
        await logicaPersona.controlUsuario();
    } catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error en control de usuario', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
    }
});

module.exports = router;
