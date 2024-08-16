'use strict';
const debug = require('debug')('my express app');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
/*const favicon = require('serve-favicon');*/

const rutas = require('./Rutas/index');
const usuario = require('./Rutas/usuario');
const mensaje = require('./Rutas/mensaje');
const evento = require('./Rutas/evento');
const muro = require('./Rutas/muro');
const categoria = require('./Rutas/categoria');
const log = require('./Rutas/log');
const noticia = require('./Rutas/noticia');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

// vistas - temporal, borrar antes de deployment
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', rutas);
app.use('/usuario', usuario);
app.use('/mensaje', mensaje);
app.use('/evento', evento);
app.use('/muro', muro);
app.use('/categoria', categoria);
app.use('/log', log);
app.use('/noticia', noticia);

// Atrapa errores 404 y los envia al handler de errores
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers---------------------------------------
// development error handler, will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler, no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// setteo de puerto
app.set('port', process.env.PORT || 1337);

// arranque de servidor
const server = app.listen(app.get('port'), function () {
    debug('Servidor express, listening on ' + server.address().port);
});


