'use strict';
const express = require('express');
const router = express.Router();
const Log = require('../Modulos/Log');
const { v4: uuidv4 } = require('uuid');
const FabricaLogica = require('../Logica/FabricaLogica');
const fabricaLogica = new FabricaLogica();
const logicaLog = fabricaLogica.createLogica('logicaLog');
const logicaCategoria = fabricaLogica.createLogica('logicaCategoria');

router.post('/crear/nuevo', async (req, res) => {
    try {
        if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.categoria.nombre || req.body.categoria.nombre.length > 15) {
            return res.status(403).send({ message: 'Error en el nombre' });
        } else if (req.body.categoria.estado != true) {
            return res.status(403).send({ message: 'Error en la categoria' });
        } else {
            return await logicaCategoria.alta(req, res);
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al crear categoria', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/listar/registros', async (req, res) => {
    try {
        var categorias = await logicaCategoria.listar();
        return res.send(JSON.parse(JSON.stringify({ categorias })));
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al listar categorias', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/modificar/registro', async (req, res) => {
    try {
        if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.categoria.idCategoriaEvento) {
            return res.status(403).send({ message: 'Error en la categoria' });
        } else if (!req.body.categoria.nombre) {
            return res.status(403).send({ message: 'Error en el nombre' });
        } else if (req.body.categoria.estado == null) {
            return res.status(403).send({ message: 'Error en la categoria' });
        } else {
            return await logicaCategoria.modificar(req, res);
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al modificar categoria', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/eliminar/registro', async (req, res) => {
    try {
        if (req.body.usuario == null) {
            return res.status(403).send({ message: 'Error en el usuario' });
        } else if (!req.body.idCategoriaEvento) {
            return res.status(403).send({ message: 'Error en la categoria' });
        } else {
            return await logicaCategoria.eliminar(req, res);
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al eliminar categoria', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});

router.post('/buscar/registro', async (req, res) => {
    try {
        if (!req.body.idCategoriaEvento) {
            return res.status(403).send({ message: 'Error en la categoria' });
        } else {
            var categoria = await logicaCategoria.buscarId(req.body.idCategoriaEvento);
            return res.send(JSON.parse(JSON.stringify({ categoria })));
        }
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al buscar categoria', ex.message != null ? ex.message : 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message : 'Error' });
    }
});

module.exports = router;