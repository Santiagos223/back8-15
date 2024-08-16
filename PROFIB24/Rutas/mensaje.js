'use strict';
const express = require('express');
const router = express.Router();
const Log = require('../Modulos/Log');
const { v4: uuidv4 } = require('uuid');
const FabricaLogica = require('../Logica/FabricaLogica');
const fabricaLogica = new FabricaLogica();
const logicaLog = fabricaLogica.createLogica('logicaLog');
const logicaMensaje = fabricaLogica.createLogica('logicaMensaje');

router.post('/nuevo/enviar', async (req, res) => {
    try {
        var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.mensaje.receptor || !req.body.mensaje.receptor.match(emailFormat)) {
           return res.status(403).send({ message: 'Error en el email destinatario' });
        } else if (!req.body.mensaje.cuerpo || req.body.mensaje.cuerpo.length > 200) {
            return res.status(403).send({ message: 'Error en el contenido del mensaje' });
        } else if (!req.body.mensaje.asunto || req.body.mensaje.asunto.length > 50) {
            return res.status(403).send({ message: 'Error en el asunto' });
        } else if (req.body.mensaje.leido == null) {
            return res.status(403).send({ message: 'Error en el mensaje' });
        } else if (!req.body.mensaje.emisor) {
            return res.status(403).send({ message: 'Error en el mensaje' });
        } else if (!req.body.mensaje.fechaRecepcion) {
            return res.status(403).send({ message: 'Error en el mensaje' });
        } else {
            return await logicaMensaje.enviar(req, res);
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al enviar mensaje', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/listar/recibidos', async (req, res) => {
    try {
        if (!req.body.usuario) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else {
            var mensajes = await logicaMensaje.listar(req.body.usuario);
            return res.send(JSON.parse(JSON.stringify({ mensajes })));
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al listar mensajes', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/modificar/registro', async (req, res) => {
    try {
        var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.mensaje.receptor || !req.body.mensaje.receptor.match(emailFormat)) {
            return res.status(403).send({ message: 'Error en el email destinatario' });
        } else if (!req.body.mensaje.cuerpo || req.body.mensaje.cuerpo.length > 200) {
            return res.status(403).send({ message: 'Error en el contenido del mensaje' });
        } else if (!req.body.mensaje.asunto || req.body.mensaje.asunto.length > 50) {
            return res.status(403).send({ message: 'Error en el asunto' });
        } else if (req.body.mensaje.leido == null) {
            return res.status(403).send({ message: 'Error en el mensaje' });
        } else if (!req.body.mensaje.emisor) {
            return res.status(403).send({ message: 'Error en el mensaje' });
        } else if (!req.body.mensaje.fechaRecepcion) {
            return res.status(403).send({ message: 'Error en el mensaje' });
        } else {
            await logicaMensaje.modificar(req, res);
            return res.status(200).send({ message: 'Mensaje actualizado' });
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al actualizar mensaje', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/eliminar/registro', async (req, res) => {
    try {
        if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.mensaje.idMensajePrivado) {
            return res.status(403).send({ message: 'Error al eliminar mensaje' });
        } else {
            await logicaMensaje.eliminar(req, res);
            return res.status(200).send({ message: 'Mensaje eliminado' });
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al eliminar mensaje', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

module.exports = router;