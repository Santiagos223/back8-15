'use strict';
const express = require('express');
const router = express.Router();
const Log = require('../Modulos/Log');
const { v4: uuidv4 } = require('uuid');
const FabricaLogica = require('../Logica/FabricaLogica');
const fabricaLogica = new FabricaLogica();
const logicaMuro = fabricaLogica.createLogica('logicaMuro');
const logicaLog = fabricaLogica.createLogica('logicaLog');

router.post('/nuevo/mensaje', async (req, res) => {
    try {
        if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.mensaje.cuerpo) {
            return res.status(403).send({ message: 'Error en el contenido del mensaje' });
        } else if (!req.body.mensaje.idPersona) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.mensaje.fechaEnvio) {
            return res.status(403).send({ message: 'Error en el mensaje' });
        } else {
            await logicaMuro.nuevo(req, res);
            return res.status(200).send({ message: 'Mensaje agregado' });
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al postear nuevo mensaje en el muro', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/listar/mensajes', async (req, res) => {
    try {
        var mensajes = await logicaMuro.listar();
        return res.send(JSON.parse(JSON.stringify({ mensajes })));
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al listar mensajes del muro', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/eliminar/mensaje', async (req, res) => {
    try {
        if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.idMensajePublico) {
            return res.status(403).send({ message: 'Error al eliminar mensaje' });
        } else {
            await logicaMuro.eliminar(req, res);
            return res.status(200).send({ message: 'Mensaje eliminado' });
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al eliminar mensaje del muro', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

module.exports = router;