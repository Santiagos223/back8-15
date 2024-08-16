const moment = require('moment');
class Log {
    constructor(idLog, tipo, proceso, mensaje) {
        this.idLog = idLog;
        this.tipo = tipo;
        this.proceso = proceso;
        this.mensaje = mensaje.toLocaleString();
        this.fechaCreacion = moment().format('YYYY/MM/DD');
    }
}
module.exports = Log;