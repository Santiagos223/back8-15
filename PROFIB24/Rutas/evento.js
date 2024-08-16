'use strict';
const express = require('express');
const router = express.Router();
const Log = require('../Modulos/Log');
const { v4: uuidv4 } = require('uuid');
const FabricaLogica = require('../Logica/FabricaLogica');
const fabricaLogica = new FabricaLogica();
const logicaLog = fabricaLogica.createLogica('logicaLog');
const logicaCalificacion = fabricaLogica.createLogica('logicaCalificacion');
const logicaEvento = fabricaLogica.createLogica('logicaEvento');

router.post('/crear/evento', async (req, res) => {
    try {
        if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.evento.imagen && !req.body.evento.imagen.includes("base64")) {
            return res.status(403).send({ message: 'Error en la imagen seleccionada' });
        } else if (!req.body.evento.nombre || req.body.evento.nombre.length > 15) {
            return res.status(403).send({ message: 'Error en el nombre. 15 caracteres como maximo' });
        } else if (!req.body.evento.descripcion) {
            return res.status(403).send({ message: 'Error en la descripcion' });
        } else if (!req.body.evento.idCategoriaEvento) {
            return res.status(403).send({ message: 'Error en la categoria' });
        } else if (!req.body.evento.icono) {
            return res.status(403).send({ message: 'Error en el icono' });
        } else if (req.body.evento.sonido == null) {
            return res.status(403).send({ message: 'Error en la opcion sonido' });
        } else if (req.body.evento.visual == null) {
            return res.status(403).send({ message: 'Error en la opcion visual' });
        } else if (!req.body.evento.duracion || req.body.evento.duracion < 1 || req.body.evento.duracion > 3) {
            return res.status(403).send({ message: 'Error en la duracion' });
        } else if (!req.body.evento.idPersona) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (req.body.evento.fechaRecordatorio.length > 3) {
            return res.status(403).send({ message: 'Error en el evento' });
        } else if (req.body.evento.estado != true) {
            return res.status(403).send({ message: 'Error en el evento' });
        } else if (req.body.evento.calificacion != 0) {
            return res.status(403).send({ message: 'Error en el evento' });
        } else if (!req.body.evento.latitud) {
            return res.status(403).send({ message: 'Error en la ubicacion' });
        } else if (!req.body.evento.longitud) {
            return res.status(403).send({ message: 'Error en la ubicacion' });
        } else if (!req.body.evento.fechaCreacion) {
            return res.status(403).send({ message: 'Error en el evento' });
        } else {
            return await logicaEvento.nuevo(req, res);
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al crear el evento', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/listar/eventos', async (req,res) => {
    try {
        var eventos = await logicaEvento.listar();
        return res.send(JSON.parse(JSON.stringify({ eventos })));
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al actualizar evento', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/modificar/evento', async (req, res) => {
    try {
        if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.evento.idEvento) {
            return res.status(403).send({ message: 'Error en el evento' });
        } else if (!req.body.evento.imagen) {
            return res.status(403).send({ message: 'Error en la imagen seleccionada' });
        } else if (!req.body.evento.nombre || req.body.evento.nombre.length > 15) {
            return res.status(403).send({ message: 'Error en el nombre. 15 caracteres como maximo' });
        } else if (!req.body.evento.descripcion) {
            return res.status(403).send({ message: 'Error en la descripcion' });
        } else if (!req.body.evento.idCategoriaEvento) {
            return res.status(403).send({ message: 'Error en la categoria' });
        } else if (!req.body.evento.icono) {
            return res.status(403).send({ message: 'Error en el icono' });
        } else if (req.body.evento.sonido == null) {
            return res.status(403).send({ message: 'Error en la opcion sonido' });
        } else if (req.body.evento.visual == null) {
            return res.status(403).send({ message: 'Error en la opcion visual' });
        } else if (!req.body.evento.duracion) {
            return res.status(403).send({ message: 'Error en la duracion' });
        } else if (req.body.evento.estado == null) {
            return res.status(403).send({ message: 'Error en el evento' });
        } else if (req.body.evento.fechaRecordatorio.length > 3) {
            return res.status(403).send({ message: 'Error en el evento' });
        } else if (!req.body.evento.latitud) {
            return res.status(403).send({ message: 'Error en la ubicacion' });
        } else if (!req.body.evento.longitud) {
            return res.status(403).send({ message: 'Error en la ubicacion' });
        } else if (!req.body.evento.idPersona) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.evento.fechaCreacion) {
            return res.status(403).send({ message: 'Error en el evento' });
        } else {
            return await logicaEvento.modificar(req, res);
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al modificar evento', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/calificar/evento', async (req, res) => {
    try {
        if (!req.body.calificacionEvento.idEvento) {
            return res.status(403).send({ message: 'Error en el evento' });
        } else if (!req.body.calificacionEvento.idPersona) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (req.body.calificacionEvento.calificacion < 1 || req.body.calificacionEvento.calificacion > 5) {
            return res.status(403).send({ message: 'Error en la calificacion' });
        } else {
            return await logicaCalificacion.calificar(req, res);
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al calificar evento', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/recordatorios/listar', async (req, res) => {
    try {
        if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else {
            var recordatorios = await logicaEvento.listarRecordatorios(req.body.usuario);
            return res.send(JSON.parse(JSON.stringify({ recordatorios })));
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al listar eventos para el usuario', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

module.exports = router;