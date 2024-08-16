'use strict';
const express = require('express');
const router = express.Router();
const Log = require('../Modulos/Log');
const { v4: uuidv4 } = require('uuid');
const FabricaLogica = require('../Logica/FabricaLogica');
const fabricaLogica = new FabricaLogica();
const logicaLog = fabricaLogica.createLogica('logicaLog');

router.post('/listar/registros', async (req, res) => {
    try {
        var logs = await logicaLog.listar();
        return res.send(JSON.parse(JSON.stringify({ logs })));
    }
    catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al listar logs', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
});
module.exports = router;