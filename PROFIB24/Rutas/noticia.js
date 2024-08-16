'use strict';
const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../Persistencia/Config');
const Log = require('../Modulos/Log');
const { v4: uuidv4 } = require('uuid');
const FabricaLogica = require('../Logica/FabricaLogica');
const fabricaLogica = new FabricaLogica();
const logicaLog = fabricaLogica.createLogica('logicaLog');

router.post('/listar/registros', async (req, res) => {
    try {
        var filtro = req.body.filtro != "" ? req.body.filtro : 'World';
        var lenguage = "es";
        if (req.body.idioma == 'Eng') {
            lenguage = "en";
        } else if (req.body.idioma == 'Por') {
            lenguage = "pt";
        } 
        var url = 'https://newsapi.org/v2/everything?q=' + filtro + '&language=' + lenguage + '&pageSize=15&sortBy=publishedAt&apiKey=' + config.newsapi.api_key;

        const news_get = await axios.get(url)
        return res.status(200).send({ articles: news_get.data.articles })
    } catch (ex) {
        var log = new Log(uuidv4(), 'Error', 'Error al cargar las noticias', ex.message != null ? ex.message: 'Error');
        await logicaLog.nuevo(log);
        return res.status(500).send({ message: 'Ups! Se produjo un error, intenta en unos minutos...', errorCode: ex.message != null ? ex.message: 'Error' });
    }
})
module.exports = router;