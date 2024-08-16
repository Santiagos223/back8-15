'use strict';
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const config = require('../Persistencia/Config');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Servicio MiMontevideo' });
});

//Test
router.post('/:ee/:aa', (req, res) => {
    res.status(400).json(req.params);
});

//Upload images
cloudinary.config({
    secure: config.cloudinary.secure,
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
});

module.exports = router;
